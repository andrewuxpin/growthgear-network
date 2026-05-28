---
title: "What Is Feature Engineering in Machine Learning"
description: "Feature engineering transforms raw data into ML-ready inputs. Learn core techniques, business applications, and how to prevent data leakage in your models."
category: "machine-learning"
author:
  name: "Abe Dearmer"
publishedAt: 2026-05-19
image:
  src: "/images/what-is-feature-engineering-in-machine-learning.webp"
  alt: "Feature engineering in machine learning: data transformation pipeline diagram in blue and purple line art"
tags:
  - feature-engineering
  - machine-learning
  - data-preparation
  - mlops
faq:
  - question: "What is feature engineering in machine learning?"
    answer: "Feature engineering is the process of transforming raw data into informative inputs (features) for ML models. It includes scaling, encoding, aggregating, and creating new variables that help algorithms detect patterns. Quality features are often more impactful than algorithm choice."
  - question: "What are the most common feature engineering techniques?"
    answer: "The most common techniques are: normalization/standardization (numerical), one-hot and target encoding (categorical), lag and rolling-window features (time series), and interaction features (ratios, products). Imputing missing values is also a core step in most pipelines."
  - question: "How does feature engineering differ from feature selection?"
    answer: "Feature engineering creates new variables from raw data. Feature selection removes redundant or low-value variables from an existing set. Feature extraction (e.g., PCA, embeddings) transforms variables into a new representation. All three are distinct steps in a typical ML pipeline."
  - question: "Is feature engineering still needed for deep learning models?"
    answer: "Yes. Deep learning reduces the need for manual feature engineering on unstructured data (images, text, audio) because CNNs and transformers learn representations automatically. But for tabular business data — CRM records, transactions, sensor logs — manual feature engineering typically outperforms raw inputs."
  - question: "What is data leakage in feature engineering?"
    answer: "Data leakage occurs when features include information unavailable at prediction time, inflating validation scores. Target leakage is the most common form: a feature derived from or correlated with the outcome variable, such as using a churn date to predict churn. Always fit transformers on training data only."
  - question: "How long does feature engineering take in a typical ML project?"
    answer: "According to the Anaconda State of Data Science 2023 survey, data scientists spend roughly 45% of their time on data preparation including feature engineering. For a 3-month ML project, expect 4-6 weeks on this stage — longer when domain expertise is required to generate meaningful features."
  - question: "What is a feature store in MLOps?"
    answer: "A feature store is a centralized platform that computes, stores, and serves features consistently between model training and production inference. It prevents training-serving skew, enables feature reuse across teams, and tracks feature lineage. Common platforms: Feast, Tecton, Vertex AI Feature Store, Databricks Feature Store."
keyTakeaways:
  - "Feature engineering is typically more impactful than algorithm selection — a model trained on well-engineered features outperforms a sophisticated model trained on raw data."
  - "Tabular business data (CRM, transactions, sensor logs) still requires manual feature engineering even when using deep learning, because neural networks do not automatically capture domain-specific relationships."
  - "Data leakage — especially target leakage — is the most common cause of inflated validation scores that fail in production. Always fit transformers on training data only, never on the full dataset."
  - "The Anaconda State of Data Science 2023 survey found data scientists spend ~45% of their time on data preparation; investing in a feature store and automated pipelines is the highest-ROI MLOps improvement for most teams."
  - "For business ML use cases, start with domain-driven features (RFM for churn, velocity for fraud, rolling averages for forecasting) before applying automated feature generation."
callout:
  variant: "warning"
  title: "Data Leakage Kills Production Models"
  content: "Always fit scalers, encoders, and imputers on training data only, then apply them to the validation and test sets. Fitting on the full dataset is the most common cause of validation scores that do not generalize."
---

Feature engineering is the process of transforming raw data into informative inputs that machine learning models can learn from effectively. It is widely considered the highest-leverage skill in applied ML — more impactful, in most cases, than choosing between XGBoost and a neural network.

