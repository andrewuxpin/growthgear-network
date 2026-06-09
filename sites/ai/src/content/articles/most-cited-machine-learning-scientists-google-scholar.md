---
title: "Most-Cited Machine Learning Scientists on Google Scholar"
description: "A business leader's guide to the leading machine learning scientists on Google Scholar, ranked by citation count and the research direction each one drives."
category: "machine-learning"
author:
  name: "Andrew Martin"
publishedAt: 2026-06-10
image:
  src: "/images/most-cited-machine-learning-scientists-google-scholar.webp"
  alt: "Isometric illustration of a citation network connecting leading machine learning scientists across universities and research labs"
tags:
  - machine-learning
  - research
  - ai-leaders
  - deep-learning
  - vendor-evaluation
faq:
  - question: "Who is the most cited machine learning scientist on Google Scholar?"
    answer: "Yoshua Bengio (Mila / Université de Montréal) and Geoffrey Hinton (Toronto / ex-Google) routinely trade the top spot, each with over 800,000 Google Scholar citations as of late 2024. Both received the 2018 Turing Award alongside Yann LeCun."
  - question: "Why do Google Scholar citation counts matter for business AI decisions?"
    answer: "Citation counts are a proxy for research influence — they help business leaders identify the labs and people driving the techniques inside vendor products, evaluate technical advisors, and choose conferences worth sponsoring. They are not a direct measure of commercial value."
  - question: "How accurate are Google Scholar citation counts?"
    answer: "Google Scholar citations are higher than Scopus or Web of Science because it indexes preprints, theses, and workshop papers. The relative ranking between scientists is reliable; the absolute count is best read as an order-of-magnitude signal."
  - question: "Who won the 2018 Turing Award for deep learning?"
    answer: "The 2018 ACM A.M. Turing Award was shared by Yoshua Bengio, Geoffrey Hinton, and Yann LeCun for conceptual and engineering breakthroughs that made deep neural networks a critical component of computing."
  - question: "Which machine learning researchers won a Nobel Prize in 2024?"
    answer: "Geoffrey Hinton shared the 2024 Nobel Prize in Physics with John Hopfield for foundational work on artificial neural networks. Demis Hassabis and John Jumper shared the 2024 Nobel Prize in Chemistry for AlphaFold2."
  - question: "How should a CTO use a list of top ML researchers when picking a vendor?"
    answer: "Look at whose papers the vendor's engineering team cites in technical posts, whose ex-students built the product, and which labs the company collaborates with on benchmarks. Lineage to a high-citation lab is a stronger signal than marketing claims about 'proprietary AI'."
  - question: "Are industry researchers like Ilya Sutskever and Demis Hassabis cited as heavily as academics?"
    answer: "Yes. Sutskever (AlexNet, seq2seq, AlphaGo coauthor) sits around 400,000+ citations and Hassabis (DeepMind, AlphaGo, AlphaFold) is over 200,000. Industry researchers at DeepMind, Meta AI, Google Brain, and OpenAI now match or exceed many academic labs."
keyTakeaways:
  - "Yoshua Bengio, Geoffrey Hinton, and Yann LeCun — the 2018 Turing Award trio — are the three most-cited deep learning scientists, each above 480,000 Google Scholar citations as of late 2024."
  - "Statistical foundations matter: Robert Tibshirani, Trevor Hastie, and Michael I. Jordan sit in the 300,000–410,000 citation range and authored the textbooks behind most production ML pipelines."
  - "Citation counts are a proxy for influence, not commercial value — use them to evaluate vendor lineage, technical advisors, and conference sponsorships, not to pick tools."
  - "Industry labs now match academia: DeepMind's Demis Hassabis and ex-OpenAI's Ilya Sutskever are inside the global top 50 ML researchers by citations."
  - "Schmidhuber, Manning, Vaswani, Mikolov, Goodfellow, and Fei-Fei Li each authored the single paper behind a category that defines modern AI — LSTM, GloVe, Transformers, Word2Vec, GANs, and ImageNet."
callout:
  variant: "tip"
  title: "Read the source, not the headline"
  content: "When a vendor cites a 'breakthrough paper', open it on Google Scholar yourself. The citation count and follow-on papers tell you whether the field accepted the claim or quietly moved on."
---

