---
title: "What Is Sensitivity in Machine Learning?"
description: "Learn what sensitivity means in machine learning, how it compares to precision and F1 score, and how to choose the right evaluation metric for your AI project."
category: "machine-learning"
author:
  name: "GrowthGear Team"
publishedAt: 2026-05-12
image:
  src: "/images/what-is-sensitivity-in-machine-learning.webp"
  alt: "Sensitivity in machine learning represented as a precision balance scale with blue and purple paper craft layers"
tags:
  - sensitivity
  - machine-learning
  - precision-recall
  - model-evaluation
  - classification
faq:
  - question: "What is sensitivity in machine learning?"
    answer: "Sensitivity in machine learning is the proportion of actual positives a model correctly identifies. Calculated as TP / (TP + FN), it equals recall. A sensitivity of 0.90 means the model catches 90% of real positives, missing 10%."
  - question: "What is the difference between sensitivity and precision in ML?"
    answer: "Sensitivity measures how many real positives were found: TP / (TP + FN). Precision measures how many predicted positives were actually correct: TP / (TP + FP). Improving one usually reduces the other — the precision-recall trade-off."
  - question: "When should you prioritize sensitivity over precision?"
    answer: "Prioritize sensitivity when missing a true positive is costly — medical screening, fraud detection, safety alerts. Prioritize precision when false positives are costly — spam filters, ad targeting, legal document review."
  - question: "What is a good sensitivity score for a machine learning model?"
    answer: "There is no universal target. Medical screening models typically target sensitivity above 0.95. Fraud detection commonly uses 0.85-0.95. For balanced tasks, sensitivity above 0.80 with F1 above 0.75 is a practical baseline."
  - question: "What is the difference between sensitivity and specificity?"
    answer: "Sensitivity (recall) is the true positive rate: how many positives the model correctly flags. Specificity is the true negative rate: how many negatives the model correctly clears. High performance on both indicates a genuinely accurate classifier."
  - question: "How does the F1 score relate to sensitivity?"
    answer: "F1 score is the harmonic mean of precision and sensitivity: 2 × (P × R) / (P + R). It balances both into one score from 0 to 1. F1 penalises extreme imbalances between precision and recall more than a simple average would."
  - question: "What causes low sensitivity in a machine learning model?"
    answer: "Low sensitivity typically results from class imbalance (rare positives), a threshold set too high, or insufficient training examples of the positive class. Solutions include oversampling, cost-sensitive learning, and threshold tuning on the precision-recall curve."
keyTakeaways:
  - "Sensitivity equals recall: TP / (TP + FN). It measures the share of real positives your model correctly identifies — the most important metric when missing a case is costly."
  - "The precision-recall trade-off means improving sensitivity usually reduces precision. Define acceptable false negative and false positive costs before training to set the right target."
  - "F1 score (harmonic mean of precision and recall) is the standard single-number metric for imbalanced classification — it penalises extreme gaps between the two measures."
  - "ROC-AUC is threshold-independent and the best metric for comparing two candidate models before selecting a final operating point."
  - "Fewer than 25% of organisations have systematic production monitoring for classifier degradation (McKinsey State of AI 2024). Always monitor sensitivity on live data, not just test sets."
callout:
  variant: "warning"
  title: "Accuracy Is Misleading on Imbalanced Data"
  content: "A model that labels everything 'not fraud' achieves 99.9% accuracy on a 0.1% fraud dataset — but has zero sensitivity. Never use accuracy alone to evaluate classification models."
---

Sensitivity answers one specific question: when something bad actually happens, does your model catch it?

A classifier with 99% accuracy can have 0% sensitivity on a rare-event problem. That gap — between looking good on paper and being useful in production — is why sensitivity is the metric that machine learning practitioners in healthcare, finance, and security monitor most closely.

This guide explains what sensitivity is in machine learning, starting from the formula, then compares it to precision, specificity, and F1 score. The final section covers how to set the right evaluation threshold for your specific business context when applying [machine learning algorithms to real-world problems](/machine-learning/machine-learning-algorithms-and-applications-guide).

## What Is Sensitivity in Machine Learning?

Sensitivity in machine learning is the proportion of actual positive cases that a model correctly identifies, calculated as TP / (TP + FN). A sensitivity of 0.90 means the model successfully detects 90% of true positive cases while missing 10%. Sensitivity is identical to recall and to the true positive rate (TPR) — three terms for exactly the same calculation derived from the confusion matrix.

### The Confusion Matrix: Where Sensitivity Comes From

Every binary classifier produces four outcomes for each prediction:

| | Predicted Positive | Predicted Negative |
|---|---|---|
| **Actual Positive** | True Positive (TP) | False Negative (FN) |
| **Actual Negative** | False Positive (FP) | True Negative (TN) |

**Sensitivity = TP / (TP + FN)**