As Pedro Domingos noted in his landmark 2012 paper in *Communications of the ACM*, "Feature engineering is the key" in applied machine learning. The features you feed a model determine its ceiling; no algorithm can extract signal that the input variables do not contain.

## What Is Feature Engineering in Machine Learning?

Feature engineering is the deliberate process of using domain knowledge and statistical analysis to create, transform, and select input variables — called *features* — that improve a machine learning model's predictive accuracy. It sits between raw data collection and model training in every production ML pipeline.

A feature is any measurable property of a data point used as model input. Raw data columns are rarely features ready for use. A customer's signup date is raw data; the number of days since their last login is an engineered feature. An invoice amount is raw data; a binary flag for "amount > 3 standard deviations above the customer's mean" is an engineered feature.

### Feature Engineering vs. Feature Selection vs. Feature Extraction

These three terms are often conflated but describe distinct operations:

| Operation | What it does | Example | Primary tool |
|---|---|---|---|
| **Feature engineering** | Creates new variables from raw data | Days since last purchase from a date column | Domain knowledge + pandas |
| **Feature selection** | Removes low-value variables from an existing set | Drop correlated or near-zero-variance features | LASSO, mutual info, RFE |
| **Feature extraction** | Transforms variables into a new lower-dimensional representation | PCA on 200 columns → 20 components | scikit-learn, autoencoders |

All three reduce noise and improve generalisation, but feature engineering increases information content while selection and extraction reduce dimensionality.

### Why Feature Engineering Still Matters in the Deep Learning Era

A common misconception is that deep learning eliminates the need for feature engineering. This is partially true for unstructured data: convolutional neural networks learn spatial features from images automatically, and transformers learn contextual representations from raw text tokens. Manual feature extraction for images and text is largely obsolete.

