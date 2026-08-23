---
title: "What Is Hyperparameter Tuning in Machine Learning?"
description: "Hyperparameter tuning finds the best ML model training settings — learning rate, tree depth, regularisation. Covers grid search, random search, Bayesian method."
category: "machine-learning"
author:
  name: "Andrew Martin"
publishedAt: 2026-08-18
image:
  src: "/images/what-is-hyperparameter-tuning-in-machine-learning.webp"
  alt: "3D paper craft diorama of hyperparameter tuning showing dials and gauges adjusting a machine learning model"
tags:
  - hyperparameter-tuning
  - machine-learning
  - model-optimization
  - grid-search
  - bayesian-optimization
faq:
  - question: "What is hyperparameter tuning in machine learning?"
    answer: "Hyperparameter tuning finds the best configuration settings for a machine learning model before training begins — settings like learning rate, number of trees, or regularisation. Unlike model parameters, hyperparameters are not learned from data and must be set externally."
  - question: "What is the difference between a parameter and a hyperparameter?"
    answer: "Parameters are values the model learns from training data — weights in a neural network, coefficients in linear regression. Hyperparameters are set before training — learning rate, batch size, number of layers. Parameters update during training; hyperparameters control how that training proceeds."
  - question: "What are the three main hyperparameter search strategies?"
    answer: "The three main strategies are grid search, random search, and Bayesian optimisation. Grid search tries every combination exhaustively. Random search samples combinations randomly. Bayesian optimisation uses prior results to guide the next search, making it the most efficient for expensive models."
  - question: "Which hyperparameters should you tune first?"
    answer: "Start with the ones that have the largest impact: learning rate, regularisation strength, and model capacity (depth or number of estimators). For tree-based models, tune max depth, number of estimators, and learning rate. For neural networks, prioritise learning rate and batch size."
  - question: "How long does hyperparameter tuning take?"
    answer: "Tuning time depends on model complexity and search strategy. Grid search on a small dataset with scikit-learn can finish in minutes. Bayesian optimisation on a deep learning model can take hours or days. Using random search instead of grid search typically cuts compute by 50 to 80 percent."
  - question: "What is Bayesian hyperparameter optimisation?"
    answer: "Bayesian optimisation builds a surrogate model of the objective function and uses it to decide which hyperparameter configurations to try next. It focuses evaluation on promising regions of the search space, making it more sample-efficient than grid or random search for expensive models."
  - question: "Does hyperparameter tuning cause overfitting?"
    answer: "Yes, if you tune hyperparameters using the test set or report cross-validation scores from the tuning process as final performance. This is optimistic bias. Use nested cross-validation or a held-out test set that is never touched during tuning to get an honest estimate."
keyTakeaways:
  - "Hyperparameters are settings chosen before training — learning rate, regularisation, tree depth — while parameters are values the model learns from data."
  - "Learning rate is the single most impactful hyperparameter across both deep learning and gradient boosting models — tune it first."
  - "Random search finds better solutions than grid search in fewer trials because it covers the search space more efficiently, per Bergstra and Bengio (2012)."
  - "Bayesian optimisation via Optuna or Hyperopt is the most sample-efficient strategy for expensive models, cutting tuning compute by 50 to 80 percent."
  - "Always tune on a separate validation set or use nested cross-validation — tuning on the test set causes data leakage and inflates accuracy estimates."
callout:
  variant: "pro"
  title: "Tune Learning Rate First"
  content: "Before running any search strategy, manually test three learning rates (0.1, 0.01, 0.001). The difference between them often exceeds anything you gain from tuning every other hyperparameter combined."
---

Machine learning models have two kinds of settings: parameters the model learns from data, and hyperparameters you configure before training begins. Getting the hyperparameters right can be the difference between a model that ships and one that stalls at 60 percent accuracy. Yet many teams either skip tuning entirely or waste compute on exhaustive searches that add marginal value.

This guide explains what hyperparameter tuning is, which settings matter most, the three dominant search strategies, how to run tuning in practice, and the pitfalls that invalidate results. According to McKinsey's *State of AI 2024*, 65 percent of organisations now use AI regularly, but fewer than half have mature MLOps practices — and hyperparameter tuning is one of the clearest dividing lines between teams that ship reliable models and those that do not.

## What Is Hyperparameter Tuning in Machine Learning?

Hyperparameter tuning is the process of searching for the configuration settings that produce the best model performance on validation data — settings chosen before training begins, such as learning rate, regularisation strength, number of trees, or network depth. These settings control how the learning algorithm operates, not what it learns, and the goal is to maximise generalisation to unseen data.

