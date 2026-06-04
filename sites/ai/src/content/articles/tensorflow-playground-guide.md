---
title: "TensorFlow Playground: Visualize Neural Nets Live"
description: "TensorFlow Playground lets you visualize neural networks live in your browser. Learn how to use it, which hyperparameters matter, and when to outgrow it."
category: "deep-learning"
author:
  name: "Abe Dearmer"
publishedAt: 2026-06-05
image:
  src: "/images/tensorflow-playground-guide.webp"
  alt: "TensorFlow Playground interactive neural network visualisation with layers, neurons, and decision boundary in blue and purple"
tags:
  - tensorflow-playground
  - neural-networks
  - deep-learning
  - visualisation
  - ai-tools
faq:
  - question: "What is TensorFlow Playground?"
    answer: "TensorFlow Playground is a free, browser-based neural network visualisation tool from Google. It lets you build, train, and inspect small networks live on four toy datasets, with no installs and no code. It uses TypeScript and runs entirely on the client."
  - question: "Is TensorFlow Playground free?"
    answer: "Yes. TensorFlow Playground is open source under Apache 2.0 and free to use at playground.tensorflow.org. The full source code is on GitHub at tensorflow/playground, and there are no accounts, paywalls, or API keys."
  - question: "Does TensorFlow Playground use real TensorFlow?"
    answer: "No. The Playground uses its own lightweight TypeScript implementation of a feedforward neural network. It is not built on TensorFlow.js or the Python TensorFlow library, but the concepts — layers, activations, learning rate, regularisation — transfer directly."
  - question: "What can you actually do in TensorFlow Playground?"
    answer: "You can train a 2D feedforward network on four built-in datasets, add up to six hidden layers, choose four activation functions, switch between classification and regression, toggle L1/L2 regularisation, and watch the decision boundary update each epoch."
  - question: "Who is TensorFlow Playground built for?"
    answer: "It is built for learners, instructors, and ML team leads who want to develop intuition about how hyperparameters shape a model. Google's Daniel Smilkov and Shan Carter released it in 2016 as a teaching tool, and it is widely used in university ML courses."
  - question: "Can you export a model from TensorFlow Playground?"
    answer: "No — there is no model export, no API, no save state, and no dataset upload. The Playground is a teaching sandbox, not a model-building platform. For real models, use TensorFlow, PyTorch, scikit-learn, or a no-code platform like Google Teachable Machine."
  - question: "What should you learn first in TensorFlow Playground?"
    answer: "Start with the linearly separable dataset on a single hidden layer to see how a feedforward network draws a decision boundary. Then move to the spiral dataset to feel why depth, the right activation function, and feature engineering matter for non-linear problems."
keyTakeaways:
  - "TensorFlow Playground is a free Google-built browser tool that trains small neural networks live on four toy 2D datasets, with no code and no signup."
  - "It is the fastest way to build hyperparameter intuition: learning rate, depth, activation function, and regularisation all show their effect on the decision boundary in seconds."
  - "It is a teaching sandbox, not a production tool — no model export, no real data upload, no API. Outgrow it within 1–2 weeks of serious use."
  - "Pair Playground sessions with a real first model (scikit-learn, TensorFlow, or Google Teachable Machine) so your team translates intuition into a shippable artifact."
callout:
  variant: "tip"
  title: "Run Three Datasets Back-to-Back"
  content: "Train the linear, circular, and spiral datasets with the same hyperparameters in one sitting. You will see — in under three minutes — why architecture choice depends on the data, not the other way around."
---

When a stakeholder asks "what is a neural network actually doing?", a 30-second answer rarely lands. A 90-second live demo on TensorFlow Playground does. The tool — built by Google's Daniel Smilkov and Shan Carter and open-sourced in April 2016 — has become the de facto visual reference for hyperparameter intuition, cited in Stanford CS229, MIT 6.S191, and DeepLearning.AI's foundational courses.

