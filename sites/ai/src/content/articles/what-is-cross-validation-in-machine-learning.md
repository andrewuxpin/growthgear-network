---
title: "What Is Cross-Validation in Machine Learning?"
description: "Cross-validation in machine learning estimates how a model generalises. Learn k-fold, stratified, and time-series variants with real production trade-offs."
category: "machine-learning"
author:
  name: "GrowthGear Team"
publishedAt: 2026-05-26
image:
  src: "/images/what-is-cross-validation-in-machine-learning.webp"
  alt: "Isometric 3D illustration of k-fold cross-validation showing data partitioned into training and validation folds"
tags:
  - cross-validation
  - machine-learning
  - model-evaluation
  - k-fold
  - mlops
faq:
  - question: "What is cross-validation in machine learning?"
    answer: "Cross-validation is a resampling technique that estimates how a model will perform on unseen data by repeatedly training on subsets of the data and validating on the held-out portion. K-fold cross-validation is the most common form."
  - question: "Why use cross-validation instead of a single train-test split?"
    answer: "A single split produces an unreliable accuracy estimate because the result depends on which rows landed in the test set. Cross-validation averages across multiple splits, giving a lower-variance estimate and using every row for both training and evaluation."
  - question: "How many folds should you use in k-fold cross-validation?"
    answer: "Five or ten folds are the standard choices. Ten folds give a less biased estimate; five are faster to compute. For very small datasets (under 200 rows), leave-one-out cross-validation is appropriate. For very large datasets, three folds may suffice."
  - question: "What is stratified k-fold cross-validation?"
    answer: "Stratified k-fold preserves the class distribution across each fold. It is essential for classification problems with class imbalance — a fraud dataset with 1% positives needs every fold to contain ~1% positives, or evaluation noise will dominate the result."
  - question: "When should you not use k-fold cross-validation?"
    answer: "Avoid standard k-fold on time-series data (it causes future leakage) and grouped data such as multiple records per customer (it causes group leakage). Use TimeSeriesSplit or GroupKFold instead. Also avoid k-fold for very large datasets where a single validation set is statistically adequate."
  - question: "What is nested cross-validation?"
    answer: "Nested cross-validation uses an outer loop to estimate model performance and an inner loop to tune hyperparameters. It prevents the optimistic bias introduced when hyperparameter tuning and performance estimation are done on the same folds."
  - question: "Does cross-validation prevent overfitting?"
    answer: "Cross-validation does not prevent overfitting — it detects it. A high training score with a low cross-validation score is direct evidence of overfitting. Regularisation, early stopping, and more data are what actually reduce overfitting."
keyTakeaways:
  - "Cross-validation estimates generalisation by training and validating on multiple data partitions — a single train-test split is statistically unreliable below ~10,000 rows."
  - "K-fold cross-validation with k=5 or k=10 is the standard choice; ten folds are less biased, five are roughly twice as fast."
  - "Use stratified k-fold for imbalanced classification, GroupKFold for grouped data (customers, sessions), and TimeSeriesSplit for temporal data — never standard k-fold on these."
  - "Nested cross-validation separates hyperparameter tuning from performance estimation — the only honest way to report final model accuracy after tuning."
  - "Data leakage during cross-validation invalidates the entire result; fit preprocessing transformers inside each fold using scikit-learn Pipelines, not on the full dataset upfront."
callout:
  variant: "warning"
  title: "Never Tune and Report on the Same Folds"
  content: "Hyperparameter tuning on cross-validation scores and then reporting those same scores as final accuracy is the most common evaluation error in production ML. Use nested cross-validation or a held-out test set."
---

Machine learning models are judged on one question: how will they perform on data they have never seen? A single train-test split tries to answer this with one experiment. Cross-validation answers it with many — and the difference matters more than most teams realise.

This guide explains what cross-validation is in machine learning, how k-fold works step by step, which variant to use for which data type, the leakage mistakes that silently invalidate results, and how to wire cross-validation into a production ML workflow. Most production accuracy disappointments trace back to evaluation methodology, not model choice.

## What Is Cross-Validation in Machine Learning?

Cross-validation in machine learning is a resampling procedure that estimates how a model will generalise to new data by repeatedly partitioning the dataset into training and validation subsets, training on each training subset, scoring on each held-out validation subset, and averaging the results. The averaged score is a far more reliable performance estimate than any single train-test split.

### The Problem Cross-Validation Solves