The distinction between parameters and hyperparameters is fundamental. **Parameters** are values the model learns during training — the weights in a neural network, the coefficients in linear regression, the split points in a decision tree. **Hyperparameters** are configured externally and remain fixed during a single training run. You cannot backpropagate into them; you must set them, train, evaluate, and try again.

### Parameters vs Hyperparameters

| Dimension | Parameters | Hyperparameters |
|---|---|---|
| **Set by** | Learning algorithm during training | Engineer before training |
| **Examples** | Neural network weights, regression coefficients | Learning rate, batch size, number of layers |
| **Count** | Thousands to billions | Dozens at most |
| **Optimised via** | Gradient descent, closed-form solutions | Grid search, random search, Bayesian optimisation |
| **Changed during training?** | Yes, every iteration | No, fixed for each run |

A typical neural network has millions of parameters but only 5 to 20 hyperparameters that matter. Despite this asymmetry, the right hyperparameter choices can swing final accuracy by 10 to 30 percentage points — often more than switching model architecture.

### Why Hyperparameter Tuning Matters

Models with default hyperparameters rarely perform well on real business data. The defaults in scikit-learn or PyTorch are chosen to work reasonably across a wide range of problems, not to be optimal for any specific one. According to Stanford HAI's *AI Index 2024 report*, models that undergo systematic hyperparameter search outperform default-configuration models by a meaningful margin on benchmark tasks, particularly when training data is limited or class-imbalanced.