A **false negative (FN)** is a missed positive — the model predicted "no" when the correct answer was "yes." Sensitivity quantifies how often that failure occurs. When false negatives carry the highest cost — a missed cancer diagnosis, an undetected fraud transaction, a safety-critical equipment fault not flagged — sensitivity is the primary evaluation target.

**Specificity = TN / (TN + FP)** — sensitivity's partner metric — measures the true negative rate: how often the model correctly clears cases that are genuinely negative. High sensitivity *and* high specificity together characterise a genuinely accurate classifier. A model with 0.96 sensitivity but 0.30 specificity is flagging nearly everything as positive, which is operationally useless.

### Why Accuracy Fails on Imbalanced Datasets

On a fraud dataset where 99.9% of transactions are legitimate, a model that always predicts "not fraud" achieves 99.9% accuracy. Its sensitivity is 0.0 — it never detects a single fraud case. Accuracy is a misleading metric for any classification task where the positive class is rare. Sensitivity surfaces the problem immediately.

According to the [Google Developers Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall), accuracy should never be used as the sole evaluation metric for classification tasks with class imbalance. Class imbalance is the default condition for most high-value business classification problems — fraud, churn, disease, defects, lead quality.

### Sensitivity in Different Domains

The same formula appears under different names across fields:

- **Medical testing**: sensitivity is the "hit rate" — the share of patients with the disease who test positive
- **Information retrieval**: recall measures the share of relevant documents retrieved from a search
- **Manufacturing quality control**: recall measures the share of defective units caught before shipping
- **Fraud detection**: recall measures the share of fraudulent transactions flagged before settlement

Understanding that sensitivity, recall, and true positive rate are all the same calculation matters when reading model documentation, vendor claims, and academic papers. When [training a machine learning model](/machine-learning/how-to-train-machine-learning-models-beginners), your evaluation script should report all three names to avoid confusion across team members with different backgrounds.

## Sensitivity vs. Precision: Understanding the Trade-off

Sensitivity and precision measure different failure modes and sit in fundamental tension. Sensitivity captures missed positives (false negatives). Precision captures false alarms (false positives). They are inversely linked through the classification threshold: lowering the threshold increases sensitivity but decreases precision, and raising it does the opposite.

### The Precision Formula

**Precision = TP / (TP + FP)**

A precision of 0.85 means 85% of cases the model flagged as positive were genuinely positive. The remaining 15% were false alarms — the model fired incorrectly. Precision matters when false positives have a real cost: a legitimate email routed to spam, a valid transaction declined, a safe employee flagged for review.

### A Worked Example: Fraud Detection

Suppose your fraud model evaluates 10,000 transactions per day. The actual fraud rate is 0.5% (50 fraudulent transactions).

**Scenario A — threshold = 0.3 (higher sensitivity):**
- Model flags 180 transactions as fraud
- TP = 47, FP = 133, FN = 3
- Sensitivity = 47 / 50 = **0.94**
- Precision = 47 / 180 = **0.26**
- Your fraud team reviews 180 cases daily to catch 47 real frauds — 133 are wasted reviews

**Scenario B — threshold = 0.7 (higher precision):**
- Model flags 55 transactions as fraud
- TP = 38, FP = 17, FN = 12
- Sensitivity = 38 / 50 = **0.76**
- Precision = 38 / 55 = **0.69**
- Your fraud team reviews 55 cases daily, catching 38 real frauds — 12 go undetected

Neither scenario is universally "correct." The choice depends on the cost of a missed fraud versus the cost of analyst time reviewing false alarms. This cost trade-off is what sets the optimal threshold for your business — not the model's default of 0.5.

### When to Prioritise Each Metric

| Business Context | Optimise For | Reasoning |
|---|---|---|
| Medical screening | Sensitivity ≥ 0.95 | Missing a disease costs far more than a follow-up test |
| Fraud detection | Sensitivity 0.85–0.95, precision floor | Missing fraud is costly; excessive false declines hurt customers |
| Spam filtering | Precision ≥ 0.90 | False positives (blocked legitimate email) damage trust |
| Lead scoring for sales | Precision ≥ 0.75 | Salespeople abandon the system if too many flagged leads are cold |
| Safety alerts (factory, infrastructure) | Sensitivity ≥ 0.95 | Missing a fault can be catastrophic |
| Churn prediction (retention campaigns) | F1 score | Balances false negatives (missed churners) with false positives (wasted offers) |
| Content moderation | Context-specific | Platform values determine acceptable false positive rate |

