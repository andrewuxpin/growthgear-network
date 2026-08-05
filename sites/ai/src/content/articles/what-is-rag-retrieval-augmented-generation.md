---
title: "What Is RAG? Retrieval-Augmented Generation Explained"
description: "RAG (retrieval-augmented generation) grounds LLM responses in your own documents, cutting hallucinations and enabling current, verifiable business AI answers."
category: "deep-learning"
author:
  name: "Andrew Martin"
publishedAt: 2026-08-06
image:
  src: "/images/what-is-rag-retrieval-augmented-generation.webp"
  alt: "RAG retrieval-augmented generation pipeline diagram showing document chunks, embedding vectors, and retrieval feeding a transformer language model in blue and purple"
tags:
  - rag
  - retrieval-augmented-generation
  - llm
  - deep-learning
  - hallucination
faq:
  - question: "What is RAG (retrieval-augmented generation)?"
    answer: "RAG is a technique that retrieves relevant documents from an external knowledge base and feeds them into a language model's prompt at generation time, so the model answers from your specific data rather than its training corpus. It grounds responses in verifiable sources, cutting hallucinations."
  - question: "How does RAG reduce hallucinations in LLMs?"
    answer: "RAG cuts hallucinations by constraining the model to answer from retrieved source documents in the prompt, not parametric memory. The model can cite the passage it used, and when no relevant documents are found it returns 'I don't know' instead of inventing an answer."
  - question: "RAG vs fine-tuning — which should you use?"
    answer: "Use RAG when you need current, changing, or proprietary knowledge. Fine-tune when you need consistent style, format, or domain reasoning. Most production systems combine both: a fine-tuned base model with RAG retrieval for up-to-date facts. Fine-tune for behavior, RAG for knowledge."
  - question: "How much does a RAG system cost to run?"
    answer: "A small business RAG pipeline typically costs $50–500/month: embedding API calls ($0.02–0.13 per 1M tokens), vector database hosting ($0–100/month for managed tiers), and LLM inference ($0.15–5 per 1M output tokens). Pinecone, Weaviate, and pgvector all have free tiers for prototyping."
  - question: "What are the most common RAG failure modes?"
    answer: "The top RAG failure modes are poor retrieval (wrong chunks), stale indexes, lost-in-the-middle, chunking mismatch, and no fallback when retrieval finds nothing. Most are fixed with better chunking, reranking, hybrid search, and 'no relevant docs' guardrails."
  - question: "Do you need fine-tuning if you have RAG?"
    answer: "Not always. RAG handles knowledge; fine-tuning handles behavior. If your base model follows instructions well and you only need it to use your documents, RAG is enough. Add fine-tuning when you need consistent output format, specialized tone, or domain reasoning prompting cannot deliver."
  - question: "What embedding model should I use for RAG?"
    answer: "OpenAI text-embedding-3-small, Cohere embed-english-v3, and open-source BGE-large or E5-large are strong defaults. Choose by language coverage, dimension size (affects vector DB cost), and whether you need multilingual support. Benchmark recall@5 on your own documents before committing."
keyTakeaways:
  - "RAG grounds LLM responses in your own documents at generation time, cutting hallucinations by 50–70% compared to ungrounded generation in internal-knowledge use cases."
  - "Use RAG for knowledge that changes or is proprietary; use fine-tuning for consistent behavior, style, and format. Production systems increasingly combine both."
  - "A small business RAG stack runs $50–500/month using embedding APIs, a vector database, and an LLM inference endpoint — no GPU infrastructure required."
  - "Retrieval quality is the bottleneck: chunking strategy, embedding choice, and reranking determine 80% of RAG accuracy; the LLM is rarely the weak link."
  - "Always include a 'no relevant documents' fallback so the model says 'I don't know' instead of inventing answers when retrieval returns nothing."
callout:
  variant: "warning"
  title: "Retrieval Is the Bottleneck, Not the LLM"
  content: "Most RAG failures trace to poor retrieval, not weak generation. Invest in chunking, embedding selection, and reranking before swapping LLMs — a better model cannot fix wrong chunks."
---

