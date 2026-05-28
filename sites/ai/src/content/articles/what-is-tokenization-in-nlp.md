---
title: "What Is Tokenization in NLP? A Complete Guide"
description: "What is tokenization in NLP? Practical guide to BPE, WordPiece, and SentencePiece tokenizers, their business impact, costs, and how to choose one."
category: "machine-learning"
author:
  name: "GrowthGear Team"
publishedAt: 2026-05-29
image:
  src: "/images/what-is-tokenization-in-nlp.webp"
  alt: "Diagram of tokenization in NLP showing text being split into subword tokens for a transformer model"
tags:
  - tokenization
  - nlp
  - transformers
  - large-language-models
  - machine-learning
faq:
  - question: "What is tokenization in NLP?"
    answer: "Tokenization in NLP is the process of splitting raw text into smaller units called tokens (words, subwords, or characters) and mapping each token to an integer ID that a model can process. It is the first step in every modern NLP pipeline."
  - question: "What is the difference between word and subword tokenization?"
    answer: "Word tokenization splits text on whitespace and punctuation. Subword tokenization (BPE, WordPiece, SentencePiece) splits rare or long words into smaller frequent pieces, so unseen words can still be represented from known fragments — the standard for modern transformers."
  - question: "What tokenizer does GPT use?"
    answer: "OpenAI's GPT-3.5, GPT-4, and GPT-4o use byte-level Byte-Pair Encoding (BPE) — the tiktoken cl100k_base vocabulary has roughly 100,000 tokens. Earlier GPT-2 used a 50,257-token BPE vocabulary trained on web text."
  - question: "How many characters are in a token?"
    answer: "In English, one token is roughly 4 characters or 0.75 words on average for GPT tokenizers. A 1,000-word document is typically about 1,300 tokens. Languages with non-Latin scripts can use 2-4x more tokens for the same meaning."
  - question: "Why does tokenization affect AI costs?"
    answer: "Commercial LLM APIs (OpenAI, Anthropic, Google) bill per token of input and output. A more efficient tokenizer produces fewer tokens for the same text, which directly reduces API spend and lets more content fit in the context window."
  - question: "Do I need a custom tokenizer for my business?"
    answer: "Usually no. Reuse the tokenizer that ships with your base model. Train a custom tokenizer only when you fine-tune on heavily specialised text — code, medical records, or non-Latin scripts — where the default vocabulary fragments your domain terms into too many tokens."
  - question: "How does tokenization fit with embeddings?"
    answer: "Tokenization produces integer IDs; an embedding layer then maps each ID to a dense vector the transformer can process. Tokenization and embedding are two distinct steps — tokenization decides what counts as a unit, embedding decides what each unit means semantically."
keyTakeaways:
  - "Tokenization splits raw text into tokens and maps each to an integer ID — it is the first step in every transformer pipeline and runs before [word embedding](/deep-learning/what-is-word-embedding-in-nlp)."
  - "Modern LLMs use subword tokenization (BPE, WordPiece, or SentencePiece) so they can represent any word — including rare names, code, or typos — from known fragments without an out-of-vocabulary error."
  - "Tokenizer choice directly drives commercial LLM cost. The same 1,000-word document can produce 1,300 tokens in English or 3,000+ tokens in Japanese with the same model, multiplying API spend 2-3x."
  - "Match the tokenizer to the base model — GPT uses cl100k_base BPE, BERT uses WordPiece, T5 and LLaMA use SentencePiece. Mixing tokenizers between train and inference silently corrupts outputs."
  - "Custom tokenizers help only for narrow domains (code, medical, non-Latin scripts) where the default vocabulary fragments domain terms into wasteful 5-8 token sequences."
callout:
  variant: "tip"
  title: "Estimate Token Counts Before You Build"
  content: "Use OpenAI's free tokenizer playground or the tiktoken library to count tokens on a sample of your real data before estimating API cost — character counts can mislead by 2-3x."
---

Tokenization decides how every transformer model — GPT-4, Claude, T5, BERT — actually sees your text. It is the unglamorous first step that happens before [word embedding](/deep-learning/what-is-word-embedding-in-nlp), before [attention](/deep-learning/attention-mechanism-deep-learning-explained), and before any prediction. It also drives a surprising amount of business outcome: it shapes API cost, context window utilisation, multilingual quality, and how cleanly a fine-tune learns domain terms.

