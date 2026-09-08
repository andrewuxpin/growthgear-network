---
title: "L1 vs L2 Regularization: Which to Use and When"
description: "L1 vs L2 regularization compared: how Lasso and Ridge prevent overfitting, when each approach wins, and how to pick the right penalty for your ML model."
category: "machine-learning"
author:
  name: "Andrew Martin"
publishedAt: 2026-09-08
image:
  src: "/images/l1-vs-l2-regularization-machine-learning-guide.webp"
  alt: "Claymation illustration of clay shapes shrinking and vanishing, representing L1 and L2 regularization in machine learning"
tags:
  - regularization
  - lasso
  - ridge-regression
  - overfitting
  - machine-learning
faq:
  - question: "What is the main difference between L1 and L2 regularization?"
    answer: "L1 (Lasso) can drive coefficients to exactly zero, performing automatic feature selection. L2 (Ridge) shrinks coefficients toward zero without eliminating any, keeping every feature in the model."
  - question: "When should I use L1 instead of L2 regularization?"
    answer: "Use L1 when you suspect only a handful of features matter and want a sparse, interpretable model — such as high-dimensional genomic or text data where features vastly outnumber samples."
  - question: "Can I combine L1 and L2 regularization?"
    answer: "Yes. Elastic Net (Zou & Hastie, 2005) combines both penalties, capturing Lasso's sparsity with Ridge's stability — it typically outperforms pure Lasso when features are highly correlated."
  - question: "Does regularization slow down model training?"
    answer: "Regularization adds negligible overhead for linear models with closed-form or convex solvers. In deep learning, weight decay adds no meaningful training time versus an unregularized model."
  - question: "How do I choose the regularization strength?"
    answer: "Tune the penalty strength (alpha or lambda) via cross-validation — test a range of values on a validation set and pick the one that minimizes validation error, not training error."
  - question: "Is L1 regularization the same as feature selection?"
    answer: "L1 performs a form of automatic feature selection by zeroing out uninformative coefficients, but it isn't identical to dedicated methods like recursive feature elimination."
  - question: "Does regularization work the same way in deep learning as in linear models?"
    answer: "The math is similar — L2 weight decay penalizes large weights just like Ridge — but deep learning typically combines weight decay with dropout and batch normalization rather than using it alone."
keyTakeaways:
  - "L1 (Lasso) drives coefficients to exactly zero for automatic feature selection; L2 (Ridge) shrinks coefficients toward zero without eliminating any, per Tibshirani (1996) and Hoerl & Kennard (1970)."
  - "Choose L1 for high-dimensional, sparse-signal data — a 2026 Nature Scientific Reports study used Lasso on gene expression data spanning 266 patients and 19,785 genes."
  - "Elastic Net (Zou & Hastie, 2005) combines both penalties and typically outperforms pure Lasso when predictors are highly correlated."
  - "A 2026 study of 606 data analysts (Thiel et al.) found regularization adoption depends more on perceived ease of use than formal recommendations — default to Ridge, then test alternatives via cross-validation."
  - "Always standardize features before applying L1/L2 penalties — unscaled features get penalized unevenly regardless of their actual predictive value."
callout:
  variant: "warning"
  title: "Scale Features Before Regularizing"
  content: "L1/L2 penalties are scale-sensitive — standardize features first, or high-magnitude columns get penalized unfairly regardless of predictive value."
---

Adding more features to a model almost always improves training accuracy — right up until the model starts memorizing noise instead of learning signal. Regularization is the standard fix, and choosing between its two dominant forms, **L1 (Lasso)** and **L2 (Ridge)**, is one of the first real modeling decisions a team has to get right.

This guide compares both penalties on the mechanics that matter for a production decision: **how each shrinks coefficients, when each wins, and how they combine** with each other and with deep learning techniques like dropout and batch normalization. For the underlying problem both are solving, see our guide on [what overfitting actually is](/machine-learning/what-is-overfitting-in-machine-learning), and for the broader tradeoff regularization manages, see [the bias-variance tradeoff explained](/machine-learning/bias-variance-tradeoff-machine-learning-explained).

## L1 vs L2 Regularization: What's the Core Difference?

Regularization adds a penalty term to a model's loss function to discourage overly complex models and reduce overfitting. **L1 (Lasso)** penalizes the sum of absolute coefficient values and can drive some coefficients to exactly zero, while **L2 (Ridge)** penalizes the sum of squared coefficient values and shrinks them toward — but not to — zero.