For sales teams using AI-powered CRM tools, the precision-recall balance in lead scoring directly affects pipeline quality. AI-driven platforms covered in [best CRM software for small business teams](https://sales.growthgear.com.au/crm-tools/best-crm-software-small-business-teams) let you adjust classification thresholds to match your team's capacity and conversion rate expectations.

> **Common mistake:** The default threshold of 0.5 in most ML libraries is arbitrary and rarely optimal for business problems. Always evaluate your model at multiple thresholds using the precision-recall curve before selecting an operating point.

> **Ready to evaluate AI models for your business?** GrowthGear's team has helped 50+ startups select and deploy machine learning systems built around the right performance metrics. [Book a Free Strategy Session](https://growthgear.com.au) to review your model evaluation approach.

## F1 Score, ROC-AUC, and Advanced Evaluation Metrics

No single metric captures classifier quality completely. F1 score, ROC-AUC, and log loss each add context that sensitivity alone cannot provide. For most business classification problems, report sensitivity, precision, F1, and AUC together — they tell you different things about where the model succeeds and fails.

### F1 Score: The Harmonic Balance

F1 score is the harmonic mean of precision and recall (sensitivity):

**F1 = 2 × (Precision × Recall) / (Precision + Recall)**

The harmonic mean penalises extreme imbalances more harshly than the arithmetic mean. A model with precision of 0.95 and recall of 0.20 has a harmonic mean F1 of 0.33 — substantially lower than its arithmetic average of 0.575. This captures the real quality problem: the model is finding almost nothing useful despite looking precise on what little it finds.

F1 ranges from 0 (worst) to 1 (perfect). For multi-class problems, [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html) offers three averaging strategies:

- **Macro F1**: equal weight to every class regardless of frequency — use when all classes are equally important
- **Weighted F1**: weight by class frequency — standard choice when class sizes reflect real-world prevalence
- **Micro F1**: compute globally across all predictions — equivalent to accuracy for balanced datasets

A weighted F1 above 0.80 is a practical baseline for most business classifiers. For tasks where the positive class is rare and high-value, target recall above 0.85 before optimising F1.

### ROC-AUC: Comparing Models Without Picking a Threshold

The ROC (Receiver Operating Characteristic) curve plots sensitivity on the y-axis and 1 − specificity (false positive rate) on the x-axis across all possible classification thresholds. A random classifier produces a diagonal line with AUC = 0.50. A perfect classifier achieves AUC = 1.0.

**ROC-AUC is the right metric for model selection.** When you have two candidate models and need to choose one before setting a threshold, AUC tells you which model has stronger overall discriminability across the full range of operating points. Only after selecting the better model should you move to threshold optimisation.

According to the [Stanford HAI AI Index 2024](https://hai.stanford.edu/ai-index/2024), foundation models now achieve AUC above 0.95 on several medical imaging benchmarks — a target that custom business models trained on smaller datasets typically cannot match without substantial domain-specific fine-tuning. For guidance on that process, see [what is fine-tuning in deep learning](/deep-learning/what-is-fine-tuning-in-deep-learning).

### Precision-Recall AUC for Imbalanced Data

For heavily imbalanced datasets (positive class below 5%), ROC-AUC can be overly optimistic because the high volume of true negatives inflates the true negative rate component. **PR-AUC (area under the precision-recall curve)** is a more informative metric in these cases — it focuses entirely on the trade-off between sensitivity and precision without the distortion from easy-to-classify negatives.

Use PR-AUC when your positive class rate is below 5%. Use ROC-AUC when classes are roughly balanced or moderately imbalanced (5%–30% positive rate).

## Setting Your Sensitivity Threshold for Business Projects

The optimal sensitivity threshold depends entirely on the cost of a false negative versus a false positive in your specific context. Define this before building the model — it shapes data collection strategy, class weighting, and deployment logic. Retrofitting threshold decisions after training is possible but wasteful.

### Step 1: Build a Cost Matrix

Start with two numbers:

**FN cost**: what does it cost the business when the model misses a real positive? For a churn predictor, this is the customer lifetime value lost. For a fraud detector, it is the fraud amount plus investigation overhead.

**FP cost**: what does it cost when the model incorrectly flags a negative? For a fraud detector, it is the operational cost of investigating a false alarm plus customer friction from a declined transaction.

| Error Type | Example Scenario | Estimated Unit Cost |
|---|---|---|
| False Negative (FN) | Missed churn → lost customer LTV | $2,400 (if average LTV = $2,400) |
| False Positive (FP) | Unnecessary retention offer sent | $45 (offer cost + support time) |
| Implied sensitivity target | FN:FP ratio = 53:1 | Sensitivity ≥ 0.90 justified |

When the FN:FP cost ratio exceeds 10:1, optimising for sensitivity well above 0.85 is typically justified even at significant precision cost. When the ratio is close to 1:1, F1 is the correct single-number target.

### Step 2: Plot the Precision-Recall Curve

Never commit to a threshold without examining the full precision-recall curve. For most business classification problems, the default threshold of 0.5 is not the optimal operating point — the curve's "elbow" (where precision begins to drop sharply as recall increases) is usually a better starting point.

Plot the curve in scikit-learn using `precision_recall_curve()`, identify the elbow, then select the threshold that satisfies your FN and FP cost constraints. Re-evaluate on a held-out validation set — not the test set — before finalising.

### Step 3: Address Class Imbalance in Training

Low sensitivity in production almost always traces to class imbalance in training data. If your positive class is rare, the model sees very few examples and defaults to predicting the majority class. Proven techniques:

- **SMOTE (Synthetic Minority Over-sampling Technique)**: generates synthetic minority-class examples by interpolating between existing ones — effective when positive examples number in the hundreds
- **Class weighting** (`class_weight='balanced'` in scikit-learn): penalises false negatives more heavily during training without altering the dataset
- **Undersampling the majority class**: faster to train on balanced data, but discards potentially useful negative examples
- **Collect more positive examples**: if the positive class has fewer than 500 training examples, additional data collection will outperform any resampling technique

For [overfitting considerations when using resampling](/machine-learning/what-is-overfitting-in-machine-learning) — SMOTE in particular can cause synthetic examples to bleed across the validation boundary if applied before splitting. Always apply SMOTE only to the training fold within cross-validation, never to the full dataset before splitting.

### Step 4: Monitor Sensitivity in Production

Sensitivity calculated on a test set is a point-in-time snapshot. Distribution shift — when production data differs from training data — erodes sensitivity without changing model code. According to [McKinsey's State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai), fewer than 25% of organisations have systematic production monitoring for classification model degradation. This is one of the primary reasons AI initiatives fail to sustain their initial performance gains.

Establish monitoring for:

- **Recall on labelled production samples** (weekly or daily for high-stakes applications)
- **Prediction rate drift** — a sudden change in the share of positive predictions signals distributional shift
- **Probability calibration** — whether predicted scores match actual positive rates at each decile

For production serving and latency constraints relevant to threshold evaluation in real-time systems, see [what is inference in machine learning](/machine-learning/what-is-inference-in-machine-learning). For teams building sales or marketing AI systems, [lead generation strategies for B2B companies](https://sales.growthgear.com.au/b2b-sales/best-lead-generation-strategies-b2b-companies) and [conversion rate optimisation frameworks](https://marketing.growthgear.com.au/seo/conversion-rate-optimization-strategy-guide) both depend on correctly calibrated sensitivity thresholds to deliver reliable prioritisation.

## ML Classification Evaluation Metrics: Quick Reference

| Metric | Formula | Range | What It Measures | Best Used When |
|---|---|---|---|---|
| **Sensitivity / Recall** | TP / (TP + FN) | 0–1 | Share of real positives found | Missing positives is costly (fraud, disease) |
| **Precision** | TP / (TP + FP) | 0–1 | Share of predicted positives that are real | False alarms are costly (spam, compliance) |
| **Specificity** | TN / (TN + FP) | 0–1 | Share of real negatives correctly cleared | Alongside sensitivity for full picture |
| **F1 Score** | 2×(P×R)/(P+R) | 0–1 | Harmonic balance of precision and recall | Imbalanced classes; single-number reporting |
| **ROC-AUC** | Area under ROC curve | 0.5–1.0 | Threshold-independent discriminability | Comparing models before threshold selection |
| **PR-AUC** | Area under PR curve | 0–1 | Precision-recall trade-off summary | Severely imbalanced data (positive rate <5%) |
| **Accuracy** | (TP+TN)/Total | 0–1 | Overall correct predictions | Only balanced datasets; misleading otherwise |

---

## Take the Next Step

Choosing the right evaluation metric — and setting the right classification threshold — is one of the highest-leverage decisions in any machine learning project. Whether you are deploying a fraud detection model, a churn predictor, or an AI lead scorer, getting sensitivity right determines whether the model actually helps or silently misleads your team.

GrowthGear's team has guided 50+ startups through model evaluation strategy, threshold selection, and production monitoring to ensure their machine learning investments deliver measurable, sustained results.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Sources & References

1. [Google Developers Machine Learning Crash Course — Classification: Accuracy, Precision, Recall](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall) — "Accuracy alone is insufficient for imbalanced classification tasks; precision and recall provide more actionable signal for model evaluation." (2023)
2. [scikit-learn — sklearn.metrics.recall\_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html) — Standard Python implementation of recall\_score, precision\_score, f1\_score, and precision\_recall\_curve with class\_weight support. (2024)
3. [Stanford HAI AI Index 2024](https://hai.stanford.edu/ai-index/2024) — Foundation models achieve AUC above 0.95 on medical imaging benchmarks, raising the performance bar for custom classifiers. (2024)
4. [McKinsey & Company — The State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — Fewer than 25% of organisations have systematic production monitoring for classification model degradation, contributing to sustained performance failures post-deployment. (2024)