This guide explains exactly what TensorFlow Playground is, how to drive it, which hyperparameters matter most, and the point at which you outgrow it. According to McKinsey's *State of AI 2024*, 65% of organisations now use AI regularly, but fewer than 50% have mature MLOps practices — a gap that almost always starts with a team that never built shared mental models of how the networks behave. A 20-minute Playground session before a model selection meeting is one of the cheapest ways to close that gap.

## What Is TensorFlow Playground (and Why Business Teams Use It)?

**TensorFlow Playground is a free, browser-based neural network visualisation tool that trains a small feedforward network live on a 2D toy dataset, so learners can see — in real time — how layers, activations, and learning rate change the decision boundary.** It runs entirely client-side in TypeScript, with no Python and no GPU, and is hosted at playground.tensorflow.org.

### Who built it, and why it still matters

Daniel Smilkov and Shan Carter at Google Brain shipped TensorFlow Playground in April 2016, alongside an explainer in *Distill* and a public GitHub repo (tensorflow/playground). The goal was educational: give anyone a way to develop intuition about deep learning without writing code. Ten years on, it remains the canonical visual aid in introductory ML curricula — Stanford CS229, MIT 6.S191, and Andrew Ng's [DeepLearning.AI](https://www.deeplearning.ai/) courses all reference it.

For business teams, the value is different and very specific: it compresses two days of "what does this knob do?" guesswork into a 20-minute team session. A product manager who watches a spiral dataset fail with one hidden layer and then succeed with three develops a durable mental model — and stops asking "can we just add more layers?" in roadmap reviews.

### What it is not

The Playground is not TensorFlow. It does not use TensorFlow.js, the Python TensorFlow library, or any GPU compute. It is a pure TypeScript implementation of a feedforward network with backpropagation. It cannot:

- Load your own data
- Train on more than four built-in 2D datasets
- Export a model
- Save state across browser sessions
- Handle anything other than binary classification or single-output regression

Treat it as a [feedforward neural network](/deep-learning/feedforward-neural-network-guide) flight simulator — not a deployment environment.

### When to reach for it

Pull up the Playground when:

- A new hire needs to internalise what a hidden layer actually does
- An exec asks why one model overfits and another doesn't
- A team is debating "more data or more layers" before scoping a pilot
- An instructor wants a 5-minute classroom demo of [activation functions](/deep-learning/activation-functions-neural-networks-guide)

Skip it when the question is operational ("which cloud GPU should we rent?") or when the audience already builds production models — at that point [how to build a neural network in practice](/deep-learning/how-to-build-a-neural-network-complete-guide) is the better starting point.

## How Do You Use TensorFlow Playground in 5 Steps?

**To use TensorFlow Playground, open playground.tensorflow.org, pick one of the four datasets, choose features and a network shape, set learning rate and activation, then press the play button to train. Each epoch redraws the decision boundary, training loss, and test loss in under 200ms — so a full experiment takes seconds, not minutes.**

The five steps below are the exact sequence we use when introducing the tool to a client team for the first time.

### Step 1 — Pick a dataset

Four datasets ship with the Playground, listed from easiest to hardest:

| Dataset | Shape | Best for showing |
|---|---|---|
| Gaussian (linear) | Two well-separated blobs | Linear separability; logistic-regression-class problems |
| XOR | Four diagonal blobs | Why a single hidden layer is necessary |
| Circle | Inner ring vs outer ring | Why feature engineering or non-linear activations matter |
| Spiral | Two intertwined spirals | The need for depth, non-linearity, and patience |

Each dataset has sliders for noise (0–50%) and train-test split (10–90%). Start with the defaults — 25% noise, 50/50 split — so what you observe matches what your team will see if they replicate later.

### Step 2 — Choose your input features

The left-hand "Features" panel lets you toggle which engineered inputs the network sees: raw X1 and X2, X1², X2², X1·X2, sin(X1), sin(X2). This is the Playground's secret weapon: it makes the trade-off between [feature engineering](/machine-learning/what-is-feature-engineering-in-machine-learning) and network depth visible. With only the raw X1 and X2 inputs, the circle dataset needs at least one hidden layer. Add X1² and X2² as features, and even a zero-hidden-layer "network" — a pure linear classifier — solves it in one epoch.