For **tabular business data**, however, manual feature engineering remains essential. The majority of business ML problems — churn prediction, demand forecasting, fraud detection, lead scoring — use structured data from CRM systems, transaction logs, or operational databases. On this data type, gradient-boosted trees with well-engineered features routinely outperform deep learning models with raw inputs. According to [McKinsey's State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai), 65% of organisations regularly use AI, but poor data quality remains the top barrier to production ML — a problem feature engineering directly addresses.

## Core Feature Engineering Techniques

The right feature engineering technique depends on the data type and the algorithm. A poor choice — such as label-encoding a high-cardinality categorical column for a neural network — introduces artificial ordinal relationships that mislead the model.

### Numerical Transformations

Raw numerical columns often violate the implicit assumptions of many ML algorithms.

**Normalisation and standardisation** bring features to a comparable scale. Min-max normalisation compresses values to [0, 1]: `x_scaled = (x − min) / (max − min)`. Z-score standardisation centres the distribution at zero with unit variance: `x_std = (x − mean) / std`. Use min-max for neural networks and KNN; use z-score for linear models, logistic regression, and SVMs. Neither is needed for tree-based models (gradient boosting, random forests), which are scale-invariant.

**Log transformation** addresses right-skewed distributions. Revenue, customer lifetime value, and page view counts are typically log-normal. Applying `log1p(x)` (which handles zero values) before modelling reduces the influence of outliers and improves linear model fit. Verify with a distribution plot before and after; log transforms are inappropriate for negative values.

**Binning** converts continuous variables into ordinal buckets. Age → (18-24, 25-34, 35-44, 45+). This is useful when the relationship between the feature and target is non-linear and step-wise — for example, conversion rates by age group often step up and down rather than trending smoothly.

### Categorical Encoding

Machine learning algorithms require numerical inputs. Converting categorical variables to numbers without losing their statistical properties is a central feature engineering challenge.

**One-hot encoding** creates a binary column for each category. `colour = {red, blue, green}` becomes three columns. This is the standard approach for nominal categories with **fewer than 20 unique values**. For tree-based models, one-hot encoding is generally fine. For linear models, it avoids the false ordinal ranking that integer-label encoding would introduce.

**Target encoding** (also called mean encoding) replaces each category value with the mean of the target variable for that category. For a churn prediction model, the category "enterprise" might be replaced with the mean churn rate of enterprise customers (e.g., 0.08). This captures predictive power in high-cardinality features — job titles, product SKUs, postal codes — without exploding dimensionality. **Critical**: always apply cross-validated target encoding to prevent target leakage.

**Frequency encoding** replaces each category with its count or proportion in the training set. Useful when the frequency of a category (e.g., rare vs. common device types) is itself predictive, and when cardinality is very high.

### Temporal and Lag Features

Time series and event-based data contain rich temporal patterns that require explicit extraction. Raw timestamps are useless to most ML algorithms; the patterns they contain must be made explicit.

**Calendar features** extract predictable cyclical patterns: day of week (Monday = 0… Sunday = 6), month, quarter, is_weekend, is_holiday, hour of day. Retail demand on a Monday is structurally different from a Saturday demand. Encoding these relationships directly prevents the model from having to discover them from limited data.

**Lag features** capture the value of a variable at a previous time step. The demand on day *t−1* is a powerful predictor of demand on day *t*. The pandas `shift()` function generates lag features efficiently. Choose lag depths based on domain knowledge: daily data might benefit from 7-day and 30-day lags; hourly IoT sensor data might need 1-hour and 24-hour lags.

**Rolling window statistics** — mean, std, min, max over a trailing window — smooth noise and capture trend. A 7-day rolling average of daily sales captures weekly patterns without the noise of individual days. Combine with lag features for most forecasting applications.

> **Pro tip:** When building lag features, sort your data by entity and time before calling `shift()`. Missing a sort step is one of the most common causes of subtle data leakage in time series pipelines.

### Interaction and Domain-Specific Features

Some of the highest-impact features are not derivable from raw columns alone — they require domain knowledge to conceive.

**Interaction features** capture relationships between two variables. Revenue per employee (revenue ÷ headcount) is more predictive of growth stage than either column alone. Click-through rate (clicks ÷ impressions) collapses two metrics into a single ratio that captures user intent. **Polynomial features** (x₁ × x₂, x₁², x₂²) generalise this but grow combinatorially — use PolynomialFeatures from [scikit-learn's preprocessing module](https://scikit-learn.org/stable/modules/preprocessing.html) selectively, not indiscriminately.

**Domain-specific aggregations** are often the most predictive features in production models. For customer data: RFM (Recency, Frequency, Monetary) — days since last purchase, number of purchases in the last 90 days, total spend — captures customer engagement more completely than any individual column. These aggregations should be designed with the business question in mind, not generated automatically.

> **Ready to build ML features that drive real business results?** GrowthGear's team has helped 50+ startups build production-ready AI pipelines that turn raw data into revenue. [Book a Free Strategy Session](https://growthgear.com.au) to discuss your ML roadmap.

## Feature Engineering for Business ML Problems

The most reliable feature engineering decisions come from understanding the mechanics of the business problem before touching the data. Domain knowledge converts raw CRM records, transaction logs, and operational data into features that capture the signals a model needs. Three categories of business ML problems share the most reusable feature engineering patterns.

### Customer Churn and Lead Scoring

Churn models predict which customers are likely to cancel. The most predictive features are behavioural signals, not demographic ones.

**High-value churn features:**
- Days since last login or last active session
- Number of support tickets submitted in the last 30 days
- Change in product usage over the last 30 days vs. the prior 30 days (momentum indicator)
- Contract days remaining (for subscription products)
- NPS survey score or last CSAT rating

**Lead scoring** uses similar engagement signals to rank inbound leads. Features from marketing automation — email opens, page views by topic, content downloads, form submissions — feed directly into a lead scoring model. The key is combining recency (when was the last touchpoint?) with frequency (how often do they engage?) and intent signals (did they visit pricing pages?). If your team uses a CRM like those covered in [best CRM software for small business teams](https://sales.growthgear.com.au/crm-tools/best-crm-software-small-business-teams), the raw data for these features is typically available in activity logs.

### Demand Forecasting

Demand forecasting models predict future sales, inventory needs, or resource consumption. The base signal (historical demand) is rarely sufficient on its own.

**High-value demand features:**
- Lag features at 7, 14, and 28 days (capture weekly seasonality)
- Rolling 4-week mean and standard deviation (smoothed trend + volatility)
- Day of week, month, and quarter indicators (calendar effects)
- Price and promotional flags (is there a discount active this week?)
- External signals where relevant: weather data for energy demand, economic indices for B2B procurement cycles

When setting up the analytics infrastructure to collect these signals, [Google Analytics 4](https://marketing.growthgear.com.au/seo/how-to-set-up-google-analytics-4-guide) provides behavioural demand signals for digital products that complement transactional data from your ERP or POS system.

### Fraud Detection

Fraud detection requires features that capture unusual behaviour relative to a baseline. Static thresholds ("flag anything over $5,000") are easily gamed; statistical features derived from a customer's own history are far more robust.

**High-value fraud features:**
- Transaction velocity: number of transactions in the last 1, 6, and 24 hours
- Deviation from personal average: `(current_amount − customer_mean) / customer_std`
- New payee flag: binary indicator for first-time recipient
- Geographic distance from the customer's typical location
- Time since last transaction (unusually short intervals are a fraud signal)

These features require careful temporal design: the customer's historical statistics must be computed from data **before** the transaction being scored, never including the current or future transactions. This is a classic data leakage scenario.

Understanding how well your fraud model performs in production requires interpreting the [classification report machine learning](/machine-learning/classification-report-machine-learning-guide) correctly — fraud detection is a high-recall use case where minimising false negatives matters more than overall accuracy. For deeper evaluation, the [sensitivity in machine learning](/machine-learning/what-is-sensitivity-in-machine-learning) guide covers the precision-recall trade-off in detail.

## The Feature Engineering Workflow

Good feature engineering is iterative, not a one-time step. A structured workflow prevents the two most common failure modes: building features that leak information from the future, and building features that improve training scores but fail in production.

### Exploratory Data Analysis and Domain Knowledge

Before writing a single line of transformation code, spend time understanding the data distribution and the business logic behind each column.

**EDA checklist:**
- Missing value rates per column (>20% missing often means drop or impute-with-indicator)
- Cardinality of categorical columns (inform encoding strategy)
- Distribution shape of numerical columns (inform whether log transform or winsorisation is needed)
- Correlation matrix (identify redundant features and multicollinearity risks)
- Target class balance (inform whether SMOTE or class-weight adjustments are needed)

Domain knowledge complements statistical analysis. A data scientist without domain input may compute "average order value" when the business team knows that the relevant signal is "average order value in the first 30 days" — a very different feature for a subscription churn model.

### Iterative Engineering and Leakage Prevention

Feature engineering is most productive when it is tightly coupled to model evaluation. The workflow is:
1. Engineer a candidate feature
2. Add it to the training set
3. Run cross-validation (on training data only)
4. Measure the change in validation metric
5. Keep if it improves the metric; discard if it adds noise

The most important technical discipline is **preventing data leakage**. Fit all preprocessing transformers (scalers, encoders, imputers) on the training split only, then apply the fitted transformer to validation and test splits. This mirrors production conditions: at inference time, only the training statistics are available. For a full walkthrough of [how to train machine learning models](/machine-learning/how-to-train-machine-learning-models-beginners), including the train-validation-test split mechanics, see the linked guide.

The second leakage risk is **temporal leakage** in time series problems. Maintain a strict temporal boundary: no feature for a prediction at time *t* may contain information from time *t* or later. If you compute rolling statistics, always use `.shift(1)` to ensure the rolling window ends at *t−1*.

### Feature Stores and MLOps

Production ML systems face a challenge that offline experimentation does not: the same feature computation must run consistently during both model training and real-time inference. If training uses a 30-day rolling average computed in Python and inference uses a 30-day rolling average computed in Java, they will not produce identical results — this is called **training-serving skew**, and it is a leading cause of production model degradation.

A **feature store** solves this by centralising feature computation and storage. The same feature definition is used for both training and serving. Popular platforms:
- **Feast** (open source): integrates with BigQuery and Redis for offline/online serving
- **Tecton**: managed platform with built-in monitoring and lineage
- **Vertex AI Feature Store**: GCP-native, integrates with BigQuery ML
- **Databricks Feature Store**: tight integration with Delta Lake and MLflow

According to the [Anaconda State of Data Science 2023](https://www.anaconda.com/state-of-data-science-report) survey, data scientists spend roughly 45% of their time on data preparation and feature work. Investing in a feature store is typically the highest-ROI infrastructure improvement for teams running more than three production models — it compounds across every future project. For teams thinking about [customer acquisition cost optimisation](https://marketing.growthgear.com.au/seo/customer-acquisition-cost-calculation-optimization-guide), a well-maintained feature store makes it practical to build and maintain the ML models that optimise CAC at scale.

Overfitting is a persistent risk when feature engineering generates many candidate features. The [overfitting in machine learning guide](/machine-learning/what-is-overfitting-in-machine-learning) covers how to detect and prevent it using learning curves and regularisation. The [machine learning algorithms guide](/machine-learning/machine-learning-algorithms-and-applications-guide) explains how different algorithm families respond to high-dimensional feature spaces.

---

## Take the Next Step

Feature engineering is where business knowledge meets data science. The quality of your features is the primary determinant of your model's business impact — and building that capability requires both technical skill and deep understanding of the problem you're solving.

Whether you're building your first churn model or scaling a production ML platform, GrowthGear can help you design feature pipelines that generate real business value rather than optimised benchmarks.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Feature Engineering Techniques: Quick Reference

The table below summarises the ten most commonly applied feature engineering techniques, the data types each suits, when to apply them, the primary risk to manage, and the standard Python implementation in pandas or scikit-learn.

| Technique | Data type | When to use | Key risk | Python implementation |
|---|---|---|---|---|
| **Min-max normalisation** | Numerical | KNN, neural networks, SVM | Sensitive to outliers | `MinMaxScaler()` |
| **Z-score standardisation** | Numerical | Linear models, logistic regression | Assumes near-normal distribution | `StandardScaler()` |
| **Log transform** | Numerical (skewed) | Revenue, counts, durations | Fails on zero or negative values | `np.log1p(x)` |
| **Binning** | Numerical | Non-linear step relationships | Loss of within-bin variance | `pd.cut()` |
| **One-hot encoding** | Categorical (low cardinality) | <20 unique values | Feature explosion at high cardinality | `pd.get_dummies()` |
| **Target encoding** | Categorical (high cardinality) | >20 unique values | Target leakage — use cross-validated | `category_encoders` |
| **Frequency encoding** | Categorical (very high cardinality) | When frequency itself is predictive | Loses within-category distinction | manual `value_counts()` mapping |
| **Lag features** | Time series | Forecasting, sequential predictions | Data leakage if sort order wrong | `df.shift(n)` |
| **Rolling statistics** | Time series | Trend capture, noise reduction | Lookahead bias if not shifted | `df.rolling(n).mean()` |
| **Interaction features** | Any | Domain-known relationships | Combinatorial explosion | `PolynomialFeatures(degree=2)` |

## Sources & References

1. [Pedro Domingos, "A Few Useful Things to Know About Machine Learning"](https://dl.acm.org/doi/10.1145/2347736.2347755) — "Feature engineering is the key" in applied ML; most effort in practical applications goes into feature engineering (2012)
2. [Anaconda State of Data Science 2023](https://www.anaconda.com/state-of-data-science-report) — Data scientists spend approximately 45% of their time on data preparation and feature engineering tasks (2023)
3. [Google Developers ML Crash Course](https://developers.google.com/machine-learning/crash-course) — Standard references for numerical transformations, encoding strategies, and cross-validation best practices (2023)
4. [scikit-learn Preprocessing Documentation](https://scikit-learn.org/stable/modules/preprocessing.html) — StandardScaler, MinMaxScaler, PolynomialFeatures, and categorical encoding implementations (2024)
5. [McKinsey State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — 65% of organisations regularly use AI; poor data quality cited as top barrier to production ML deployment (2024)
