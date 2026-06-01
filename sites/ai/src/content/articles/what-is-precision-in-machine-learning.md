---
title: "What Is Precision in Machine Learning? Complete Guide"
description: "Learn what precision is in machine learning, how it differs from accuracy and recall, how to calculate it, and when to optimize for it in business ML."
category: "machine-learning"
author:
  name: "Andrew Martin"
publishedAt: 2026-06-02
image:
  src: "/images/what-is-precision-in-machine-learning.webp"
  alt: "Isometric illustration of a confusion matrix visualizing precision in machine learning"
tags:
  - machine-learning
  - precision
  - model-evaluation
  - classification
faq:
  - question: "What is precision in machine learning?"
    answer: "Precision is the fraction of positive predictions a model gets right. Formally, precision = true positives / (true positives + false positives). High precision means low false alarm rate."
  - question: "What is the difference between precision and accuracy?"
    answer: "Accuracy measures overall correctness across all classes. Precision measures correctness only on positive predictions. Accuracy can be misleading on imbalanced data; precision tells you how trustworthy each positive prediction is."
  - question: "What is the difference between precision and recall?"
    answer: "Precision asks: of the items we predicted positive, how many were right? Recall asks: of the actual positives, how many did we catch? Precision penalises false positives; recall penalises false negatives."
  - question: "When should you optimize for precision?"
    answer: "Optimize for precision when false positives are costly: spam filters, content moderation, lead scoring, ad targeting, medical screening recommendations to specialists. The cost of acting on a wrong positive is high."
  - question: "What is a good precision score?"
    answer: "There is no universal threshold. Compare against a baseline like the class prior or a previous model. In spam filtering, precision above 0.99 is typical. In fraud detection, 0.30–0.60 is often acceptable if recall is high."
  - question: "How do you improve precision without hurting recall?"
    answer: "Raise the decision threshold to filter out low-confidence positives, add more discriminative features, use cost-sensitive learning, calibrate probabilities, or ensemble multiple models. Each move usually trades a small recall drop for a precision gain."
  - question: "Does precision work for multi-class problems?"
    answer: "Yes. You compute precision per class, then aggregate with macro (unweighted mean), micro (global TP/FP), or weighted (by class support) averaging. Use macro when all classes matter equally; weighted when class imbalance is severe."
keyTakeaways:
  - "Precision = true positives / (true positives + false positives) — it measures how trustworthy each positive prediction is."
  - "Precision and recall trade off: raising the decision threshold typically lifts precision while reducing recall, and vice versa."
  - "Optimize for precision when false positives are expensive — spam filters, lead scoring, ad targeting, content moderation."
  - "On imbalanced datasets, complement precision with PR-AUC rather than ROC-AUC for a clearer view of positive-class performance."
  - "Set the decision threshold from a cost matrix, then monitor precision drift in production — class priors change and so does precision."
callout:
  variant: "warning"
  title: "Precision Without Recall Is Half a Story"
  content: "A model with 99% precision can still miss 95% of actual positives. Always report precision alongside recall, and pick the trade-off from business cost, not from the metric in isolation."
---