For business applications, the stakes are concrete. A fraud detection model with a poorly tuned decision threshold misses transactions worth thousands of dollars per day. A churn prediction model with an overfit learning rate flags the wrong customers for retention campaigns — the same kind of [lead qualification mistakes](https://sales.growthgear.com.au/sales-techniques/how-to-qualify-leads-using-bant-criteria-complete-guide) that plague sales teams with bad scoring rules. A recommendation system with an under-tuned embedding dimension fails to surface relevant products, undercutting the [AI marketing automation](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation) tools that depend on it. In each case, the architecture is fine — the hyperparameters are wrong.

> **Common mistake:** Do not treat hyperparameter tuning as a one-time step. As your data distribution shifts — new product lines, seasonal patterns, customer segments — previously optimal hyperparameters degrade. Re-tune quarterly for models in production, or whenever you observe a performance drift greater than 5 percent.

## Which Hyperparameters Should You Tune First?

Not all hyperparameters are equal. Tuning the right ones first delivers most of the available performance gain. The learning rate alone often accounts for 60 to 80 percent of the improvement from tuning, with regularisation and model capacity contributing the remainder.

### The High-Impact Hyperparameters

**Learning rate** controls how large each weight update is during gradient descent. Too high and training diverges; too low and training is impractically slow. For deep learning, the viable range spans three orders of magnitude — 0.0001 to 0.1 — making it the single most important hyperparameter to get right. For gradient boosting models like XGBoost, learning rate interacts with the number of estimators: a lower learning rate requires more trees but often produces better generalisation. Our [guide to gradient descent in deep learning](/deep-learning/gradient-descent-deep-learning-guide) covers the mechanics in detail.

**Regularisation strength** controls how much the model is penalised for complexity. L2 regularisation (weight decay) shrinks weights toward zero, preventing any single feature from dominating. L1 regularisation drives some weights to exactly zero, performing feature selection. The regularisation strength — `alpha` in scikit-learn, `weight_decay` in PyTorch — determines how aggressive this penalty is. Too much regularisation underfits; too little overfits. This connects directly to [how overfitting works in machine learning](/machine-learning/what-is-overfitting-in-machine-learning) and why it degrades production performance.

**Model capacity** — the number of layers in a neural network, the depth of a decision tree, the number of estimators in a gradient boosting ensemble — determines how complex the patterns the model can learn are. More capacity means the model can fit more complex relationships but also overfits more easily. The capacity hyperparameter interacts with regularisation: higher capacity typically requires stronger regularisation to generalise.

### Hyperparameters by Model Type

| Model Type | Top 3 to Tune First | Search Range |
|---|---|---|
| **Neural Network** | Learning rate, batch size, dropout rate | LR: 0.0001–0.1, batch: 16–256, dropout: 0.1–0.5 |
| **Random Forest** | Number of trees, max depth, max features | Trees: 100–1000, depth: 5–30, features: sqrt–log2 |
| **XGBoost / LightGBM** | Learning rate, number of estimators, max depth | LR: 0.01–0.3, estimators: 100–1000, depth: 3–10 |
| **Support Vector Machine** | C (regularisation), kernel, gamma | C: 0.1–100, gamma: scale–auto |
| **Logistic Regression** | C (inverse regularisation), penalty type | C: 0.01–100, penalty: l1, l2 |

### Low-Impact Hyperparameters to Deprioritise

Some hyperparameters rarely change outcomes and can be left at defaults. Optimiser-specific parameters (Adam's beta1 and beta2, epsilon) have robust defaults from the [original Adam paper by Kingma and Ba (2014)](https://arxiv.org/abs/1609.04836) — beta1=0.9, beta2=0.999, epsilon=1e-8 — and need tuning only in edge cases. Momentum values, weight initialisation seeds, and learning rate scheduler parameters are similarly low-impact compared to the top three.

Deprioritising these saves compute. If you have budget for 50 trials, spend 30 on learning rate, 10 on regularisation, and 10 on model capacity — not 5 each across ten hyperparameters. The [training guide for machine learning models](/machine-learning/how-to-train-machine-learning-models-beginners) reinforces this prioritisation: start with the settings that move the needle, then refine.

> **Ready to improve your model performance?** GrowthGear's team has helped 50+ startups integrate AI solutions that drive real results — from hyperparameter optimisation to full MLOps pipelines. [Book a Free Strategy Session](https://growthgear.com.au) to discuss your machine learning roadmap.

## What Are the Main Hyperparameter Search Strategies?

Three search strategies dominate hyperparameter tuning: grid search, random search, and Bayesian optimisation. Each trades off simplicity, compute cost, and sample efficiency differently. The right choice depends on model training time, the number of hyperparameters, and whether you can parallelise evaluations.

### Grid Search

Grid search exhaustively evaluates every combination of hyperparameter values from a predefined set. If you specify 5 learning rates, 3 batch sizes, and 4 dropout rates, grid search trains 60 models — every possible combination. It is simple, deterministic, and guaranteed to find the best configuration within the grid you define.

The weakness is combinatorial explosion. Adding a fourth hyperparameter with 5 values multiplies the search space by 5. A grid over 5 hyperparameters with 5 values each requires 3,125 training runs — impractical for any model that takes more than a minute to train. Grid search also wastes compute evaluating bad regions of the space: if learning rate 0.1 consistently fails, every combination using 0.1 is a wasted trial.

[Scikit-learn's GridSearchCV](https://scikit-learn.org/stable/modules/grid_search.html) is the standard implementation. It integrates with [cross-validation](/machine-learning/what-is-cross-validation-in-machine-learning) natively, scoring each configuration across k folds.

### Random Search

Random search samples hyperparameter configurations at random from a distribution over the search space. Instead of trying every combination, it tries a fixed number of random draws — 50, 100, or 200 — and keeps the best.

The key insight comes from Bergstra and Bengio (2012): when some hyperparameters matter more than others (which is almost always the case), random search is dramatically more efficient than grid search. Grid search wastes trials on combinations of low-impact hyperparameters; random search explores the high-impact dimensions more thoroughly. Their research showed random search finds configurations as good as or better than grid search in a fraction of the trials — often 5 to 20 percent of the grid size.

Random search is also trivially parallelisable. Each trial is independent, so you can distribute 100 trials across 100 machines with no coordination overhead. This makes it the default choice for most teams starting out with systematic tuning.

### Bayesian Optimisation

Bayesian optimisation uses the results of previous trials to decide which configuration to try next. It builds a probabilistic surrogate model — typically a Gaussian Process or a Tree-structured Parzen Estimator (TPE) — of the objective function, then uses an acquisition function to balance exploration (trying untested regions) against exploitation (refining promising regions).

This makes Bayesian optimisation the most sample-efficient strategy: it needs fewer trials to find good configurations because it learns from each evaluation. For deep learning models where a single training run takes hours, this efficiency is decisive. A Bayesian search might find an optimal configuration in 30 trials where grid search needs 500 and random search needs 150.

[Optuna](https://optuna.org/) is the most widely used open-source framework for Bayesian hyperparameter optimisation. It implements TPE by default, supports pruning of unpromising trials mid-training (which saves further compute), and integrates with PyTorch, TensorFlow, and XGBoost. The `TPESampler` in Optuna is the recommended starting point for most use cases.

### Search Strategy Comparison

| Strategy | Trials to Converge | Parallelisable? | Best For | Compute Cost |
|---|---|---|---|---|
| **Grid search** | All combinations in grid | Yes | Small search spaces, few hyperparameters | High (exhaustive) |
| **Random search** | 50–200 (typical) | Yes (trivially) | Default choice for most models | Medium |
| **Bayesian** | 20–50 (typical) | Partially (sequential rounds) | Expensive models, large search spaces | Low per result |

> **Pro tip:** Start with random search to identify the right order of magnitude for each hyperparameter, then switch to Bayesian optimisation to refine the promising region. This two-phase approach often outperforms either strategy alone — random search is better at exploration, Bayesian is better at exploitation.

## How to Run Hyperparameter Tuning in Practice

Running hyperparameter tuning in practice requires a structured workflow: define the search space, choose a validation strategy, run the search, and evaluate results on a held-out test set that is never touched during tuning. Skipping any step risks wasted compute or inflated performance estimates that will not hold in production.

### Step 1: Define the Search Space

Start narrow and expand. For each hyperparameter, define a range based on domain knowledge and prior experience — not a wide range hoping the search will find something. If you are tuning a neural network's learning rate, start with {0.001, 0.01, 0.1} rather than {0.00001, 0.0001, 0.001, 0.01, 0.1, 1.0}. The [number of epochs](/machine-learning/what-is-an-epoch-in-machine-learning) you plan to train for also interacts with learning rate — longer schedules tolerate higher rates with warmup.

Log-scale search is essential for learning rates and regularisation parameters. The difference between 0.001 and 0.01 is as significant as the difference between 0.01 and 0.1 — linear spacing will miss the right region.

### Step 2: Choose a Validation Strategy

Never tune on the test set. Use one of:

- **Hold-out validation set**: Split data into train (70 percent), validation (15 percent), test (15 percent). Tune on validation, report test.
- **K-fold cross-validation**: Train and validate on k folds. More reliable for smaller datasets. K=5 or K=10 is standard.
- **Nested cross-validation**: Use an outer loop for performance estimation and an inner loop for tuning. The only honest way to report accuracy after tuning — it prevents the optimistic bias that occurs when you tune and evaluate on the same folds.

For business applications, nested cross-validation is the gold standard but expensive. A practical compromise: tune with 5-fold cross-validation on the training set, then evaluate the best configuration on a held-out test set that was never touched during tuning.

### Step 3: Run the Search

Use a consistent random seed for reproducibility. Log every trial — hyperparameters, validation score, training time, and model checkpoint. Optuna, Weights & Biases Sweeps, and Ray Tune all provide built-in logging; if you are running manual scripts, write results to a structured file.

A practical workflow:

1. Run random search with 50 trials across the top 3 hyperparameters.
2. Identify the best-performing region (e.g., learning rate around 0.003, dropout around 0.3).
3. Run Bayesian optimisation in that narrowed region with 20 to 30 additional trials.
4. Retrain the best configuration on the full training set (including the validation folds).
5. Evaluate once on the held-out test set.

### Step 4: Evaluate on Held-Out Test Data

The test set score is the only number you report externally. If it is significantly lower than the cross-validation score from tuning, the model has overfit to the validation procedure — go back, add regularisation, or collect more data. This gap between validation and test performance is the most reliable diagnostic for whether your tuning generalises.

### Cost Considerations

Hyperparameter tuning is the most compute-intensive part of the ML workflow. A single training run might cost $2 on cloud GPU; a 100-trial random search costs $200. Bayesian optimisation with Optuna can cut this to $60–100 for equivalent results. For teams operating under budget constraints, prioritise tuning on a representative data sample before running the full dataset — results from a 20 percent sample typically transfer well to the full dataset for hyperparameter selection.

## Hyperparameter Tuning Pitfalls and Best Practices

Hyperparameter tuning fails silently more often than it fails loudly. The most damaging errors are ones that produce a model that looks good in evaluation but degrades in production. These are the pitfalls to watch for and the practices that prevent them.

### Pitfall 1: Tuning on the Test Set

The most common and damaging mistake. If you evaluate hyperparameter configurations on the test set and pick the best one, the test set has become part of your training process. The resulting accuracy is optimistically biased and will not hold in production. This is a form of data leakage — the same issue covered in our [overfitting guide](/machine-learning/what-is-overfitting-in-machine-learning), where the test set trap inflates accuracy estimates.

**Fix**: Use nested cross-validation or a separate held-out test set that is evaluated exactly once, after all tuning is complete. Never look at test set performance during the search. Logging every trial's configuration and held-out score automatically — rather than by hand — is exactly what experiment tracking in an MLOps practice is for; see [best MLOps tools for small teams](/machine-learning/best-mlops-tools-for-small-teams) for tools that make this the default.

### Pitfall 2: Not Using a Consistent Random Seed

Each training run involves randomness — data shuffling, weight initialisation, dropout masks. Without a fixed seed, performance differences between hyperparameter configurations may be noise rather than signal. Two configurations that differ by 1 percent accuracy might be statistically identical if the random seed varies.

**Fix**: Set a global seed at the start of each trial. Use `numpy.random.seed()`, `torch.manual_seed()`, and `random.seed()` at the top of your training script. For rigorous comparison, run each configuration with 3 to 5 seeds and report the mean and standard deviation.

### Pitfall 3: Overfitting to the Validation Set

With enough trials, any search strategy will find a configuration that performs well on the validation set by chance — especially if the validation set is small. A 200-trial random search on a validation set of 500 rows is almost guaranteed to find a configuration that scores 2 to 5 percentage points above its true generalisation performance.

**Fix**: Use cross-validation rather than a single validation split. Keep the test set large enough (at least 1,000 rows for classification) to produce a stable estimate. If the dataset is small, use nested cross-validation.

### Pitfall 4: Ignoring Search Space Scale

Searching learning rate on a linear scale from 0 to 1 wastes almost all trials in the 0.1 to 1.0 range, where training diverges. The useful range — 0.0001 to 0.1 — occupies a tiny fraction of a linear search space. This is the single most common reason grid search underperforms random search: poorly scaled grids.

**Fix**: Always search learning rate, regularisation, and dropout on a logarithmic scale. Optuna's `suggest_float("lr", 1e-5, 1e-1, log=True)` handles this automatically.

### Pitfall 5: Not Logging or Versioning Trials

Without a record of what was tried and what happened, tuning results are not reproducible and cannot be improved upon. If a colleague asks "why did we choose learning rate 0.003?", and the only answer is "it worked", the tuning process has no institutional value.

**Fix**: Use Optuna's built-in study storage, Weights & Biases, or MLflow to log every trial. Store hyperparameters, validation metrics, training time, and model artifacts. This also enables pruning — stopping unpromising trials early to save compute.

> **Common mistake:** Do not assume the best configuration from tuning will remain optimal indefinitely. Data drift, feature changes, and model updates all shift the optimal hyperparameters. Schedule quarterly re-tuning for production models, and re-tune immediately whenever input data distributions change significantly.

### Best Practices Summary

| Practice | Why It Matters |
|---|---|
| Tune learning rate first | Accounts for 60–80 percent of available improvement |
| Use log-scale search for rate parameters | Linear search wastes trials in useless ranges |
| Use nested cross-validation for honest estimates | Prevents optimistic bias from tuning on evaluation data |
| Log every trial | Enables reproducibility, pruning, and institutional learning |
| Re-tune quarterly for production models | Data drift shifts optimal hyperparameters over time |
| Set a global random seed | Eliminates noise from data shuffling and weight init |
| Start narrow, expand the search space | Wide initial searches waste compute on bad regions |

---

## Take the Next Step

Hyperparameter tuning is one of the highest-leverage activities in machine learning — it can lift a model from a stalled prototype to production-ready accuracy without any architectural change. Whether you are building your first ML model or optimising an existing production pipeline, the difference between a tuned model and a default one is often the difference between a project that ships and one that does not. GrowthGear has helped 50+ startups implement AI and machine learning systems that drive measurable results. [Book a Free Strategy Session →](https://growthgear.com.au) to discuss your model performance, data pipeline, and AI roadmap.

---

## Sources & References

1. [Bergstra, J. & Bengio, Y. — "Random Search for Hyper-Parameter Optimization"](https://arxiv.org/abs/1609.04836) — Random search finds better configurations than grid search in 5–20 percent of the trials when some hyperparameters matter more than others (2012)
2. [Kingma, D.P. & Ba, J. — "Adam: A Method for Stochastic Optimization"](https://arxiv.org/abs/1609.04836) — Default Adam hyperparameters (beta1=0.9, beta2=0.999, epsilon=1e-8) work robustly across tasks (2014)
3. [Stanford HAI — AI Index Report 2024](https://aiindex.stanford.edu/report/) — Systematic hyperparameter search outperforms default-configuration models on benchmark tasks ($131B private AI investment)
4. [McKinsey — State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — 65 percent of organisations use AI regularly; fewer than 50 percent have mature MLOps practices (2024)
5. [Scikit-learn — GridSearchCV Documentation](https://scikit-learn.org/stable/modules/grid_search.html) — Standard implementation of grid search with cross-validation integration
6. [Optuna — Hyperparameter Optimization Framework](https://optuna.org/) — Open-source Bayesian optimisation with TPE sampler and trial pruning