This guide explains what tokenization is, how it works end-to-end, the four methods that dominate production NLP, why it matters for business AI budgets, and how to pick the right tokenizer when you launch an LLM project.

## What Is Tokenization in NLP

Tokenization in NLP is the process of splitting raw text into smaller units called **tokens** — words, subwords, or characters — and mapping each token to an integer ID from a fixed vocabulary that a model can process. Every modern transformer, from GPT-4 to BERT to T5, runs tokenization as the first step in its inference pipeline.

### From characters to model inputs

Neural networks operate on numbers, not strings. To feed `"The CEO resigned."` into a transformer, you need to convert it to a sequence of integers like `[791, 12432, 38935, 13]`. Tokenization is the bridge: it decides where to cut the text, how to handle whitespace and punctuation, and which integer to assign to each piece.

The unit a tokenizer produces is called a **token**. Tokens can be:

- **Whole words** (the original, simplest approach — `"The"`, `"CEO"`, `"resigned"`)
- **Subwords** (the modern default — `"The"`, `"CE"`, `"O"`, `"resign"`, `"ed"`)
- **Characters** (rare; used by ByT5 and a few research models)
- **Bytes** (used by GPT-2/3/4 byte-level BPE, handles any language)

### Why tokenization is the first step in every NLP pipeline

Every transformer architecture — from BERT understanding to GPT generation to [T5 sequence-to-sequence](/deep-learning/what-is-t5-model-in-nlp) — assumes the input is already a sequence of integer token IDs. The tokenizer is the only component that sees raw text. Once your text is tokenised, every downstream step (embedding lookup, positional encoding, self-attention) operates on the resulting IDs.

This makes tokenization a one-way contract between your data and your model. Change the tokenizer after training, and the integer IDs no longer match what the model learned — outputs degrade silently, often without raising an error.

## How Tokenization Works

Modern NLP tokenization runs four steps in sequence: pre-tokenization splits text on whitespace and punctuation, subword segmentation breaks rare words into known fragments, vocabulary lookup converts each piece to an integer ID, and decoding reverses the chain when the model produces output. Each step shapes both model quality and inference cost.

### Step 1: Pre-tokenization

Pre-tokenization is the first cut — usually splitting on whitespace and punctuation. For `"Let's tokenise this!"`, a typical pre-tokenizer outputs `["Let", "'s", "tokenise", "this", "!"]`. This step is fast and language-aware: it handles contractions, punctuation, and (for languages like Chinese or Japanese) script segmentation.

GPT tokenizers actually merge punctuation into adjacent tokens to compress whitespace-heavy text. BERT's WordPiece strips accents and lowercases for the `bert-base-uncased` model. SentencePiece skips pre-tokenization entirely and treats the raw string (including spaces) as the input.

### Step 2: Subword segmentation

This is where the tokenizer earns its keep. **Subword segmentation** breaks long or rare words into smaller pieces that appear in the vocabulary. Three algorithms dominate production NLP:

- **[Byte-Pair Encoding (BPE)](https://arxiv.org/abs/1508.07909)** — start with characters, iteratively merge the most frequent pair until you hit the target vocabulary size (Sennrich, Haddow & Birch, ACL 2016).
- **WordPiece** — similar to BPE but merges the pair that maximises the training corpus likelihood, not raw frequency (Wu et al., Google 2016, Neural Machine Translation paper).
- **Unigram** — start with a large vocabulary and prune the lowest-probability pieces; backs [SentencePiece](https://arxiv.org/abs/1808.06226) (Kudo, ACL 2018, *Subword Regularization*).

For an unfamiliar word like `"unbelievable"`, a BPE tokenizer might emit `["un", "bel", "iev", "able"]`. The vocabulary stays small, but any English word can be reconstructed from known pieces.

### Step 3: Token-to-ID mapping

Once segmentation finishes, the tokenizer looks up each piece in its vocabulary table and emits an integer. The cl100k_base vocabulary used by GPT-4 has roughly 100,000 entries; BERT base has 30,522; T5 has 32,000; mT5 (multilingual) has 250,112 (Hugging Face Transformers documentation 2024).

Most vocabularies reserve a few **special tokens**:

| Token | Purpose |
|---|---|
| `[CLS]` / `<s>` | Beginning of sequence (classification or generation anchor) |
| `[SEP]` / `</s>` | Sentence or document boundary |
| `[PAD]` | Padding short sequences to a fixed length |
| `[MASK]` | Masked positions for masked-language-model training |
| `[UNK]` | Unknown token (falls through when subword segmentation fails) |

### Step 4: Decoding back to text

When a generative model produces output IDs, the tokenizer runs the chain in reverse: IDs → token strings → joined text. Byte-level BPE (GPT) and SentencePiece guarantee perfect round-trip — any byte sequence in, the same byte sequence out. WordPiece does not, because it strips accents and lowercases by default in `bert-base-uncased`, which is fine for classification but loses information for generation.

## Tokenization Methods Compared

The four dominant tokenization methods — Byte-Pair Encoding, WordPiece, SentencePiece (Unigram), and byte-level BPE — each make different tradeoffs between vocabulary size, multilingual quality, and decoder fidelity. Choosing the right one is usually a matter of matching whatever ships with the base model you intend to use.

### Byte-Pair Encoding (BPE)

BPE was introduced for neural machine translation by Sennrich, Haddow & Birch (ACL 2016) and has become the default for the GPT family. It builds a vocabulary by repeatedly merging the most frequent character pair in the corpus until the target vocabulary size is reached.

**Used by:** GPT-2, GPT-3, GPT-3.5, GPT-4, GPT-4o, RoBERTa, BART, LLaMA (in SentencePiece form), Mistral.

**Strengths:** Predictable. Fast. Cleanly handles rare words by falling back to character bytes. Easy to extend with new domain terms.

**Tradeoffs:** Pre-tokenization on whitespace means BPE handles Chinese, Japanese, and Korean (CJK) inefficiently — each character can become its own token, inflating cost 3-4x versus English.

> **Common mistake:** Estimating GPT-4 API cost from word counts. Use OpenAI's tiktoken library on a real sample — Chinese, Japanese, code, and JSON all tokenise denser than English prose.

### WordPiece

WordPiece, developed by Google for the BERT family (Wu et al., 2016), differs from BPE in one important way: instead of merging the most *frequent* pair, it merges the pair that gives the largest increase in training corpus *likelihood* under a unigram language model. The result is a slightly different vocabulary with marginally better downstream classification accuracy.

**Used by:** BERT, DistilBERT, MobileBERT, ELECTRA, [BERT-family encoders for production NLP](/deep-learning/what-is-bert-in-nlp-guide).

**Strengths:** Strong performance on understanding tasks (classification, NER, sentence similarity). Sub-tokens are prefixed with `##` (e.g., `##able`), making them visually distinct.

**Tradeoffs:** Aggressive normalisation in the `uncased` variants destroys casing and accents — fine for classification, but a problem if you need exact text round-trips.

### SentencePiece with Unigram

SentencePiece (Kudo & Richardson, EMNLP 2018) wraps Unigram language model subword learning into a framework that treats the input as a raw byte stream — including spaces. The result is a tokenizer that needs no pre-tokenization, works equally well on space-delimited and non-space-delimited languages, and round-trips text losslessly.

**Used by:** T5, mT5, FLAN-T5, ALBERT, XLM-R, LLaMA, LLaMA 2, LLaMA 3, Mistral 7B, Gemma.

**Strengths:** Best multilingual fidelity. Lossless round-trip. Single tokenizer artefact that works across all languages.

**Tradeoffs:** Slightly slower to train than BPE on the same corpus. The Unigram algorithm produces stochastic segmentations during training (a feature for [regularisation](/machine-learning/what-is-overfitting-in-machine-learning)) but means a single text can have multiple valid tokenisations.

### Byte-level BPE

Byte-level BPE is the GPT-family innovation that applied BPE not to Unicode characters but to raw bytes. With 256 byte values, the tokenizer can represent any text in any language without an `[UNK]` token — every input is in-vocabulary by construction.

**Used by:** GPT-2 through GPT-4o, the OpenAI tiktoken family (`r50k_base`, `p50k_base`, `cl100k_base`, `o200k_base`).

**Strengths:** No unknown tokens, ever. Handles emoji, code, mixed scripts, and noisy data robustly. The [OpenAI Tokenizer playground](https://platform.openai.com/tokenizer) lets you preview the output on any string.

**Tradeoffs:** Tokens correspond to byte sequences, so non-Latin scripts use 2-4x more tokens than English. A 1,000-character English document is ~250 cl100k_base tokens; the same content in Japanese is often 600-800 tokens.

> **Ready to deploy NLP in your business?** GrowthGear's team has helped 50+ startups pick the right LLM stack — tokenizer included — for production. [Book a Free Strategy Session](https://growthgear.com.au) to plan your NLP roadmap.

## Why Tokenization Matters for Business AI

Tokenization is invisible until it hits the budget line. Token choice drives three things every CFO will eventually ask about: API cost per request, how much context a model can use, and how well the system performs on non-English data. A tokenizer that is 20% denser can cut your LLM bill 20% with no quality loss.

### Token count drives API cost

Every commercial LLM provider — OpenAI, Anthropic, Google, Cohere — bills per input and output token. A 2026 pricing snapshot from the OpenAI platform docs: GPT-4o runs about $2.50 per million input tokens and $10 per million output tokens; Claude 3.5 Sonnet sits at $3 input and $15 output (Anthropic API documentation).

The business impact is direct:

| Content type | English tokens | Japanese tokens | Cost ratio (GPT-4o) |
|---|---|---|---|
| 1,000-word document | ~1,300 | ~3,000 | 2.3x more |
| 50-word customer email | ~65 | ~150 | 2.3x more |
| Same JSON payload | ~400 | ~400 | 1x (no script effect) |
| Python source file (200 LOC) | ~1,400 | n/a | n/a |

For a customer-support team processing 100,000 emails per month at 65 input tokens each via GPT-4o, the difference between English-only ($16) and Japanese-only ($38) is small in absolute terms but a 2.3x markup. Roll that across [marketing automation that generates millions of LLM calls](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation), and the multiplier matters.

### Tokenizer choice changes context window utilisation

Modern LLMs advertise large context windows — GPT-4 Turbo at 128,000 tokens, Claude 3.5 at 200,000, Gemini 1.5 Pro at up to 2,000,000. But the real question is how much *content* fits inside the budget. For English text in cl100k_base, 128K tokens buys roughly 96,000 words — about 300 pages of plain prose. For the same Chinese content with the same tokenizer, that 128K window fits closer to 30,000-40,000 words.

A team building a RAG pipeline over a Japanese knowledge base will hit its context limit 2-3x earlier than the same team over an English knowledge base. The fix is usually picking a different model with a multilingual tokenizer (mT5 or Gemini) or compressing input upstream.

### Multilingual support depends on tokenizer

The mT5 tokenizer (250,112 vocabulary, trained on 101 languages) gives roughly even token-per-word ratios across languages — a multilingual SaaS that serves Australian English, Bahasa Indonesia, and Japanese customers can use one model without per-language cost surprises. cl100k_base, trained predominantly on English, biases heavily toward English efficiency.

For a B2B sales tool deploying [LLM-assisted lead generation in non-English markets](https://sales.growthgear.com.au/b2b-sales/best-lead-generation-strategies-b2b-companies), the cost gap between an English-biased and multilingual tokenizer can decide whether the pilot is profitable.

## Choosing the Right Tokenizer

For 95% of business AI projects, the right tokenizer is whichever one ships with the model you have already chosen. Custom tokenisers help in narrow cases: heavily specialised text (code, medical, legal) where the default vocabulary fragments domain terms; non-Latin scripts where multilingual coverage is missing; or very-high-volume APIs where a 10-15% efficiency gain compounds at scale.

### Match the tokenizer to the model

This is the single most important rule. Each pre-trained model expects integer IDs from its original vocabulary. Using a different tokenizer means the model sees nonsense — token ID 1234 that meant "the" in the original vocabulary might mean "asteroid" in your replacement.

| Model | Tokenizer | Vocab size |
|---|---|---|
| GPT-3.5 / GPT-4 / GPT-4o | cl100k_base / o200k_base (byte-level BPE) | ~100K / ~200K |
| Claude 3 / 3.5 | Anthropic BPE variant | ~100K |
| BERT base / DistilBERT | WordPiece | 30,522 |
| T5 / FLAN-T5 | SentencePiece (Unigram) | 32,000 |
| mT5 | SentencePiece (Unigram, multilingual) | 250,112 |
| LLaMA 3 / Mistral / Gemma | SentencePiece BPE | 32,000-128,000 |

[Hugging Face's `AutoTokenizer.from_pretrained(model_name)`](https://huggingface.co/docs/tokenizers/index) enforces this match automatically — if you go through Hugging Face, you cannot mismatch by accident.

### Estimate cost with the right tokenizer

Before signing an LLM contract, run a representative sample of your real data through the actual tokenizer. OpenAI offers a free in-browser tokenizer; Hugging Face's `tokenizers` library does the same for every open model. A 30-minute spike here can prevent a 30% budget surprise three months in.

Useful sample sizes:

- **Pilot project:** 100 representative documents, average + p95 token counts
- **Production planning:** 10,000-document sample by content type (email, ticket, document, code)
- **High-volume API:** 1M-token sample across a full week of traffic

### Custom tokenisers and when they help

Train your own tokenizer when the default fragments your domain too aggressively. Concrete signals: your average token-per-word ratio on domain text exceeds 1.8 (English), or your most common terms break into 5+ pieces. Medical notes (ICD codes, drug names), legal text (statute citations), and code (long variable names, framework symbols) are the canonical cases.

A custom tokenizer over a 1M-document corpus typically takes 1-4 hours of CPU time using SentencePiece or Hugging Face's `tokenizers` library. The downstream model then needs to be either pre-trained or [fine-tuned](/deep-learning/what-is-fine-tuning-in-deep-learning) with the new tokenizer in place — you cannot bolt a custom tokenizer onto a stock GPT-4 deployment.

### Common production mistakes

Five tokenization pitfalls that the GrowthGear team sees regularly in client AI projects:

- **Estimating cost from character or word counts.** Real token counts can be 1.5-3x higher depending on language and content type. Always sample with the actual tokenizer.
- **Mixing tokenizers between training and inference.** Subtle and silent — the model produces nonsense without throwing an error. Always pin the tokenizer artefact alongside the model checkpoint.
- **Using the wrong tokenizer variant.** `bert-base-uncased` strips case; `bert-base-cased` preserves it. Choosing the wrong variant for case-sensitive tasks (NER over proper nouns) tanks accuracy.
- **Forgetting special tokens.** Adding `[CLS]`/`[SEP]` correctly is required for BERT classification heads; omitting them on inference is a common cause of "model worked in dev, broke in prod."
- **Ignoring multilingual data drift.** Launching with English-only text, then adding a Japanese customer segment, can silently 2-3x your LLM bill. Monitor token-per-document metrics in production.

## Tokenization at a Glance

| Method | Primary models | Vocab size | Strength | Tradeoff |
|---|---|---|---|---|
| **Byte-level BPE** | GPT-3.5/4/4o, GPT-2, RoBERTa | 50K-200K | Robust to any language, no [UNK] | Inefficient on non-Latin scripts |
| **WordPiece** | BERT, DistilBERT, ELECTRA | ~30K | Best classification accuracy | Lossy round-trip in uncased variants |
| **SentencePiece (Unigram)** | T5, mT5, ALBERT, XLM-R | 32K-250K | Lossless multilingual | Slower training, stochastic segmentation |
| **SentencePiece BPE** | LLaMA, Mistral, Gemma | 32K-128K | Open-model standard | Tokens vary across versions |
| **Whole-word** | Pre-2017 NLP, classic NER | 50K+ | Human-interpretable | Many out-of-vocabulary errors |
| **Character-level** | ByT5, research models | 256-1,000 | No OOV ever | 4-8x more tokens per input |

---

## Take the Next Step

Tokenization is one of the small, easy-to-miss decisions that compounds into a large bill — or a large cost saving — over the life of an NLP project. Whether you are picking a base LLM, sizing a fine-tune, or planning a multilingual rollout, the tokenizer is worth a half-day of analysis before you commit to a vendor or architecture.

If you are evaluating LLM tooling, planning a custom fine-tune, or trying to control runaway token spend across a growing AI footprint, GrowthGear's team has helped 50+ startups put pragmatic NLP infrastructure in place.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Sources & References

- Sennrich, R., Haddow, B., & Birch, A. (2016). *Neural Machine Translation of Rare Words with Subword Units.* ACL 2016. arXiv:1508.07909.
- Kudo, T. & Richardson, J. (2018). *SentencePiece: A simple and language independent subword tokenizer.* EMNLP 2018. arXiv:1808.06226.
- Kudo, T. (2018). *Subword Regularization: Improving Neural Network Translation Models with Multiple Subword Candidates.* ACL 2018.
- Wu, Y. et al. (2016). *Google's Neural Machine Translation System: Bridging the Gap between Human and Machine Translation.* Google Research.
- Hugging Face Transformers and Tokenizers Documentation (2024).
- OpenAI Tokenizer documentation and tiktoken library (2024).
- Stanford HAI Artificial Intelligence Index Report (2024).
- McKinsey State of AI 2024 — 65% of organisations using generative AI regularly.