The most-cited machine learning scientists on Google Scholar are a small group whose papers shape almost every production AI system in use today. **Yoshua Bengio** (Mila / Université de Montréal) and **Geoffrey Hinton** (Toronto / ex-Google) sit at the top with over 800,000 citations each as of late 2024, followed by **Yann LeCun** (Meta / NYU) above 480,000. Between them, the trio shared the 2018 ACM A.M. Turing Award — the field's highest honor — for the conceptual breakthroughs that made [deep learning](/deep-learning/how-deep-learning-works-complete-guide) work in production.

For business leaders, the list matters less as a leaderboard and more as a map. The labs and people on it drive the techniques behind every commercial AI product you evaluate, every benchmark your vendors cite, and every candidate you interview for a senior ML role. According to the [Stanford HAI AI Index 2024](https://aiindex.stanford.edu/report/), private AI investment hit $67.2 billion in the United States in 2023 — and most of that capital flows through people whose Google Scholar profiles are linked below.

This article ranks the leading machine learning scientists by Google Scholar citation count, explains why each one matters for business AI decisions, and gives you a practical way to use the list when evaluating vendors, hiring, or briefing a board on AI strategy.

## Why Google Scholar Citations Matter for AI Business Decisions

Google Scholar citation counts measure how often a researcher's papers have been cited by other academic and technical work. For business AI decisions, the count is a proxy for research influence — a high citation count means the methods inside your vendor's product likely trace back to that scientist's work, even if their name does not appear in the marketing material.

Citation counts are useful for three concrete business tasks: vendor lineage checks, technical advisor selection, and conference sponsorship decisions. They are not useful for picking specific tools, projecting ROI, or comparing pricing. **A scientist with 500,000 citations did not build a product — they shaped a field that your shortlisted vendors operate inside.**

### What Google Scholar counts (and what it doesn't)

Google Scholar indexes peer-reviewed journal papers, conference proceedings (NeurIPS, ICML, ICLR, CVPR, ACL, etc.), preprints on arXiv, university theses, and many workshop papers. It does not weight self-citations or filter low-quality venues, which is why Scholar counts are typically 2-3x higher than [Scopus](https://www.scopus.com/) or [Web of Science](https://clarivate.com/products/scientific-and-academic-research/research-discovery-and-workflow-solutions/webofscience-platform/) for the same researcher.

The relative ranking between scientists is reliable. The absolute number is best read as an order of magnitude — 800,000 versus 80,000 means "field-defining" versus "highly influential", not a precise multiplier.

### The "h-index" alternative

Some labs prefer the **h-index** — the largest number h such that a researcher has h papers each cited at least h times. The h-index penalizes researchers who have one famous paper and little else. Bengio, Hinton, and LeCun all have h-indexes above 180 — the highest in any computing discipline ([Microsoft Academic data via DBLP](https://dblp.org/)).

For business purposes, raw citation count is the more interpretable metric: a higher number means more downstream work depends on the researcher's contributions.

> **Pro tip:** When a vendor pitches a "proprietary AI architecture", search Google Scholar for the underlying technique. If the foundational paper has fewer than 50 citations, the claim is either too new for peer review or too narrow to matter.

## The Turing Award Trio and Statistical Foundations

The three 2018 Turing Award winners — Yoshua Bengio, Geoffrey Hinton, and Yann LeCun — plus three statistical foundations researchers — Robert Tibshirani, Trevor Hastie, and Michael I. Jordan — are the foundational layer of modern machine learning. Their combined citation count exceeds 3 million as of late 2024, and almost every commercial ML system in production builds on at least one of their papers.

### The 2018 Turing Award winners

**Yoshua Bengio** — Founder of Mila, professor at Université de Montréal, scientific advisor to multiple AI safety initiatives. Approximately 870,000+ Google Scholar citations. Best known for foundational work on attention mechanisms, neural language models, and generative adversarial networks via student lineage. Bengio co-authored the 2015 *Nature* review article "[Deep Learning](https://www.nature.com/articles/nature14539)" with Hinton and LeCun — itself one of the most-cited papers in computing.

**Geoffrey Hinton** — Emeritus professor at the University of Toronto, formerly Vice President at Google. Approximately 830,000+ citations. Shared the **2024 Nobel Prize in Physics** with John Hopfield for foundational work on artificial neural networks ([Nobel Prize 2024 official summary](https://www.nobelprize.org/prizes/physics/2024/summary/)). Hinton's PhD students include Ilya Sutskever (ex-OpenAI), Alex Krizhevsky (AlexNet), and many of the senior researchers at Google Brain, DeepMind, and Meta AI.

**Yann LeCun** — Chief AI Scientist at Meta, professor at NYU. Approximately 480,000+ citations. Invented the [convolutional neural network](/deep-learning/convolutional-neural-network-image-classification-guide) (LeNet, 1989-1998) — the architecture behind every production computer vision system before vision transformers. LeCun has been the most public advocate for open-source foundation models, leading Meta's release of Llama 2 and Llama 3.

### Statistical foundations

**Robert Tibshirani** — Stanford. Approximately 410,000+ citations. Invented the **lasso** (L1 regularization), the most widely used technique for feature selection in production ML. Co-author of "[The Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/)" — the textbook every senior data scientist has read.

**Trevor Hastie** — Stanford. Approximately 330,000+ citations. Co-author of ESL with Tibshirani and Friedman, and of "An Introduction to Statistical Learning" — the entry-level companion volume used in most university ML courses worldwide.

**Michael I. Jordan** — UC Berkeley. Approximately 330,000+ citations. Pioneered variational inference, latent Dirichlet allocation (LDA), and graphical models. Jordan trained many of the senior researchers now leading industrial labs, including Andrew Ng and Ben Recht.

| Scientist | Affiliation | Approx. Citations | Defining Contribution |
| --- | --- | --- | --- |
| Yoshua Bengio | Mila / U. Montréal | 870,000+ | Deep learning, attention, GANs (student work) |
| Geoffrey Hinton | Toronto / ex-Google | 830,000+ | Backpropagation, AlexNet, Nobel Physics 2024 |
| Robert Tibshirani | Stanford | 410,000+ | Lasso, ESL textbook |
| Yann LeCun | Meta / NYU | 480,000+ | Convolutional neural networks, Llama |
| Trevor Hastie | Stanford | 330,000+ | Statistical learning, GLMs |
| Michael I. Jordan | UC Berkeley | 330,000+ | Variational inference, LDA |

> **Ready to translate this research depth into a business AI strategy?** GrowthGear's team has advised 50+ startups on how to evaluate AI vendors based on their underlying research, not their marketing. [Book a Free Strategy Session](https://growthgear.com.au) to map your shortlist against the labs and lineages that matter for your use case.

## Modern Pioneers in Deep Learning, NLP and Computer Vision

The modern deep learning pioneers — researchers whose single defining paper created a category — sit in the 130,000-370,000 citation range as of late 2024. Each one authored a paper your vendors likely cite by name. Knowing the paper's lineage is the fastest way for a CTO to evaluate whether a vendor's claim is grounded or marketing.

### NLP and language models

**Christopher Manning** — Director of the Stanford AI Lab. Approximately 300,000+ citations. Co-author of [GloVe word embeddings](/deep-learning/what-is-word-embedding-in-nlp), and the standard textbook *Foundations of Statistical Natural Language Processing*. Manning's lab trained much of the senior leadership at Hugging Face and Anthropic.

**Tomas Mikolov** — Ex-Google, ex-Facebook, now CIIRC. Approximately 130,000+ citations. Lead author of **Word2Vec** (2013), the paper that made dense word embeddings practical for production NLP. Mikolov's "King – Man + Woman ≈ Queen" example is the most cited single result in NLP history.

**Ashish Vaswani** — Co-founder of Adept AI, ex-Google Brain. Approximately 150,000+ citations as of late 2024. Lead author of "[Attention Is All You Need](https://arxiv.org/abs/1706.03762)" (2017) — the paper introducing the [Transformer architecture](/machine-learning/what-is-a-transformer-in-machine-learning) that powers GPT-4, Claude, Gemini, and every other modern LLM. The paper crossed 100,000 citations in just six years, faster than any other AI paper in history.

**Jürgen Schmidhuber** — Director at IDSIA. Approximately 280,000+ citations. Co-developed **Long Short-Term Memory (LSTM)** networks with Sepp Hochreiter in 1997 — the architecture behind every production sequence model from 2014-2018 (Google Translate, Apple Siri, Amazon Alexa) before transformers replaced it.

### Computer vision

**Fei-Fei Li** — Stanford, co-founder of Stanford HAI. Approximately 200,000+ citations. Created **ImageNet** — the labeled image dataset that made modern computer vision possible. The 2012 AlexNet paper (Krizhevsky, Sutskever, Hinton) used ImageNet to demonstrate the deep learning breakthrough that launched the current AI wave.

### Generative models

**Ian Goodfellow** — Google DeepMind (returned from Apple). Approximately 360,000+ citations. Invented **Generative Adversarial Networks (GANs)** in 2014 as a Bengio PhD student. Co-author of the standard graduate textbook "Deep Learning" with Bengio and Aaron Courville.

### Education and applied ML

**Andrew Ng** — Stanford, co-founder of Coursera and DeepLearning.AI. Approximately 330,000+ citations. Ng's Coursera *Machine Learning* course has enrolled over 4.8 million learners since 2011 ([Coursera 2024](https://www.coursera.org/instructor/andrewng)). Few academics have shaped the *practitioner* pool more than Ng.

| Researcher | Defining Paper or Project | Year | Approx. Citations |
| --- | --- | --- | --- |
| Christopher Manning | GloVe word embeddings | 2014 | 300,000+ |
| Tomas Mikolov | Word2Vec | 2013 | 130,000+ |
| Ashish Vaswani | "Attention Is All You Need" (Transformer) | 2017 | 150,000+ |
| Jürgen Schmidhuber | LSTM (with Hochreiter) | 1997 | 280,000+ |
| Fei-Fei Li | ImageNet | 2009 | 200,000+ |
| Ian Goodfellow | Generative Adversarial Networks | 2014 | 360,000+ |
| Andrew Ng | Coursera ML, Google Brain | 2011 | 330,000+ |

If your team is evaluating an NLP, vision, or generative AI vendor, the foundational paper in this table is the one you want to find in their engineering blog. If they cite a 2024 follow-up but not the original, that's a positioning choice; if they cannot connect their architecture to any of these papers, the technical claim is likely thin.

## The Industry Builders Bridging Research to Production

The last decade has produced a new tier of machine learning researchers whose work sits inside *products* — not just papers. **Industry labs at DeepMind, Meta AI, OpenAI, Anthropic, and Google Brain now match or exceed many academic labs in citation impact.** These researchers are also the ones most likely to be hired into senior AI roles at your portfolio companies or competitors.

### The industry leaders

**Ilya Sutskever** — Co-founder of Safe Superintelligence, ex-OpenAI Chief Scientist. Approximately 370,000+ citations. Co-author of **AlexNet** (2012) with Krizhevsky and Hinton — the paper that started the deep learning wave — plus **seq2seq learning** (2014) and **AlphaGo** (2016). Sutskever is the rare researcher who has been senior author on at least three field-defining papers.

**Demis Hassabis** — Co-founder and CEO of Google DeepMind. Approximately 200,000+ citations. Shared the **2024 Nobel Prize in Chemistry** with John Jumper for **AlphaFold2**, which predicted the structure of over 200 million proteins ([Nobel Prize 2024](https://www.nobelprize.org/prizes/chemistry/2024/summary/)). Hassabis is the first computer scientist to win a Nobel in a non-computing discipline.

**Andrej Karpathy** — Ex-OpenAI, ex-Tesla Director of AI. Approximately 70,000+ citations. Karpathy's citation count is lower than his peers because much of his impact is through *tutorial* work (CS231n at Stanford, "Neural Networks: Zero to Hero" on YouTube, the "nanoGPT" repo) rather than original papers. He is arguably the most influential AI educator of the 2020s.

**Sebastian Thrun** — Stanford, co-founder of Udacity, ex-Google self-driving cars. Approximately 150,000+ citations. Co-author of the standard textbook *Probabilistic Robotics*. Thrun's Stanford racing team won the 2005 DARPA Grand Challenge and launched the modern autonomous vehicle industry.

**Daphne Koller** — CEO of insitro, co-founder of Coursera. Approximately 120,000+ citations. Co-author of the standard graduate textbook *Probabilistic Graphical Models*. Now applies ML to drug discovery — one of the most-cited applied ML domains.

**Léon Bottou** — Meta AI, ex-Bell Labs. Approximately 140,000+ citations. Pioneered **large-scale stochastic gradient descent** — the optimization algorithm that makes training deep neural networks computationally feasible.

**Judea Pearl** — UCLA, 2011 Turing Award winner. Approximately 140,000+ citations. Pioneered **causal inference** and **Bayesian networks** — the framework that bridges ML pattern recognition with cause-and-effect reasoning.

### What "industry research" actually looks like in 2026

According to the [Stanford HAI AI Index 2024](https://aiindex.stanford.edu/report/), industry labs produced 51 of the 132 "notable" machine learning models tracked in 2023, versus 15 from academia — a ratio that has inverted since 2014. McKinsey's [State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) reports 65% of organizations regularly use generative AI, and the underlying foundation models all come from industry labs (OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral).

> "The research is in the product. Reading a Google DeepMind blog post is now as load-bearing as reading an arXiv paper if you want to understand what changed last quarter." — Common observation among practitioners tracking the model release cadence on the [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard).

For a business leader, the practical implication is that the **lineage of your vendor's senior engineers matters as much as the lineage of your hires**. If a vendor's CTO is an ex-DeepMind or ex-OpenAI researcher with a Google Scholar profile in the citation tens of thousands, your due diligence is shorter than for a vendor with no traceable technical pedigree.

## How to Use This List as a Business Leader

For a non-research executive, the practical value of this list is three concrete moves: **vendor lineage checks, technical advisor selection, and decision-grade citation reading**. Stop short of trying to interpret the underlying papers — that is the job of the senior engineer you hire to do exactly that.

### 1. Vendor lineage check (30 minutes)

Before signing a six-figure AI contract, do this:

1. Find the vendor's CTO, head of AI, or top three engineers on LinkedIn.
2. Click through to their Google Scholar profile (most senior ML researchers have one).
3. Note their advisor for their PhD or first industry job — that lineage matters.
4. Look at their *recent* citations (last 3 years), not just lifetime count, to gauge whether they are still active.

A vendor's CTO with 5,000+ citations and a recent PhD from one of the labs above is a strong signal. A "Head of AI" with no Scholar profile and no published work is a yellow flag — not disqualifying, but worth probing in the next call.

### 2. Technical advisor selection

If you are hiring a part-time technical advisor or board observer for AI strategy, target researchers in the **10,000-50,000 citation band** rather than the very top of the list. Senior post-docs and mid-career professors in that band are accessible, more likely to take advisor roles at startups, and current with the field. The Bengio/Hinton tier rarely advise individual startups directly.

Pair the advisor selection with a structured hiring loop similar to a [data scientist hire](/machine-learning/how-to-hire-a-data-scientist-business-guide) — written case studies, paid take-homes, and an evaluation of how the advisor frames trade-offs, not just their h-index.

### 3. Conference and sponsorship decisions

If your team is choosing between sponsoring [NeurIPS](https://neurips.cc/), ICML, ICLR, CVPR, ACL, or KDD, look at where the scientists on this list publish most often. NeurIPS and ICML capture the broadest ML research; CVPR is computer vision; ACL is NLP; KDD is applied data mining. A $50K-$250K sponsorship aligned to your hiring needs and the labs you cross-link with on benchmarks delivers more talent pipeline than three generic AI summits.

### What this list does NOT tell you

Citation counts do not predict commercial AI value, do not measure model quality, and do not catch bias or [AI governance](/machine-learning/ai-governance-for-business-guide) risks. A high-citation researcher with no production experience can still ship an unusable system, and a low-citation engineer with deep domain knowledge can ship a critical one. Use the list to *complement* your evaluation framework — never to replace it. Similar to a [BANT-style sales qualification](https://sales.growthgear.com.au/sales-techniques/how-to-qualify-leads-using-bant-criteria-complete-guide), citation lineage is one input among five or six, not a decision in itself.

| Use Case | Use Citations? | Better Together With |
| --- | --- | --- |
| Vendor due diligence | Yes (lineage signal) | Product demos, customer references, SOC 2 audit |
| Hiring senior ML role | Yes (mid-career band) | Take-home case study, structured interview, paid trial |
| Conference sponsorship | Yes (where they publish) | Recruiting goals, audience overlap, budget fit |
| Picking a specific tool | No | Benchmarks, integration fit, TCO |
| Projecting AI ROI | No | [Marketing attribution model](https://marketing.growthgear.com.au/seo/what-is-marketing-attribution-modeling-explained), pilot data |
| Estimating model bias | No | Audit, bias testing, governance review |

## Summary: The Leading ML Scientists at a Glance

The table below pulls every researcher in this article into one comparison, grouped by the layer of the field they shape. Use it as a quick reference when reading vendor pitches, evaluating advisors, or briefing a board on whose work sits inside the AI tools you buy.

| Layer | Scientist | Approx. Citations | Affiliation | Defining Contribution |
| --- | --- | --- | --- | --- |
| Foundations | Yoshua Bengio | 870,000+ | Mila / U. Montréal | Deep learning, attention, advisor lineage |
| Foundations | Geoffrey Hinton | 830,000+ | Toronto / ex-Google | Backpropagation, AlexNet, Nobel 2024 |
| Foundations | Yann LeCun | 480,000+ | Meta / NYU | CNNs, Llama (open weights) |
| Foundations | Robert Tibshirani | 410,000+ | Stanford | Lasso, ESL textbook |
| Foundations | Trevor Hastie | 330,000+ | Stanford | Statistical learning textbooks |
| Foundations | Michael I. Jordan | 330,000+ | UC Berkeley | Variational inference, graphical models |
| Foundations | Judea Pearl | 140,000+ | UCLA | Causal inference, Bayesian networks |
| NLP | Christopher Manning | 300,000+ | Stanford | GloVe, NLP textbook |
| NLP | Jürgen Schmidhuber | 280,000+ | IDSIA | LSTM (with Hochreiter) |
| NLP | Ashish Vaswani | 150,000+ | Adept (ex-Google) | "Attention Is All You Need" |
| NLP | Tomas Mikolov | 130,000+ | CIIRC (ex-Google) | Word2Vec |
| Vision | Fei-Fei Li | 200,000+ | Stanford / HAI | ImageNet |
| Generative | Ian Goodfellow | 360,000+ | Google DeepMind | GANs, "Deep Learning" textbook |
| Industry | Ilya Sutskever | 370,000+ | SSI (ex-OpenAI) | AlexNet, seq2seq, AlphaGo |
| Industry | Demis Hassabis | 200,000+ | Google DeepMind | AlphaGo, AlphaFold, Nobel 2024 |
| Industry | Sebastian Thrun | 150,000+ | Stanford / Udacity | Probabilistic robotics, DARPA Grand Challenge |
| Industry | Léon Bottou | 140,000+ | Meta AI | Large-scale stochastic gradient descent |
| Industry | Daphne Koller | 120,000+ | insitro / Coursera | Probabilistic graphical models |
| Education | Andrew Ng | 330,000+ | Stanford / DeepLearning.AI | Coursera ML, Google Brain |
| Education | Andrej Karpathy | 70,000+ | Ex-OpenAI / Tesla | CS231n, "Zero to Hero", nanoGPT |

Citation counts are sourced from each researcher's public Google Scholar profile as of late 2024 and rounded to two significant figures. They will continue to climb — treat the table as a snapshot, not a leaderboard.

---

## Take the Next Step

The labs and scientists in this article shape the models inside every AI product you evaluate, from foundation models like Claude and GPT-4 to specialized vision and NLP tools. GrowthGear helps growth-stage companies trace that lineage into a concrete vendor shortlist, hiring loop, and governance framework — so you spend less time decoding marketing language and more time picking systems that fit your actual business.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Sources & References

1. [Stanford HAI AI Index Report 2024](https://aiindex.stanford.edu/report/) — Annual report tracking AI progress including industry vs. academic publication ratios and US private AI investment ($67.2B in 2023) (2024)
2. [ACM A.M. Turing Award 2018](https://amturing.acm.org/) — Official Turing Award citation for Bengio, Hinton, and LeCun "for conceptual and engineering breakthroughs that have made deep neural networks a critical component of computing" (2019)
3. [The Nobel Prize in Physics 2024](https://www.nobelprize.org/prizes/physics/2024/summary/) — Awarded to John Hopfield and Geoffrey Hinton "for foundational discoveries and inventions that enable machine learning with artificial neural networks" (2024)
4. [The Nobel Prize in Chemistry 2024](https://www.nobelprize.org/prizes/chemistry/2024/summary/) — Awarded to David Baker, Demis Hassabis, and John Jumper for protein structure prediction via AlphaFold2 (2024)
5. [LeCun, Bengio & Hinton, "Deep Learning" (Nature 2015)](https://www.nature.com/articles/nature14539) — The canonical review article on deep learning, one of the most-cited papers in computing (2015)
6. [Vaswani et al., "Attention Is All You Need" (NeurIPS 2017)](https://arxiv.org/abs/1706.03762) — Introduced the Transformer architecture used by every modern LLM (2017)
7. [McKinsey State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — 65% of organizations regularly use generative AI; foundation model adoption (2024)
8. [Google Scholar](https://scholar.google.com/) — Citation counts cited throughout, retrieved late 2024 (2024)