Precision is one of the four headline metrics every machine learning practitioner has to be fluent in — the others being recall, accuracy, and F1. It answers a deceptively simple question: **when the model says yes, how often is it right?** That question turns out to drive billion-dollar decisions in spam filtering, fraud detection, ad targeting, and clinical decision support. According to [McKinsey's State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai), 65% of organisations report regular gen AI use — yet fewer than half have mature MLOps practices, which means most are deploying models without a principled view of which metric they should be optimising for. This guide closes that gap for precision specifically.

We will define precision rigorously, show how it differs from accuracy and recall, walk through a worked fraud detection example, and lay out when to optimise for precision in real business systems. By the end you will know how to set a decision threshold, how to read precision in a [classification report](/machine-learning/classification-report-machine-learning-guide), and how to avoid the most common production mistake: shipping a model with great accuracy but a precision score nobody bothered to look at.

## What Is Precision in Machine Learning?

**Precision in machine learning is the proportion of positive predictions that are actually correct.** It is calculated as true positives divided by the sum of true positives and false positives. A model with precision of 0.92 means that when it predicts the positive class, it is right 92% of the time. Precision penalises false alarms — predictions that say *yes* when the truth is *no*.

### The Formula and the Confusion Matrix

Every classification metric flows from the **confusion matrix**, a 2x2 table of four cells: true positives (TP), false positives (FP), false negatives (FN), and true negatives (TN). Precision uses only the top row of the matrix — the predicted-positive row.

| Predicted \\ Actual | Positive | Negative |
|---|---|---|
| **Positive** | True Positive (TP) | False Positive (FP) |
| **Negative** | False Negative (FN) | True Negative (TN) |

The precision formula is:

**Precision = TP / (TP + FP)**

If a fraud detector flags 100 transactions and 80 are genuinely fraudulent, precision is 0.80. The 20 false positives are legitimate transactions that got blocked or sent for review — a real cost to the business in customer friction and analyst time.

### Why Accuracy Can Mislead and Precision Cannot

On a balanced dataset, accuracy and precision often agree. On an **imbalanced dataset**, they diverge violently. Consider a fraud-detection model on a transaction stream where 0.1% of transactions are fraud. A model that predicts *not fraud* for everything achieves 99.9% accuracy and 0% precision on the positive class. The accuracy headline looks great; the model is useless. This is the same trap covered in our guide to [sensitivity and the precision-recall trade-off](/machine-learning/what-is-sensitivity-in-machine-learning) — never trust a single metric on imbalanced data.

### Precision Is a Per-Class Metric

Precision is computed per class. In binary classification, the *positive class* is the one you care about — fraud, churn, defect, spam, qualified lead. In multi-class problems (sentiment with five labels, product categories with twelve), you compute precision separately for each class, then aggregate. We cover aggregation methods later in this guide.

## Precision vs Recall vs Accuracy — The Differences That Matter

**Precision, recall, and accuracy each answer a different question about classifier behaviour.** Precision asks how many flagged positives are correct. Recall asks how many real positives the model catches. Accuracy asks how often the model is right overall. They almost never move together. Optimising one usually pulls the others — sometimes in directions that quietly damage the business.

### Side-by-Side Definitions

- **Precision = TP / (TP + FP)** — the cost of a false positive
- **Recall = TP / (TP + FN)** — the cost of a false negative (also called sensitivity)
- **Accuracy = (TP + TN) / (TP + FP + FN + TN)** — overall agreement
- **F1-score = 2 × (Precision × Recall) / (Precision + Recall)** — harmonic mean of precision and recall

### The Precision-Recall Trade-Off

Most classifiers do not output hard labels — they output a probability or score. You apply a **decision threshold** (often 0.5 by default) to convert that score into a yes/no. Raising the threshold makes the model more conservative: fewer positives predicted, of which more are real, so precision goes up and recall goes down. Lowering the threshold does the opposite.

| Threshold | Predicted Positives | TP | FP | Precision | Recall |
|---|---|---|---|---|---|
| 0.30 | 180 | 75 | 105 | 0.42 | 0.95 |
| 0.50 | 100 | 60 | 40 | 0.60 | 0.75 |
| 0.70 | 60 | 50 | 10 | 0.83 | 0.63 |
| 0.90 | 25 | 24 | 1 | 0.96 | 0.30 |

The right threshold is not a property of the model — it is a property of the **business cost** of false positives versus false negatives. We cover this trade-off in depth in the [sensitivity guide](/machine-learning/what-is-sensitivity-in-machine-learning).

### When Each Metric Is the Right One

| Metric | Best when... | Example use case |
|---|---|---|
| **Precision** | False positives are expensive | Spam, lead scoring, content moderation, ad targeting |
| **Recall** | False negatives are expensive | Fraud detection, cancer screening, defect inspection |
| **Accuracy** | Balanced classes, equal costs | Image classification with balanced ImageNet labels |
| **F1** | You need to balance precision and recall | Imbalanced binary tasks with no clear cost asymmetry |

> **Ready to implement AI in your business?** GrowthGear's team has helped 50+ startups integrate ML systems that drive measurable ROI. [Book a Free Strategy Session](https://growthgear.com.au) to talk through which metric your business actually needs to optimise.

## How to Calculate Precision (With a Worked Example)

**Precision is calculated by dividing true positives by the total number of positive predictions.** The mechanics are simple; the judgement comes in deciding which class is positive, which threshold to use, and how to weight errors. We work through a complete example below using a B2B lead-scoring model — a common scenario where precision drives sales-team efficiency.

### Step 1: Define the Positive Class

In a [lead-scoring model](https://sales.growthgear.com.au/sales-techniques/how-to-qualify-leads-using-bant-criteria-complete-guide), the positive class is *will convert*. Out of 10,000 leads scored last month, 800 actually converted to paid customers (an 8% base rate). The model produces a probability per lead. Sales reviews any lead above a 0.50 threshold.

### Step 2: Build the Confusion Matrix at the Chosen Threshold

At threshold 0.50, the model flags 1,200 leads as positive. Of those, 600 actually converted. The rest of the math falls out:

- TP = 600 (predicted positive, actually converted)
- FP = 600 (predicted positive, did not convert)
- FN = 200 (predicted negative, but actually converted — we missed them)
- TN = 8,600 (predicted negative, correctly)

### Step 3: Compute Precision and Recall

- **Precision = 600 / (600 + 600) = 0.50**
- **Recall = 600 / (600 + 200) = 0.75**
- **Accuracy = (600 + 8600) / 10000 = 0.92**

Accuracy is 92% — impressive headline, useless action. Half the leads sent to sales are time-wasters. If a sales rep takes 30 minutes per qualified lead and 1,200 leads are flagged per month, **300 hours of rep time per month is being burned on false positives**. That is roughly two full-time sales reps doing nothing valuable.

### Step 4: Raise the Threshold to Improve Precision

Raise the threshold to 0.75. Now the model flags only 500 leads, of which 400 convert. New metrics:

- Precision = 400 / 500 = **0.80**
- Recall = 400 / 800 = **0.50**

Sales reps reclaim 175 hours per month, but we now miss 400 deals we would have caught at the lower threshold. The right answer depends on what an extra sales-rep hour is worth versus the lifetime value of the deals being missed. That is a [customer acquisition cost](https://marketing.growthgear.com.au/seo/customer-acquisition-cost-calculation-optimization-guide) calculation, not a machine learning calculation.

### Step 5: Use scikit-learn in Production

In production, you do not compute precision by hand. The [scikit-learn precision_score function](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html) handles binary, multi-class, and multi-label cases. It accepts an `average` parameter (`macro`, `micro`, `weighted`, or `None` for per-class scores) and a `zero_division` parameter for empty-prediction edge cases. The implementation traces back to [Pedregosa et al., JMLR 2011](https://www.jmlr.org/papers/volume12/pedregosa11a/pedregosa11a.pdf), the canonical scikit-learn paper.

> **Pro tip:** Compute precision and recall on a *validation set held out from training* — not on the training set. Training-set precision is almost always inflated, and the gap between training and validation precision is one of the earliest signals of [overfitting](/machine-learning/what-is-overfitting-in-machine-learning).

## When to Optimize for Precision in Business ML

**Optimize for precision when false positives carry a real business cost — money, user trust, reputation, or expert time.** The decision is rarely about the maths and almost always about who pays for a wrong prediction. Below are the five business scenarios where precision should dominate model tuning, and the rough precision targets each domain achieves in production.

### High-Precision Domain 1: Spam and Content Moderation

When Gmail or Outlook quarantines a message, every false positive (legitimate email marked spam) destroys user trust. A single missed birthday card costs more than a hundred spam messages that slipped through. Production spam filters target **precision above 0.99**. Recall sits around 0.95 — meaning a small percentage of spam still reaches the inbox, but the false positive rate is vanishingly small. Content moderation follows the same calculus: wrongly removing a user's post is a brand-damaging event.

### High-Precision Domain 2: B2B Lead Scoring and Sales Routing

Sales reps are expensive. Routing a rep to an unqualified lead is a 30-to-60-minute time cost plus the [opportunity cost](https://sales.growthgear.com.au/sales-techniques/how-to-qualify-leads-using-bant-criteria-complete-guide) of the qualified lead that did not get the call. Production lead-scoring systems usually optimise for **precision in the 0.40–0.70 range**, depending on lead volume and rep capacity. Below 0.40, reps lose trust in the model and stop using it.

### High-Precision Domain 3: Ad Targeting and Programmatic Bidding

Every false positive bid is wasted money. Demand-side platforms operate on a precision-cost trade-off measured in cents per impression. Models target **precision around 0.20–0.40 for top-of-funnel ads** and **0.60+ for retargeting**, because retargeting impressions are much more expensive per click.

### High-Precision Domain 4: Medical Decision Support (Triage to Specialists)

When AI recommends a patient for specialist review, every false positive consumes scarce specialist time. Triage models target **precision around 0.30–0.50** because the cost of a false negative (missed cancer, missed sepsis) is still higher than a false positive — but you cannot run an oncology clinic at 5% precision. The American Cancer Society's screening guidelines reflect a similar trade-off.

### High-Precision Domain 5: Compliance Flagging and Fraud Investigation Queues

Compliance analysts can investigate only so many flagged transactions per day. A team of ten analysts at 50 reviews per day caps the daily review budget at 500. If the model surfaces 1,000 flagged transactions, half cannot be investigated. Production fraud-investigation queues target **precision of 0.40–0.70** — high enough that the queue is worth working, low enough that recall stays above the regulator's risk-appetite line.

### A Five-Question Framework for Picking the Metric

Before you tune anything, answer these:

1. **What does a false positive cost?** (Time, money, user trust, regulatory exposure)
2. **What does a false negative cost?** (Missed revenue, missed fraud, missed diagnosis)
3. **Is the cost asymmetric?** If yes, precision-recall trade-off matters more than F1.
4. **Is the class imbalance severe?** If positive rate is below 5%, switch to PR-AUC over ROC-AUC.
5. **Who acts on the predictions?** Human-in-the-loop tolerates lower precision; automated action demands higher.

If you cannot answer all five, you do not yet have a [machine learning project](/machine-learning/machine-learning-algorithms-and-applications-guide) — you have a model in search of a problem.

## Threshold Tuning, Class Imbalance, and Multi-Class Precision

**Real-world precision tuning involves three challenges most beginners underestimate: choosing the threshold, handling severe class imbalance, and aggregating precision across multiple classes.** Get these wrong and your headline precision number is meaningless. Below we cover each, with the specific scikit-learn parameters and the failure modes to watch for in production monitoring.

### Threshold Tuning Workflow

Default thresholds (usually 0.5) are almost always wrong for business problems. The four-step workflow:

1. **Build a cost matrix.** Assign a cost in dollars (or analyst hours, or reputation points) to FP and FN.
2. **Plot the precision-recall curve.** Use `sklearn.metrics.precision_recall_curve`. The curve shows precision and recall at every possible threshold.
3. **Pick the threshold that minimises expected cost.** Total cost = FP_cost × FP_count + FN_cost × FN_count. The minimum is rarely at threshold 0.5.
4. **Validate on a holdout set, then a small production canary.** Distribution shift in production can shift the curve significantly.

This workflow is the missing piece in most ML team handoffs. The data scientist ships a model; the product team picks threshold 0.5 because that is the default; precision drifts; trust collapses.

### Class Imbalance — When Precision Behaves Badly

In severe imbalance (positive rate under 5%), the precision curve is **noisy and non-monotonic**. Small changes in threshold cause large jumps in precision because the denominator (TP + FP) is tiny. Three mitigations:

- **Use PR-AUC, not ROC-AUC.** The 2006 paper by [Davis and Goadrich (ICML)](https://dl.acm.org/doi/10.1145/1143844.1143874) showed that ROC curves obscure positive-class performance on imbalanced data, while precision-recall curves reveal it.
- **Apply class weights or SMOTE.** Both push the model to attend more to the minority class.
- **Calibrate predicted probabilities.** Use `CalibratedClassifierCV` so that a 0.80 score means roughly an 80% probability of positive — only then can your business threshold reasoning hold.

[Cross-validation](/machine-learning/what-is-cross-validation-in-machine-learning) becomes especially important here — single-split precision estimates on imbalanced data carry large variance. Use stratified k-fold to keep class balance consistent across folds.

### Multi-Class Precision Aggregation

For multi-class problems, scikit-learn supports four `average` modes:

| Mode | What it does | When to use |
|---|---|---|
| `None` | Returns per-class precision array | Diagnostics, debugging, dashboards |
| `'macro'` | Unweighted mean across classes | All classes matter equally |
| `'weighted'` | Mean weighted by class support | Reflects production class mix |
| `'micro'` | Global TP/FP across all classes | Multi-label tasks |

**Macro** treats a rare class the same as a common one — useful when you do not want the majority class dominating the headline. **Weighted** mirrors production traffic — useful for reporting. **Micro** is the same as overall accuracy in single-label multi-class, so it adds no information there; reserve it for multi-label.

### Production Monitoring of Precision Drift

Precision is not stable in production. Class priors shift (fraud rates change with each holiday season), feature distributions drift, and adversaries adapt. Monitor:

- **Daily precision vs the validation baseline.** Alert on more than a 5-point drop.
- **Predicted-positive volume.** If it doubles week-over-week without explanation, your threshold may be miscalibrated for the new traffic mix.
- **Per-segment precision.** A model can hold global precision while degrading badly on a specific customer segment or geography.

[Google's ML Crash Course module on precision and recall](https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall) covers these monitoring patterns at production-engineer depth.

> **Common mistake:** Reporting only the test-set precision number in the launch deck. Test-set precision is a point estimate from before launch. The number that matters is the rolling 7-day precision on live traffic — which you can only see if you instrumented logging for the ground-truth label.

---

## Take the Next Step

Precision is one of the four metrics every ML system has to expose, monitor, and tune for the cost structure of the business it serves. Whether you are evaluating a vendor model, fine-tuning an internal classifier, or [hiring a data scientist](/machine-learning/how-to-train-machine-learning-models-beginners) who can think about cost matrices instead of leaderboard scores, GrowthGear can help you build the evaluation discipline that turns a working model into a working business.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Precision in Machine Learning at a Glance

| Aspect | Detail |
|---|---|
| **Formula** | TP / (TP + FP) |
| **Range** | 0 to 1 (higher is better) |
| **Question it answers** | Of predictions we called positive, how many were right? |
| **Penalises** | False positives |
| **Best for** | Spam, lead scoring, ad targeting, content moderation, compliance triage |
| **Worst for** | Use cases where missing positives is catastrophic (fraud, cancer screening) |
| **Trade-off partner** | Recall (raising threshold lifts precision, drops recall) |
| **Imbalanced-data companion** | PR-AUC (Davis & Goadrich, 2006) |
| **Multi-class aggregation** | macro / weighted / micro |
| **Production failure mode** | Threshold drift, class-prior shift, adversarial adaptation |
| **scikit-learn function** | `precision_score(y_true, y_pred, average=...)` |
| **Realistic targets** | Spam 0.99+, lead scoring 0.40–0.70, fraud triage 0.40–0.70, ad targeting 0.20–0.60 |