### Step 3 — Set the architecture

The middle panel controls hidden layers and neurons per layer:

- **Hidden layers:** 0–6 (use the + / − buttons)
- **Neurons per layer:** 1–8 (use the + / − buttons over each layer)

A useful diagnostic: train the spiral dataset on (1, 8, 8, 1) — four hidden layers of 8 neurons — versus (1, 8, 1) and (1, 4, 1). The single-layer network never finds the spiral. The two-layer 4-neuron network plateaus. Only at three or four layers does the loss drop below 0.05. This is one of the cleanest live demonstrations of [why architecture matters](/deep-learning/types-of-neural-networks-complete-guide) you can give a non-technical stakeholder.

### Step 4 — Choose activation, learning rate, and regularisation

The top toolbar carries the four highest-impact knobs:

- **Activation:** ReLU (default), Tanh, Sigmoid, Linear
- **Learning rate:** 0.00001 → 10 on a log scale (default 0.03)
- **Regularisation:** None, L1, L2 (with rate 0–10)
- **Problem type:** Classification or Regression

For the spiral dataset, ReLU with learning rate 0.03 and L2 at 0.001 converges reliably in about 400 epochs. Switch to Sigmoid at the same learning rate and you can demonstrate the vanishing-gradient problem live: loss creeps down for 200 epochs, then stalls. Crank the learning rate to 3 and the loss oscillates so violently the line goes off-screen — a perfect entry point for explaining [gradient descent](/deep-learning/gradient-descent-deep-learning-guide).

> **Common mistake:** Don't change three knobs at once. Move one variable, run for 200 epochs, screenshot the boundary, then reset. Your team's intuition compounds with every isolated change and gets muddier with every multi-variable run.

### Step 5 — Read the visualisations

Three live visualisations update each epoch:

- **Decision boundary** — the colour-shaded background of the central panel. This is what the network "thinks" the answer is at every point of the input space.
- **Per-neuron activations** — every hidden neuron renders its own tiny decision boundary. This is the Playground's killer feature: you can literally see early neurons learn vertical edges, later neurons combine them.
- **Loss curves** — training loss (orange) and test loss (blue) tick up the right-hand panel each epoch. A widening gap between the two is overfitting in motion — see our explainer on [what overfitting is and how to detect it](/machine-learning/what-is-overfitting-in-machine-learning).

> **Ready to put neural networks to work?** GrowthGear's team has helped 50+ startups move from "we tried a tutorial" to a deployed model. [Book a Free Strategy Session](https://growthgear.com.au) to scope a 90-day AI pilot with realistic compute, data, and team requirements.

## Which Hyperparameters Actually Matter (and Why)?

**Four hyperparameters dominate model behaviour in the Playground and in real production training: learning rate, network depth, activation function, and regularisation. Learning rate alone can change loss by an order of magnitude; activation choice can stop training entirely; depth controls representational capacity; and regularisation controls generalisation.**

If your team has 20 minutes to internalise hyperparameters before sizing a real ML project, spend it on these four. Everything else (batch size, optimiser variant, weight initialisation) is a refinement, not a first-order driver.

### Learning rate — the single biggest lever

The Playground's log-scale learning-rate slider runs from 0.00001 to 10. Train any non-trivial dataset at each end and the lesson is immediate:

| Learning rate | What you see | Real-world analogue |
|---|---|---|
| 0.00001 | Loss barely moves over 1,000 epochs | Wasted compute; common with overly conservative defaults |
| 0.03 (default) | Smooth convergence in 100–400 epochs | The sweet spot — most production work lives here |
| 0.3 | Loss bounces but trends down | Aggressive but workable; watch for divergence |
| 3.0 | Loss explodes; boundary flips chaotically | Classic learning-rate-too-high failure |

Andrej Karpathy's widely-cited "[A Recipe for Training Neural Networks](http://karpathy.github.io/2019/04/25/recipe/)" treats learning-rate selection as the highest-ROI debugging step. The Playground makes the lesson cost three clicks.

### Depth vs feature engineering