RAG (retrieval-augmented generation) is the architecture that lets a language model answer questions from your own documents instead of its training data. Introduced by Lewis et al. at Facebook AI Research in 2020 ([arXiv:2005.11401](https://arxiv.org/abs/2005.11401)), RAG retrieves relevant passages from an external knowledge base and injects them into the model's prompt at generation time, grounding each answer in a verifiable source. For businesses, this is the difference between a chatbot that cites your product manual and one that invents a feature.

This guide explains what RAG is, how the four-step pipeline works, when to choose RAG over [fine-tuning](/deep-learning/what-is-fine-tuning-in-deep-learning), what a production system costs, and the failure modes that derail most first deployments.

## What Is RAG (Retrieval-Augmented Generation)?

RAG is a technique that pairs a retriever with a generator so the model reasons over freshly retrieved context, not just knowledge baked into its parameters. The retriever embeds your documents into vectors, finds passages similar to a query, and passes them to the LLM, which generates a grounded answer and can cite which passage it used.

### Why RAG Exists: The Knowledge Problem in LLMs

A [transformer-based language model](/deep-learning/what-is-a-transformer-in-machine-learning) stores everything it learned during pre-training as static weights. It cannot read new information after training ends, it has no access to your private documents, and it cannot tell you when it does not know something — instead it hallucinates plausibly. As IBM Research explains in their [RAG overview](https://research.ibm.com/blog/retrieval-augmented-generation-RAG), parametric memory is frozen at training time, so any fact that changed after the training cutoff is wrong by default.

RAG solves three knowledge problems at once:

- **Currency**: your product specs, pricing, and policies change weekly; the model's training data is months old
- **Privacy**: your internal docs, contracts, and customer records were never in the training corpus
- **Verifiability**: a RAG answer can point to the exact passage it used, while a parametric answer cannot

### The Canonical RAG Definition

**RAG (retrieval-augmented generation) is a technique that retrieves relevant documents from an external knowledge base and feeds them into a language model's prompt at generation time, grounding the model's answer in those specific, verifiable sources rather than the model's frozen training-data memory.**

This is the definition originated by Lewis et al. (2020) and now adopted across the industry. The key distinction from plain prompting: the context is *retrieved dynamically* per query, not hardcoded into a prompt template.

> "Rather than augmenting the input to an existing pretrained seq2seq model, RAG models fine-tune the retriever and generator components together, giving the model access to knowledge stored in a large external corpus." — Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020)

For most business teams today, the retriever and generator are *not* jointly fine-tuned — you plug an off-the-shelf embedding model and an LLM API together. The principle is the same: separate the knowledge store from the reasoning engine so each can be updated independently.

## How Does RAG Work? The Four-Step Pipeline

A RAG pipeline retrieves document chunks, injects them into the LLM's prompt, and generates a grounded answer through four stages: indexing, retrieval, augmentation, and generation. Each stage has a failure surface, and overall accuracy is dominated by retrieval quality, not LLM quality — the [Stanford HAI AI Index 2024](https://aiindex.stanford.edu/report/) notes retrieval-augmented deployments are growing fast.

### Step 1: Indexing — Chunking and Embedding Your Knowledge Base

You split your documents into chunks (typically 200–800 tokens each), embed each chunk into a vector using an embedding model, and store the vectors plus their text in a vector database. Chunking matters because a retriever returns *chunks*, not whole documents — a chunk that is too large dilutes relevance, while one too small loses context.

Key indexing decisions:

- **Chunk size**: 256–512 tokens is the common default; legal or technical docs may need larger windows with overlap
- **Overlap**: 10–20% overlap between chunks preserves context that would otherwise split across boundaries
- **Embedding model**: OpenAI text-embedding-3-small, Cohere embed-english-v3, or open-source BGE-large — the model determines how well semantic similarity maps to relevance
- **Metadata**: tagging each chunk with source, page, date, and section lets you filter retrieval (e.g., "only search 2026 policies")

The vectors and text live in a vector database such as Pinecone, Weaviate, or pgvector (Postgres). Indexing is a one-time cost per document set, refreshed incrementally when content changes.

### Step 2: Retrieval — Finding the Right Chunks

At query time, you embed the user's question with the same embedding model and run a similarity search (usually cosine similarity) against the vector database to return the top-k chunks. This is where most RAG systems win or lose: if the retriever returns irrelevant passages, no LLM can rescue the answer.

Retrieval strategies ranked by sophistication:

| Strategy | How it works | When to use |
|---|---|---|
| **Dense vector search** | Cosine similarity over embeddings | Default starting point; fast, semantic |
| **Hybrid search** | Combine vector + BM25 keyword search | When exact terms (product codes, names) matter |
| **Reranking** | A cross-encoder reranks top-100 → top-5 | When top-5 precision is critical; adds ~50ms |
| **Query expansion** | Rewrite the query with an LLM before retrieval | When user phrasing differs from document phrasing |

Reranking is the single highest-ROI upgrade for most deployments: a cross-encoder reranker (like Cohere Rerank or BGE-reranker) re-scores the top 100 candidates for true relevance, often lifting retrieval precision by 20–40% over plain dense search.

### Step 3: Augmentation — Building the Prompt

The retrieved chunks are inserted into the LLM's prompt, usually as a structured context block with instructions like "Answer the question using only the following context. If the context does not contain the answer, say you don't know." The prompt also typically asks the model to cite which chunk it used, enabling downstream verification.

A minimal RAG prompt:

- System instruction: answer from context only; cite sources; say "I don't know" if context is insufficient
- Retrieved context: top-k chunks, each tagged with its source document
- User question: the original query

### Step 4: Generation — The LLM Produces the Answer

The LLM reads the prompt and generates a grounded answer. Because the relevant knowledge is in the context window, the model does not need to have memorized it during pre-training — it performs [in-context learning](/deep-learning/how-deep-learning-works-complete-guide), reading and reasoning over the provided passages the way a human reads an open book. The answer is returned to the user, often with source citations.

> **Pro tip:** Log the retrieved chunks alongside every answer. When a user reports a wrong answer, the first debugging step is checking whether retrieval returned the right passages — if it did, the problem is generation; if it did not, no prompt tweak will fix it.

## RAG vs Fine-Tuning — Which Should You Choose?

RAG injects knowledge at inference time; fine-tuning bakes behavior into weights. Use RAG for knowledge — current, proprietary, or changing information. Use fine-tuning for behavior — consistent format, specialized tone, or domain reasoning. Most production systems combine both, as our [fine-tuning guide](/deep-learning/what-is-fine-tuning-in-deep-learning) outlines: a fine-tuned base for style, RAG for facts.

### The Decision Framework

| Requirement | RAG | Fine-tuning | Both |
|---|---|---|---|
| Current / changing knowledge | ✓ | | |
| Proprietary documents | ✓ | | |
| Consistent output format | | ✓ | |
| Specialized tone or persona | | ✓ | |
| Domain reasoning style | | ✓ | |
| Reduce inference cost at scale | | ✓ | |
| Citable, auditable answers | ✓ | | |
| Fast iteration without retraining | ✓ | | |

The practical heuristic from teams shipping both: **fine-tune for behavior, RAG for knowledge.** If your documents update monthly, RAG lets you re-index in minutes without touching model weights. If your output must always follow a strict JSON schema or legal citation format, fine-tuning encodes that behavior far more reliably than prompt instructions.

### When RAG Alone Is Enough

RAG handles most internal-knowledge use cases on its own: document Q&A, support chatbots, policy lookup, and any scenario where the answer lives in your text and the base model already reasons well. A well-prompted GPT-4o or Claude with RAG over your documents solves 70–80% of business generative AI needs without any fine-tuning, consistent with the finding in our fine-tuning guide that prompting plus retrieval covers the majority of customization requirements. Teams layering RAG into their [AI marketing automation stack](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation) get the same grounding benefit for campaign and content knowledge bases.

### When You Need Both

Add fine-tuning on top of RAG when:

- **Strict output format**: the model must emit a specific JSON schema or citation format every time, not just usually
- **Specialized reasoning**: legal or medical tasks need domain reasoning patterns, not just domain facts
- **Latency at scale**: a fine-tuned smaller model with RAG can match a larger model's quality at lower inference cost

Sales teams deploying RAG over product and pricing docs often pair it with fine-tuned response formatting to lift [sales conversion rates](https://sales.growthgear.com.au/sales-techniques/how-to-improve-sales-conversion-rates-quickly) on automated replies — the fine-tune ensures consistent tone, while retrieval keeps every quote current.

According to [Gartner's enterprise generative AI research](https://www.gartner.com/en/articles/beyond-chatgpt-the-future-of-generative-ai-for-enterprises), the majority of production deployments in 2025–2026 layer retrieval over a fine-tuned or instruction-tuned base, rather than choosing one exclusively.

---

> **Ready to ground your AI in your own data?** GrowthGear's team has helped 50+ startups build retrieval-augmented systems that cut hallucinations and deliver verifiable answers. [Book a Free Strategy Session](https://growthgear.com.au) to map your RAG architecture.

## Building a Production RAG System — Architecture and Costs

A production RAG system chains an embedding model, a vector database, a retriever, and an LLM endpoint — assembled from managed APIs, with total cost typically $50–500/month for a small business knowledge base. Each component swaps independently, and the dominant cost is LLM inference, not storage. The [Stanford HAI AI Index 2024](https://aiindex.stanford.edu/report/) tracks frontier inference costs falling roughly 80% year-over-year.

### The Reference Architecture

A standard small-business RAG stack:

| Layer | Component | Options | Monthly cost |
|---|---|---|---|
| **Embedding** | Vectorize text chunks | OpenAI text-embedding-3-small, Cohere embed-v3, BGE-large (self-hosted) | $1–20 |
| **Vector store** | Store + search embeddings | Pinecone, Weaviate Cloud, pgvector (Postgres) | $0–100 |
| **Retriever** | Similarity search + optional rerank | In-vector-DB search, Cohere Rerank, BGE-reranker | $0–30 |
| **LLM inference** | Generate the answer | OpenAI, Anthropic, Together AI, self-hosted | $20–300 |
| **Orchestration** | Tie it together | LangChain, LlamaIndex, custom Python | $0 (open source) |

For most teams, pgvector inside an existing Postgres database is the cheapest vector store — it adds vector search to a database you may already run, with no separate service. Pinecone and Weaviate are worth the cost when you need managed scaling, hybrid search, or multi-tenant filtering.

### Chunking and Embedding Choices

Chunking is the indexing decision with the largest downstream impact. As covered in our [feature engineering guide](/machine-learning/what-is-feature-engineering-in-machine-learning), the representation you feed a model determines what it can learn — and in RAG the "features" are your chunks. A chunk that splits a key sentence or separates a term from its definition will not be retrieved for the query that needs it.

Practical chunking guidance:

- **Default**: 512 tokens with 50-token overlap (10%) — works for most prose
- **Technical/legal**: 800–1000 tokens with larger overlap, to preserve clause integrity
- **FAQ/product specs**: chunk by question or spec entry, not by fixed token count
- **Always**: strip boilerplate (headers, footers, nav) before chunking — it pollutes retrieval

### Embedding Model Selection

The embedding model maps text to vectors; its quality directly sets the ceiling on retrieval accuracy. Strong defaults as of 2026:

- **OpenAI text-embedding-3-small**: 1536 dims, $0.02/1M tokens, broad language coverage
- **Cohere embed-english-v3**: 1024 dims, strong on English-only, built-in rerank pairing
- **BGE-large-en (open source)**: 1024 dims, self-hostable, competitive with commercial on English benchmarks
- **E5-large-v2 (open source)**: 1024 dims, strong multilingual, self-hostable

The dimension count matters for vector DB cost: a 1536-dim index costs more to store and search than a 384-dim one. Benchmark recall@5 on your own documents before committing — published leaderboards like MTEB are useful but your domain may differ.

> **Common mistake:** Switching embedding models after indexing forces a full re-embed of every document. Pick your embedding model before you index your first chunk, and treat a later swap as a migration, not a config change.

## Common RAG Failure Modes and How to Fix Them

The five most common RAG failure modes are poor retrieval, stale indexes, lost-in-the-middle, chunking mismatch, and missing fallback — and four of the five are retrieval problems, which is why retrieval quality, not LLM choice, determines most outcomes. A 2024 long-context study ([arXiv:2307.03172](https://arxiv.org/abs/2307.03172)) found models ignore relevant information placed in the middle of long context.

### Failure Mode 1: Poor Retrieval (Wrong Chunks Returned)

The retriever returns chunks that are semantically similar to the query but not actually relevant. Symptoms: the answer is fluent but wrong, or the model says "the context doesn't mention this" when your document does.

Fixes:

- **Reranking**: add a cross-encoder reranker over the top-100 dense results — the single biggest precision lift
- **Hybrid search**: combine dense vector search with BM25 keyword search to catch exact-term matches dense misses
- **Query expansion**: use a small LLM call to rewrite the user query into multiple variants before retrieval

### Failure Mode 2: Stale Index

Your knowledge base changed but the vector index was not refreshed, so retrieval returns outdated passages. Symptoms: answers reference old pricing, retired products, or deleted policies.

Fixes:

- **Incremental re-indexing**: re-embed only changed documents on a schedule or webhook
- **Metadata timestamping**: store a last-updated date on each chunk and filter retrieval by recency where relevant
- **Document-level versioning**: version your source documents and point the index at the current version

### Failure Mode 3: Lost-in-the-Middle

The relevant chunk *was* retrieved but placed in the middle of the context block, and the LLM ignored it — the model attends more to the start and end of long contexts, as documented in the lost-in-the-middle literature.

Fixes:

- **Reorder context**: place the most relevant chunk first and last in the context block, not in the middle
- **Reduce top-k**: return fewer, higher-precision chunks rather than padding context with marginal results
- **Reranking then truncation**: rerank to get true top-5, then pass only those — quality over quantity

### Failure Mode 4: Chunking Mismatch

Your chunk size or boundaries split the information the query needs across two chunks, so neither is retrieved as fully relevant. Example: a product's price and its conditions sit in adjacent chunks; a query about "price under these conditions" retrieves one but not both.

Fixes:

- **Larger chunks with overlap**: increase overlap so cross-boundary context survives
- **Semantic chunking**: chunk by section or heading rather than fixed token count, so related content stays together
- **Parent-document retrieval**: retrieve small chunks but return their parent document section to the LLM

### Failure Mode 5: No Fallback When Retrieval Finds Nothing

When the retriever returns low-relevance chunks (or nothing), the LLM still tries to answer, hallucinating from whatever marginal context it got. This is the failure that produces the most damaging wrong answers because the output looks confident.

Fixes:

- **Similarity threshold**: set a minimum cosine score below which the system returns "I don't know" instead of passing marginal chunks to the LLM
- **Explicit guardrail prompt**: instruct the model to say "The provided documents don't contain this" when context is insufficient
- **Empty-context handling**: if top-k returns zero chunks, short-circuit to a no-answer response without calling the LLM at all

### RAG Failure Modes Summary

| Failure | Symptom | Root cause | Fix |
|---|---|---|---|
| Poor retrieval | Fluent but wrong answer | Weak embedding / no rerank | Reranker + hybrid search |
| Stale index | References outdated info | Index not refreshed | Incremental re-indexing |
| Lost-in-the-middle | Model ignores relevant chunk | Context ordering | Reorder / reduce top-k |
| Chunking mismatch | Relevant info split across chunks | Fixed-size chunking | Semantic chunking + overlap |
| No fallback | Confident hallucination | No similarity threshold | Threshold + guardrail prompt |

---

## Take the Next Step

Retrieval-augmented generation is the architecture that turns a general LLM into a reliable expert on your own documents — grounding every answer in a citable source and letting you update knowledge without retraining. Whether you are building your first internal-knowledge chatbot or scaling a production RAG pipeline across multiple data sources, GrowthGear can help you design the retrieval, chunking, and evaluation strategy that makes the system trustworthy.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Sources & References

1. [Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"](https://arxiv.org/abs/2005.11401) — "RAG models combine a retriever and generator to access knowledge in an external corpus, outperforming parametric-only baselines on open-domain QA" (2020)
2. [IBM Research, "Retrieval-Augmented Generation (RAG)"](https://research.ibm.com/blog/retrieval-augmented-generation-RAG) — "RAG grounds model outputs in external knowledge, reducing hallucinations and enabling verifiable answers" (2023)
3. [Stanford HAI, AI Index Report 2024](https://aiindex.stanford.edu/report/) — "Frontier model inference costs fell ~80% year-over-year; retrieval-augmented enterprise deployments grew rapidly" (2024)
4. [Gartner, "Beyond ChatGPT: The Future of Generative AI for Enterprises"](https://www.gartner.com/en/articles/beyond-chatgpt-the-future-of-generative-ai-for-enterprises) — "Most production GenAI deployments layer retrieval over a fine-tuned or instruction-tuned base rather than choosing one approach exclusively" (2024)
5. [Liu et al., "Lost in the Middle: How Language Models Use Long Contexts"](https://arxiv.org/abs/2307.03172) — "Models perform worse when relevant information is placed in the middle of long input contexts" (2024)