Imagine you split 1,000 rows into 800 training and 200 test. Your model scores 0.87 accuracy. Now reshuffle and split again — the same model scores 0.81. Shuffle once more — 0.84. Which number do you report?

A single train-test split produces a point estimate with hidden variance. The result depends on which rows happened to land in the test set. With small datasets, this variance can easily exceed 5 percentage points — large enough to make a worse model look better than its competitor by accident.

Cross-validation averages across multiple splits, producing a lower-variance estimate and using every row in the dataset for both training and validation. The technique was formalised in [Stone's 1974 *Journal of the Royal Statistical Society* paper on cross-validatory choice](https://www.jstor.org/stable/2984809), which established the statistical foundation for using held-out data to assess predictive accuracy.

### The Three Goals Cross-Validation Serves

Cross-validation is used for three distinct purposes, and confusing them is a common source of evaluation error:

- **Performance estimation**: how accurate is this trained model likely to be in production?
- **Model selection**: which of several candidate models or algorithms should we deploy?
- **Hyperparameter tuning**: which configuration of a single algorithm performs best?

When you do all three on the same cross-validation folds, the final score is optimistically biased — you have effectively used the validation data to design the model. [Stanford HAI AI Index 2024](https://hai.stanford.edu/ai-index/2024-ai-index-report) data shows that fewer than half of organisations deploying ML have mature evaluation pipelines, and tuning-on-test-data is among the most common failure modes documented in industry post-mortems.

### Cross-Validation vs. Train-Test Split

A single train-test split is faster and cheaper but loses information and produces a noisy estimate. Cross-validation is more expensive (k times the training cost for k-fold) but produces a tighter estimate and uses the data more efficiently. The trade-off is worth it for any dataset below roughly 10,000 rows, and for any safety-critical or regulated application regardless of size. See our companion guide on [machine learning model evaluation metrics](/machine-learning/classification-report-machine-learning-guide) for which metric to actually report from each fold.

## How K-Fold Cross-Validation Works (Step-by-Step)

K-fold cross-validation works by splitting the dataset into k roughly equal partitions called folds, then training the model k times — each time using k-1 folds for training and the remaining fold for validation. The k validation scores are averaged to produce the final performance estimate. With k=5, the procedure trains five models and reports the mean of five validation scores.

### The Five-Step Procedure

For k-fold cross-validation with k=5:

1. **Shuffle** the dataset (unless it has structure that must be preserved, like time order)
2. **Partition** the data into 5 folds of equal size — Fold 1, Fold 2, Fold 3, Fold 4, Fold 5
3. **Train and validate** five models: train on Folds 2-5, validate on Fold 1; train on Folds 1, 3-5, validate on Fold 2; and so on
4. **Score** each model on its held-out fold using your chosen metric (accuracy, F1, ROC-AUC, RMSE)
5. **Report** the mean and standard deviation of the five scores

A mean of 0.84 with a standard deviation of 0.02 is far stronger evidence than a single split that returned 0.84. A mean of 0.84 with a standard deviation of 0.08 tells you the model is unstable and any single train-test split could mislead.

### Worked Example: 1,000-Row Churn Dataset

Suppose you have a 1,000-row customer churn dataset with 200 churners (20% positive class). For 5-fold cross-validation:

| Fold | Training rows | Validation rows | Validation F1 |
|---|---|---|---|
| 1 | 800 (160 churners) | 200 (40 churners) | 0.71 |
| 2 | 800 (160 churners) | 200 (40 churners) | 0.74 |
| 3 | 800 (160 churners) | 200 (40 churners) | 0.69 |
| 4 | 800 (160 churners) | 200 (40 churners) | 0.72 |
| 5 | 800 (160 churners) | 200 (40 churners) | 0.73 |

**Mean F1 = 0.718, standard deviation = 0.019**

Every churner contributes to validation exactly once. Every churner contributes to training in exactly four of the five folds. The training cost is 5x a single train, but the variance of the estimate is roughly 1/√5 of a single-split estimate — a far better signal-to-cost trade than running one split five times with different seeds.

### How Many Folds Should You Use?

[Kohavi's 1995 IJCAI study on cross-validation bias and variance](https://www.aaai.org/Papers/IJCAI/1995/IJCAI95-141.pdf) remains the definitive reference. The findings still hold:

- **k=10** is the most common choice — produces a low-bias estimate suitable for most applications
- **k=5** is roughly twice as fast and gives results within 1-2 percentage points of k=10 for most tabular problems
- **k=3** is appropriate for very large datasets (>100,000 rows) where wall-clock training time matters more than estimate precision
- **k=N** (leave-one-out) is appropriate for tiny datasets (<200 rows) where every row matters

When training cost is high (deep learning, transformer fine-tuning) k=3 or even a single train-validation-test split is the right pragmatic choice. The [scikit-learn cross-validation documentation](https://scikit-learn.org/stable/modules/cross_validation.html) provides the canonical implementations for each variant.

> **Ready to implement AI in your business?** GrowthGear's team has helped 50+ startups integrate AI solutions that drive real results. [Book a Free Strategy Session](https://growthgear.com.au) to discuss your ML evaluation roadmap.

## Cross-Validation Variants and When to Use Each

Different data structures require different cross-validation strategies. Using vanilla k-fold on time-series, grouped, or imbalanced data produces optimistically biased estimates that collapse the moment the model hits production. Five variants cover the vast majority of real-world cases.

### Stratified K-Fold for Imbalanced Classification

Stratified k-fold preserves the class distribution in each fold. On a fraud dataset with 1% positives and 99% negatives, vanilla 5-fold could randomly produce a fold with zero positives — the validation F1 is then undefined. Stratification guarantees that every fold contains roughly 1% positives, matching the original distribution.

Use stratified k-fold whenever the target is categorical and class proportions matter — which is essentially every business classification problem. Most production frameworks (scikit-learn's `StratifiedKFold`, XGBoost's `cv()` function) use stratification by default for classification tasks. This matters most when paired with metrics that are sensitive to class balance — see [what is sensitivity in machine learning](/machine-learning/what-is-sensitivity-in-machine-learning) for the precision-recall framework that depends on stable positive counts per fold.

### TimeSeriesSplit for Temporal Data

Standard k-fold shuffles the data, which causes future leakage in any time-ordered problem — the model trains on rows from 2025-04 and validates on rows from 2024-09, then claims 0.88 accuracy that vanishes when you deploy on actual future data.

TimeSeriesSplit (also called rolling-origin or walk-forward validation) trains on all data up to time T and validates on data after T. With 5 splits and 12 months of data:

| Split | Train period | Validate period |
|---|---|---|
| 1 | Jan-Feb | Mar |
| 2 | Jan-Apr | May |
| 3 | Jan-Jun | Jul |
| 4 | Jan-Aug | Sep |
| 5 | Jan-Oct | Nov |

Every validation fold is strictly after every training fold. Use TimeSeriesSplit for demand forecasting, financial prediction, anomaly detection on event streams, and any model where the row order encodes information. See our [deep learning for time-series forecasting](/deep-learning/deep-learning-time-series-forecasting-guide) guide for the modelling side of the same problem.

### GroupKFold for Clustered Data

If a dataset has multiple rows per customer, session, patient, or device, standard k-fold can place rows from the same customer in both training and validation. The model then appears to predict customer behaviour accurately — when it has simply memorised that customer.

GroupKFold guarantees that all rows for a given group end up in the same fold. Common applications:

- **Customer-level modelling**: lead scoring, churn prediction, recommendation
- **Patient-level modelling**: clinical prediction, treatment response
- **Session-level modelling**: anomaly detection, fraud at the session level
- **Speaker-level modelling**: voice biometrics, accent recognition

If the model will see new customers in production but is evaluated on rows from training customers, the production accuracy will collapse. GroupKFold catches this before deployment.

### Leave-One-Out and Repeated K-Fold

**Leave-one-out (LOO)** uses every single row as its own validation fold, training N models for N rows. LOO has the lowest bias but the highest variance and the highest cost. Appropriate for very small datasets (under 200 rows) where every row matters.

**Repeated k-fold** runs k-fold multiple times with different random shuffles and averages all the scores. Repeated 5-fold with 10 repeats trains 50 models — useful when the dataset is borderline small and you want a tighter confidence interval on the mean score.

### Nested Cross-Validation for Honest Tuning

When you tune hyperparameters using k-fold cross-validation and then report the best cross-validation score as final model performance, the score is optimistically biased because you have effectively trained the tuning on the validation folds. Nested cross-validation fixes this with two loops:

- **Outer loop** (e.g., 5 folds): produces honest performance estimates
- **Inner loop** (e.g., 3 folds): selects the best hyperparameters within each outer training fold

The outer loop's mean is the honest reportable accuracy. Nested cross-validation is computationally expensive (15-50x a single train) but is the only statistically defensible way to report performance after tuning.

### Comparison: Five Cross-Validation Variants

| Variant | When to use | Cost | Bias | Variance |
|---|---|---|---|---|
| **K-fold (k=5)** | Default for balanced tabular data | 5x | Low | Moderate |
| **Stratified k-fold** | Imbalanced classification | 5x | Low | Low |
| **TimeSeriesSplit** | Time-ordered data | 5x | Realistic | Higher |
| **GroupKFold** | Multiple rows per entity | 5x | Honest | Moderate |
| **LOO** | Tiny datasets (<200 rows) | Nx | Lowest | Highest |
| **Nested CV** | Tuning + reporting together | 15-50x | Lowest | Low |

## Common Cross-Validation Mistakes That Invalidate Results

Cross-validation only produces honest estimates when applied correctly. Five common mistakes — all of which I have personally seen invalidate model evaluations at clients ranging from early-stage startups to enterprise data science teams — produce numbers that look great in the notebook and fall apart in production.

### Mistake 1: Fitting Preprocessing on the Full Dataset

Scaling features, encoding categories, or imputing missing values using statistics computed on the full dataset *before* splitting into folds leaks information from validation into training. The model gets to peek at the validation set's mean and standard deviation. The cross-validation score is inflated by 1-5 percentage points.

**Fix**: wrap preprocessing inside a scikit-learn Pipeline so the fit is repeated on each fold's training portion only:

- Fit StandardScaler on the training portion of each fold
- Apply the fitted scaler to the validation portion (transform only — no refit)
- Same rule for SimpleImputer, OneHotEncoder, TargetEncoder, PCA

This is the single most common evaluation error in production ML. Building proper [feature engineering pipelines](/machine-learning/what-is-feature-engineering-in-machine-learning) requires the same discipline — fit on training, transform on validation.

### Mistake 2: Standard K-Fold on Time-Series Data

Using vanilla k-fold on time-ordered data trains the model on future events and validates on past events. The cross-validation score is meaningless and the model usually fails in production. Always use TimeSeriesSplit (rolling-origin) for forecasting problems.

### Mistake 3: Standard K-Fold on Grouped Data

Letting rows from the same customer appear in both training and validation folds produces a model that has memorised customer-level patterns. The cross-validation score reflects memorisation accuracy, not generalisation to new customers. Always use GroupKFold when the production target is "new customer / new session / new entity."

### Mistake 4: Tuning Hyperparameters on Held-Out Test Data

After running k-fold cross-validation to tune hyperparameters, the cross-validation score is no longer an honest estimate of final performance — it has been optimised against. Either use nested cross-validation, or hold out a separate test set that is never touched during tuning.

> **Common mistake:** A single held-out test set used to tune and then to report final accuracy is exactly the same error as no held-out test set at all. The test set must be opened exactly once.

### Mistake 5: Mismatched Production Conditions

Cross-validation produces an honest estimate of how the model performs on the distribution represented by the dataset. If the production distribution drifts — different customer mix, new sensor models, post-COVID consumer behaviour — the cross-validation score may overestimate live accuracy. Per [McKinsey State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai), distribution shift is the single largest contributor to ML deployment failures, with fewer than 25% of organisations running systematic post-deployment monitoring.

The fix is not better cross-validation — it is continuous monitoring of production metrics against cross-validation expectations. See our guide on [overfitting in machine learning](/machine-learning/what-is-overfitting-in-machine-learning) for the broader pattern of validation-to-production accuracy collapse.

## How to Use Cross-Validation in Production ML Projects

Cross-validation is not a one-time evaluation step — it is the spine of a serious ML workflow. Knowing when to use it (and when not to) is what separates research notebooks from deployed models that hold up over time. Five practical applications cover most production scenarios.

### Application 1: Initial Model Selection

When choosing between candidate algorithms (logistic regression vs. gradient boosting vs. neural network), run k-fold cross-validation on each with default or sensible hyperparameters and compare the mean validation scores. The model with the highest mean and reasonable standard deviation wins the first round. This selects the algorithm family before any tuning investment.

### Application 2: Hyperparameter Search

Grid search, random search, and Bayesian optimisation all use cross-validation as the inner objective function. The hyperparameter configuration with the highest mean k-fold score on the training portion is selected, then evaluated on the held-out test set. For computationally expensive models, reduce to k=3 during search and bump to k=10 for the final reported estimate.

### Application 3: Detecting Overfitting

Compare the training score (model fit on the training portion of each fold) to the validation score (held-out portion). A 0.95 training F1 with a 0.71 validation F1 is a clear overfitting signal — the same pattern documented in the [Google Developers ML Crash Course](https://developers.google.com/machine-learning/crash-course/overfitting/overfitting). The fix is regularisation, more data, or simpler models.

### Application 4: CI/CD for Models

Production ML pipelines run cross-validation on every model rebuild as a quality gate. A new candidate model must beat the current production model's cross-validation score on the latest training data before it gets promoted. This catches regressions from data quality issues, library upgrades, and feature engineering changes before they hit users.

For the marketing side of this — measuring whether an ML-driven feature actually moved the business metric — see [conversion rate optimization](https://marketing.growthgear.com.au/seo/conversion-rate-optimization-strategy-guide), which covers the post-deployment A/B testing that complements cross-validation.

### Application 5: Honest Reporting to Stakeholders

When presenting model accuracy to non-technical leadership, report the mean and standard deviation of cross-validation scores, not a single number. "Our churn model scores 0.72 F1 with a standard deviation of 0.03 across five folds" communicates uncertainty honestly. "Our churn model is 87% accurate" hides which split produced that number and is almost always misleading on imbalanced problems.

For sales applications such as [lead qualification using BANT criteria](https://sales.growthgear.com.au/sales-techniques/how-to-qualify-leads-using-bant-criteria-complete-guide), cross-validation tells you whether an ML-scored lead list will outperform the manual baseline before you ship it to the sales team — and by how much, with what confidence.

---

## Take the Next Step

Cross-validation is the difference between an ML model that looks promising in a notebook and one that survives contact with production. Getting evaluation methodology right is rarely glamorous, but it is the single highest-leverage investment a machine learning team can make.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Summary: Cross-Validation at a Glance

| Aspect | Detail |
|---|---|
| **Definition** | Resampling procedure that estimates generalisation by repeated train/validate cycles |
| **Default choice** | Stratified 5-fold or 10-fold for tabular classification |
| **Time-series variant** | TimeSeriesSplit (walk-forward, no future leakage) |
| **Grouped data variant** | GroupKFold (all rows for an entity in one fold) |
| **Tiny dataset variant** | Leave-one-out (under 200 rows) |
| **For tuning + reporting** | Nested cross-validation (outer loop honest estimate, inner loop tunes) |
| **Cost** | k× single-train cost; nested is 15-50× |
| **What it reports** | Mean + standard deviation of validation scores |
| **What it does not do** | Prevent overfitting (only detects it); guarantee production performance under distribution shift |
| **Most common mistake** | Fitting preprocessing on the full dataset instead of inside each fold |

## Frequently Asked Questions

**What is cross-validation in machine learning?**
Cross-validation is a resampling technique that estimates how a model will perform on unseen data by repeatedly training on subsets of the data and validating on the held-out portion. K-fold cross-validation is the most common form.

**Why use cross-validation instead of a single train-test split?**
A single split produces an unreliable accuracy estimate because the result depends on which rows landed in the test set. Cross-validation averages across multiple splits, giving a lower-variance estimate and using every row for both training and evaluation.

**How many folds should you use in k-fold cross-validation?**
Five or ten folds are the standard choices. Ten folds give a less biased estimate; five are faster to compute. For very small datasets (under 200 rows), leave-one-out cross-validation is appropriate.

**When should you not use k-fold cross-validation?**
Avoid standard k-fold on time-series data (it causes future leakage) and grouped data such as multiple records per customer (it causes group leakage). Use TimeSeriesSplit or GroupKFold instead.

**Does cross-validation prevent overfitting?**
Cross-validation does not prevent overfitting — it detects it. A high training score with a low cross-validation score is direct evidence of overfitting. Regularisation, early stopping, and more data are what actually reduce overfitting.

## Sources & References

- Stone, M. (1974). [Cross-Validatory Choice and Assessment of Statistical Predictions](https://www.jstor.org/stable/2984809). *Journal of the Royal Statistical Society*.
- Kohavi, R. (1995). [A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection](https://www.aaai.org/Papers/IJCAI/1995/IJCAI95-141.pdf). *IJCAI*.
- Pedregosa et al. (2011). scikit-learn: Machine Learning in Python. *JMLR*. [Cross-validation documentation](https://scikit-learn.org/stable/modules/cross_validation.html).
- [Google Developers Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) — accuracy, overfitting, and validation guidance.
- [Stanford HAI AI Index 2024](https://hai.stanford.edu/ai-index/2024-ai-index-report) — ML deployment maturity benchmarks.
- [McKinsey State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — production ML monitoring practices.