The circle dataset is the cleanest illustration. With only the raw X1, X2 features:

- **0 hidden layers** never converges
- **1 hidden layer of 2 neurons** converges if learning rate and activation are right
- **1 hidden layer of 4+ neurons** converges reliably

Now toggle the X1² and X2² features on and turn off all hidden layers. The network — now a pure linear classifier on engineered features — solves the problem in one epoch. This is the lived experience behind the [feature engineering vs more layers](/machine-learning/what-is-feature-engineering-in-machine-learning) trade-off that Pedro Domingos called out in his 2012 *Communications of the ACM* essay "[A Few Useful Things to Know About Machine Learning](https://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf)" — "more data and better features beat a better algorithm."

### Activation function

Switching activation in the Playground is the fastest way to feel why ReLU dominates modern deep learning:

- **Sigmoid** — Trains slowly on deep networks; classic vanishing-gradient symptom
- **Tanh** — Faster than sigmoid, still struggles past 3+ layers on the spiral
- **ReLU** — The current default; trains the spiral in ~400 epochs reliably
- **Linear** — Demonstrates that without non-linearity, depth buys you nothing

[Activation function selection](/deep-learning/activation-functions-neural-networks-guide) is one of the few hyperparameters with a clean "right answer" in 2026: ReLU for hidden layers, with GELU for transformers. The Playground gives you the intuition for why.

### Regularisation

Add L2 regularisation at 0.001 on the spiral dataset. Watch the decision boundary smooth out — sharp tendrils into noisy points retract; the test loss curve narrows toward the training loss. Crank L2 to 0.1 and the network underfits entirely; the boundary becomes a near-circle. This is the bias-variance trade-off — formalised in Pedro Domingos' 2012 essay and Geoffrey Hinton's 2012 dropout paper — visible in one screen.

### What the Playground hides

Three production-critical things the Playground deliberately doesn't expose:

1. **Optimiser choice** — It uses vanilla stochastic gradient descent. Real systems use Adam (Kingma & Ba, ICLR 2015) or AdamW for almost all transformer training.
2. **Batch size** — Single-example updates only. In production, batch size interacts with learning rate (Goyal et al., Facebook AI Research 2017: linearly scale learning rate with batch size).
3. **Weight initialisation** — Uses small random init, not He or Glorot. In deep networks, init choice can be the difference between training and not.

When your team is past the Playground stage, those three hyperparameters are the next layer of detail to learn.

## When Do You Outgrow TensorFlow Playground (and What Comes Next)?

**You outgrow TensorFlow Playground the moment you want to train on your own data, deploy a model, or work with anything beyond 2D inputs. For most engineering teams that is 1–2 weeks of serious use. The natural next steps are scikit-learn for tabular, TensorFlow or PyTorch for deep learning, and Google Teachable Machine or Vertex AI AutoML for no-code production paths.**

The Playground is a sandbox by design. The team that built it explicitly chose not to add data upload or export, because the moment you do those things, the tool stops being an intuition builder and starts being a half-baked modelling platform — the worst of both worlds.

### The transition table

| You want to... | Use this next | Why |
|---|---|---|
| Train on your CSV / tabular data | **scikit-learn** (Python) | Industry-standard, free, runs on any laptop |
| Train an image classifier with <100 lines of code | **TensorFlow / Keras** or **PyTorch** | The two production frameworks; either is a defensible choice |
| Train on images without any code | **[Google Teachable Machine](/ai-tools/google-teachable-machine-guide)** | Transfer learning in the browser; exports a real model |
| Deploy a model behind an API | **TensorFlow Serving**, **TorchServe**, or **Vertex AI** | Production-grade serving with autoscaling and monitoring |
| Tune hyperparameters at scale | **Optuna** or **Weights & Biases Sweeps** | Bayesian search beats the Playground's manual approach by 10–100x |

### Bridging from intuition to a real first model

The cleanest 90-day path we use with clients:

- **Days 1–7:** Each team member runs at least 10 Playground experiments. Document one observation per run.
- **Days 8–21:** Re-implement two of those experiments in scikit-learn or Keras on a public tabular dataset (Kaggle's Titanic, UCI's Adult Income).
- **Days 22–60:** Fine-tune a pre-trained model on the team's actual data — usually via [transfer learning](/machine-learning/transfer-learning-machine-learning-guide).
- **Days 61–90:** Deploy a single model behind an internal API. Monitor it. Add a drift check.

The Stanford HAI [AI Index 2024](https://aiindex.stanford.edu/) reports that private AI investment reached $67.2B in 2023 in the United States alone, but that less than half of organisations achieve "scaled" AI value. The gap, repeatedly, is the bridge between intuition and a deployed model — exactly what this 90-day path closes.

### How GrowthGear helps

In our work advising 50+ startups across AI, sales, and marketing teams, we see the same pattern: leadership buys an LLM API subscription, builds a prototype in a weekend, then stalls at production. The fix is rarely "more compute" — it is shared mental models across product, engineering, and exec leadership about how training, evaluation, and monitoring actually work. A 20-minute Playground session is not a substitute for that, but it is the cheapest, fastest opener we have found.

For teams thinking through how an AI pilot ties into the broader marketing or sales motion, our guidance on [setting up Google Analytics 4](https://marketing.growthgear.com.au/seo/how-to-set-up-google-analytics-4-guide) and [creating winning sales presentations](https://sales.growthgear.com.au/sales-techniques/how-to-create-winning-sales-presentation-templates) on the GrowthGear sister sites covers the measurement and pitch layer that production AI work eventually needs.

---

## Take the Next Step

Building intuition is the cheap part. Translating that intuition into a deployed, measured, governed model is where the work — and the value — actually live. Whether you are sizing your first ML pilot or scoping a model upgrade, GrowthGear can help you skip the false starts and focus on the decisions that move the metric.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## TensorFlow Playground at a Glance

| Aspect | Detail |
|---|---|
| What it is | Browser-based neural network visualisation tool |
| Built by | Daniel Smilkov & Shan Carter, Google Brain (April 2016) |
| URL | playground.tensorflow.org |
| Cost | Free, open source (Apache 2.0) |
| Source | github.com/tensorflow/playground |
| Tech stack | TypeScript, client-side only |
| Uses real TensorFlow? | No — custom feedforward implementation |
| Datasets | 4 built-in 2D datasets (linear, XOR, circle, spiral) |
| Network capacity | 0–6 hidden layers × 1–8 neurons each |
| Activations | ReLU, Tanh, Sigmoid, Linear |
| Regularisation | L1, L2, or none |
| Problem types | Binary classification, single-output regression |
| Save / export | None — sandbox only |
| Best for | Hyperparameter intuition, classroom demos, exec onboarding |
| Outgrow it in | 1–2 weeks of serious use |
| Next step | scikit-learn, TensorFlow/Keras, PyTorch, or Google Teachable Machine |

## Sources & References

1. [TensorFlow Playground](https://playground.tensorflow.org) — The official tool itself, hosted by Google. (2016, ongoing)
2. [TensorFlow Playground GitHub repo](https://github.com/tensorflow/playground) — Open-source TypeScript source under Apache 2.0. (2016)
3. [Andrej Karpathy — "A Recipe for Training Neural Networks"](http://karpathy.github.io/2019/04/25/recipe/) — "Stage your learning rate. Most training failures are learning-rate failures." (2019)
4. [Pedro Domingos — "A Few Useful Things to Know About Machine Learning"](https://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf) — "More data and better features beat a better algorithm." *Communications of the ACM* (2012)
5. [McKinsey — *The State of AI 2024*](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — "65% of organisations now regularly use AI in at least one business function." (2024)
6. [Stanford HAI — *AI Index Report 2024*](https://aiindex.stanford.edu/) — "Private AI investment in the United States reached $67.2B in 2023." (2024)
7. [DeepLearning.AI — Foundational ML and Deep Learning courses](https://www.deeplearning.ai/) — Standard reference for ReLU vs Sigmoid / Tanh and learning-rate tuning. (ongoing)