This distinction defines how each technique handles model complexity. Goodfellow, Bengio, and Courville define regularization in [*Deep Learning*](https://www.deeplearningbook.org/) (MIT Press, 2016) as any modification to a learning algorithm intended to reduce generalization error but not necessarily training error — the goal is better performance on unseen data, not a better fit to the training set. That single-sentence definition is worth memorizing: it's the test that separates a genuine regularization technique from a change that merely makes training harder without improving how the model generalizes.

Both penalties are also easy to under-apply or over-apply, and the two failure modes look different in practice. Too little regularization leaves a model free to fit noise in the training data — it looks great on the training set and falls apart on new data. Too much regularization pushes coefficients toward zero so aggressively that the model underfits, discarding real signal along with the noise. The right penalty strength sits at the point where validation error stops improving, which is why cross-validation — not a fixed default — is the correct way to pick it.

### The Geometric Intuition Behind Sparsity

The reason L1 zeroes out coefficients and L2 doesn't comes down to the shape of each penalty's constraint region. **L1's constraint region is a diamond** with corners sitting exactly on the coordinate axes. When the loss function's contour lines touch one of those corners, the solution lands with one or more coefficients at exactly zero — that's what produces sparsity.

**L2's constraint region is a circle**, with no corners for the loss contour to land on. Coefficients shrink proportionally toward zero as the penalty increases, but geometrically they almost never land exactly on an axis. That single geometric difference is the entire reason Lasso performs feature selection and Ridge doesn't.

### Two Techniques Built Decades Before Deep Learning

Both penalties originated in classical linear regression, long before neural networks made "regularization" a household term in machine learning. [**Hoerl and Kennard introduced Ridge in 1970**](https://www.tandfonline.com/doi/abs/10.1080/00401706.1970.10488634) to address biased estimation for nonorthogonal (correlated) predictor problems — a full 26 years before Lasso, and decades before "deep learning" existed as a term. [**Tibshirani introduced Lasso in 1996**](https://rss.onlinelibrary.wiley.com/doi/10.1111/j.2517-6161.1996.tb02080.x) specifically to combine variable selection with coefficient shrinkage in one step, replacing the older, clunkier practice of running a separate feature-selection pass before fitting a model.

Today both apply far beyond their original linear-regression context — to logistic regression, support vector machines, and as **weight decay** in neural network training, which is functionally L2 regularization applied directly to network weights. Understanding which decade-old statistical idea underlies a modern deep learning default often demystifies why that default exists at all, rather than treating it as an arbitrary framework setting.

## How L1 Regularization (Lasso) Works — And When to Use It

L1 regularization, from [Tibshirani's 1996 paper "Regression Shrinkage and Selection via the Lasso,"](https://rss.onlinelibrary.wiley.com/doi/10.1111/j.2517-6161.1996.tb02080.x) adds the sum of absolute coefficient values to the loss function. This forces the coefficients of the least-informative features to shrink exactly to zero — performing automatic feature selection while the model fits.

### The Sparse Signal Assumption

Lasso's usefulness depends on a specific assumption: that only a handful of your candidate features actually carry signal, and the rest are noise. This is called the **sparse signal assumption**. When it holds, driving irrelevant coefficients to exactly zero simplifies the model and makes it dramatically easier to explain which inputs actually drive the prediction.

### A Real-World Example: High-Dimensional Genomics

Lasso's clearest real-world use case is data where the number of features vastly exceeds the number of observations — a scenario statisticians call **"p >> n."** A [2026 study in *Nature Scientific Reports*](https://www.nature.com/articles/s41598-026-35273-3) on Lasso for extremely high-dimensional genomic data used gene expression measurements spanning **266 patients and 19,785 genes**. With roughly 74 genes for every patient in the dataset, an unregularized model would overfit instantly — Lasso-based methods are the standard way researchers narrow that field down to a manageable set of candidate biomarkers.

The same p >> n pattern shows up outside genomics whenever a business collects far more candidate signals than it has labeled examples — text classification with a large vocabulary, fraud models with hundreds of engineered transaction features, or an early-stage recommendation system with limited purchase history per user. In every one of these cases, the question isn't "should I regularize" but specifically "should I use a technique that also tells me which of these hundreds of features are worth keeping" — which is precisely what Lasso is built for.

### Where L1 Falls Short

Lasso's weak point is correlated features. When two or more predictors carry overlapping information, Lasso tends to **arbitrarily keep one and zero out the rest** — a selection that can flip between training runs on slightly different data samples. If your business case depends on knowing exactly which specific feature matters (not just "one of this correlated group"), that instability becomes a real problem.

> **Ready to put your model's overfitting problem to bed?** GrowthGear's team has helped 50+ startups build production ML pipelines that generalize instead of memorizing training data. [Book a Free Strategy Session](https://growthgear.com.au) to discuss your regularization strategy.

## How L2 Regularization (Ridge) Works — And When to Use It

L2 regularization, introduced by [Hoerl and Kennard in 1970](https://www.tandfonline.com/doi/abs/10.1080/00401706.1970.10488634) to handle "biased estimation for nonorthogonal problems," adds the sum of squared coefficient values to the loss function. This shrinks every coefficient toward zero proportionally without eliminating any — keeping all features in the model while reducing each one's influence.

### Handling Multicollinearity

Ridge is the safer default when most of your features genuinely contribute some signal, or when features are highly correlated — a condition statisticians call **multicollinearity**. Instead of arbitrarily picking one correlated feature like Lasso does, Ridge **distributes weight across the whole correlated group**, which produces coefficient estimates that stay far more stable from one training run to the next.

That stability matters most when the exact feature identity is less important than raw prediction accuracy — Ridge won't discard a feature just because a correlated twin happens to explain slightly more variance in one particular training sample. A demand-forecasting model built on overlapping marketing and seasonality signals, for example, benefits from Ridge precisely because those signals move together — arbitrarily zeroing one out (as Lasso might) would just push its share of the signal onto whichever correlated feature survived, with no real gain in accuracy or simplicity.

### Weight Decay in Deep Learning

In neural networks, L2 regularization applied to the weight matrices is called **weight decay**, and it's one of the oldest, most widely used regularization techniques in deep learning. It's rarely used alone — teams typically combine it with [dropout](/deep-learning/what-is-dropout-in-deep-learning) to prevent neuron co-adaptation and [batch normalization](/deep-learning/what-is-batch-normalization-in-deep-learning) to stabilize the input distribution each layer sees, since each technique attacks a different mechanism behind overfitting.

Most deep learning frameworks expose weight decay as a single hyperparameter on the optimizer rather than a separate loss term you write yourself — PyTorch's `weight_decay` argument on `torch.optim` and Keras's `kernel_regularizer` argument both implement L2 shrinkage this way. That framework-level convenience is also why weight decay is frequently left at its default value rather than tuned: it's easy to forget it's a real hyperparameter with a real effect on generalization, not just a fixed setting.

## L1 vs L2 Regularization: Side-by-Side Comparison

The right choice between L1 and L2 comes down to whether you need feature selection or stable shrinkage across correlated features. **L1 wins** when you expect only a handful of features matter and want an interpretable, sparse model. **L2 wins** when most features contribute and multicollinearity is a real concern.

| Factor | L1 (Lasso) | L2 (Ridge) |
|---|---|---|
| **Coefficient behavior** | Drives some coefficients to exactly zero | Shrinks all coefficients toward zero |
| **Feature selection** | Performs automatic feature selection | No feature selection — keeps every feature |
| **Best for** | Sparse signal, high-dimensional data | Dense signal, correlated features |
| **Correlated features** | Arbitrarily selects one, zeros the rest | Distributes weight across the group |
| **Solution stability** | Can vary run-to-run with correlated inputs | Consistently stable |
| **Typical use cases** | Genomics, text classification, interpretable scoring models | General prediction, deep learning weight decay |
| **Origin** | Tibshirani (1996) | Hoerl & Kennard (1970) |

### Decision Framework by Use Case

Start with **Ridge** as a safe default for prediction-focused tasks — it provides stable performance without discarding potentially useful information. Switch to **Lasso** when a business stakeholder or a regulator needs a clear answer to "which features actually matter," since Lasso's sparsity gives you a short, defensible list rather than a diffuse weighting across dozens of inputs. Use **Elastic Net** when you want Lasso's sparsity but your features are correlated enough that pure Lasso's instability becomes a liability.

### What Data Teams Are Saying

Practitioners who've shipped both approaches to production commonly report that Ridge is the safer choice when a model feeds an automated decision and nobody will manually audit which features drove it — the stability just avoids surprises. Teams building anything customer- or regulator-facing, on the other hand, often prefer Lasso specifically because a shorter, sparser feature list is easier to explain in a model documentation review.

The more common criticism of Lasso in practice is that its feature selection can look different depending on which correlated variant of a feature happened to survive in a given training run — teams that skip a stability check (like bootstrapped Lasso runs) sometimes get burned by a feature list that shifts on a routine model refresh. The recurring critique of Ridge, by contrast, is less about the technique and more about interpretability: keeping every feature technically "in" the model can make stakeholder conversations harder even when the model performs well.

## Elastic Net and Combining Regularization with Dropout, Batch Norm

Elastic Net, introduced by [Zou and Hastie in 2005](https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9868.2005.00503.x), combines the L1 and L2 penalties into a single loss term — capturing Lasso's sparsity alongside Ridge's stability against correlated features. It specifically outperforms pure Lasso in datasets where predictors are highly correlated or where the feature count exceeds the number of observations.

### Tuning the L1/L2 Mix

Elastic Net introduces a mixing parameter (commonly called `l1_ratio`) that controls the balance between the two penalties, letting a team tune anywhere between pure Lasso and pure Ridge behavior rather than committing to one extreme. The technique is supported directly in [scikit-learn's `ElasticNet`, `SGDClassifier`, and `LogisticRegression` classes](https://scikit-learn.org/stable/modules/linear_model.html), which makes it straightforward for an engineering team to add without building a custom optimizer.

Treat `l1_ratio` as a real hyperparameter, not a fixed default — pick it the same way you'd pick any other hyperparameter. See our guide on [hyperparameter tuning](/machine-learning/what-is-hyperparameter-tuning-in-machine-learning) for the general search workflow, and [what cross-validation actually does](/machine-learning/what-is-cross-validation-in-machine-learning) for how to score each candidate value honestly instead of overfitting the tuning process itself.

### Regularization Stacks in Deep Learning

In deep learning, regularization strategies are almost always combined rather than used in isolation. **L2 weight decay** constrains overall parameter magnitude, **dropout** prevents specific neurons from co-adapting by randomly deactivating them during training, and **batch normalization** stabilizes the distribution of inputs each layer receives. Each targets a different failure mode, which is why production architectures stack all three rather than treating them as interchangeable alternatives — dropping one doesn't just weaken the model's defenses, it leaves an entirely different overfitting mechanism unaddressed.

Despite the clear value, adoption in practice is inconsistent. A [2026 empirical study by Thiel et al.](https://arxiv.org/abs/2604.02992) surveying 606 data analysts found that regularization adoption depends less on formal recommendations and more on **perceived ease of implementation and practical benefit** — meaning a technique with real, demonstrated value can still go unused if a team defaults to unregularized models out of habit rather than deliberate choice. That finding lines up with what shows up in code review at most companies: regularization gets added after a model embarrasses someone in production, not before, even though the fix costs one line of configuration.

Marketing teams building [attribution models](https://marketing.growthgear.com.au/seo/what-is-marketing-attribution-modeling-explained) or [CAC forecasting models](https://marketing.growthgear.com.au/seo/customer-acquisition-cost-calculation-optimization-guide) face this exact same overfitting risk whenever they add another channel or campaign feature to a statistical model — a model that perfectly explains last quarter's conversions by over-weighting a handful of correlated campaigns is a model that will misattribute credit the moment next quarter's channel mix shifts.

---

## Take the Next Step

Deciding between L1, L2, and Elastic Net is a five-minute conversation once you know what you're optimizing for — the harder work is auditing an existing model for overfitting and building the validation discipline to catch it before it reaches production. GrowthGear can help your team pick the right regularization strategy and build the cross-validation pipeline that keeps it honest.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Regularization Technique Comparison Summary

| Technique | Coefficients | Feature selection | Best for | Introduced by |
|---|---|---|---|---|
| **L1 (Lasso)** | Some driven to exactly zero | Yes, automatic | Sparse, high-dimensional data | Tibshirani (1996) |
| **L2 (Ridge)** | All shrunk toward zero | No | Correlated, dense-signal data | Hoerl & Kennard (1970) |
| **Elastic Net** | Mix of both behaviors | Partial, tunable | Correlated data where sparsity still matters | Zou & Hastie (2005) |
| **Dropout** | N/A (structural, not weight-based) | No | Neural network co-adaptation | Srivastava et al. (2014) |
| **Batch Normalization** | N/A (normalizes activations) | No | Training stability in deep networks | Ioffe & Szegedy (2015) |

## Sources & References

1. [Tibshirani (1996), JRSS-B](https://rss.onlinelibrary.wiley.com/doi/10.1111/j.2517-6161.1996.tb02080.x) — "Regression Shrinkage and Selection via the Lasso," the original Lasso paper (1996)
2. [Hoerl & Kennard (1970), Technometrics](https://www.tandfonline.com/doi/abs/10.1080/00401706.1970.10488634) — "Ridge Regression: Biased Estimation for Nonorthogonal Problems," the original Ridge paper (1970)
3. [Zou & Hastie (2005), JRSS-B](https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9868.2005.00503.x) — "Regularization and Variable Selection via the Elastic Net" (2005)
4. [Goodfellow, Bengio & Courville — Deep Learning](https://www.deeplearningbook.org/) — canonical definition of regularization as reducing generalization error, not training error (2016)
5. [Nature Scientific Reports](https://www.nature.com/articles/s41598-026-35273-3) — "Stochastic LASSO for extremely high-dimensional genomic data," gene expression example with 266 patients and 19,785 genes (2026)
6. [Thiel et al., arXiv:2604.02992](https://arxiv.org/abs/2604.02992) — "Why is Regularization Underused? An Empirical Study on Trust and Adoption of Statistical Methods," N=606 data analysts (2026)
7. [scikit-learn documentation](https://scikit-learn.org/stable/modules/linear_model.html) — Lasso, Ridge, and ElasticNet implementation reference
