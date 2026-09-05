---
title: "AI Compliance for Insurance: 2026 Guide"
description: "AI compliance for insurance means the NAIC Model Bulletin, Colorado's SB 21-169 and new ADMT law, bias-testing gaps, and EU AI Act rules for insurers."
category: "machine-learning"
author:
  name: "Abe Dearmer"
publishedAt: 2026-09-05
image:
  src: "/images/ai-compliance-for-insurance-guide.webp"
  alt: "Paper craft shield and document stack symbolizing AI compliance for insurance regulation"
tags:
  - ai-compliance
  - insurance
  - naic
  - colorado-ai-law
  - insurtech
faq:
  - question: "What is AI compliance for insurance?"
    answer: "AI compliance for insurance is the set of regulatory obligations — model governance, bias testing, and vendor oversight — that apply to insurers and insurtech vendors using AI in underwriting, pricing, claims, or marketing decisions."
  - question: "Which states have adopted the NAIC Model Bulletin on AI?"
    answer: "By July 2026, 25 states had formally adopted the NAIC's Model Bulletin on the Use of AI Systems by Insurers, with 8 more in progress. California, Colorado, New York, and Texas run their own frameworks instead."
  - question: "What replaced Colorado's SB 24-205?"
    answer: "A federal court paused SB 24-205's enforcement on April 27, 2026. Governor Polis then signed SB 26-189 on May 14, 2026, replacing it with a narrower Automated Decision-Making Technology framework effective January 1, 2027."
  - question: "Does Colorado's SB 21-169 still apply to insurers?"
    answer: "Yes. SB 21-169 remains in effect and requires insurers to inventory every algorithm used in pricing, test for discriminatory outcomes, and file annual compliance reports with the state."
  - question: "How many insurers actually test their AI models for bias?"
    answer: "According to a 2025 NAIC survey, 92% of health insurers use or plan to use AI, but nearly one-third don't regularly test their models for bias or discrimination."
  - question: "Does the EU AI Act apply to US insurers?"
    answer: "Yes, if they operate in or sell into the EU. The Act classifies insurance risk-assessment AI as high-risk, with compliance required by August 2026 and penalties up to €35 million or 7% of global revenue."
  - question: "What should an insurer's AI governance program include?"
    answer: "A documented model inventory, board-level accountability, mandatory pre-deployment bias testing, formal third-party vendor oversight, and exam-ready documentation — the common denominator across NAIC, Colorado, and EU requirements."
keyTakeaways:
  - "By July 2026, 25 states had formally adopted the NAIC's Model Bulletin on AI, with 8 more in progress — near-universal state adoption is close."
  - "Colorado's original SB 24-205 was paused by a federal court on April 27, 2026 and replaced by SB 26-189 (signed May 14, 2026), a narrower Automated Decision-Making Technology framework effective January 1, 2027 that still covers insurance."
  - "SB 21-169 remains Colorado's operative insurance-specific AI law, requiring an algorithm inventory, bias testing, and annual compliance reports."
  - "A 2025 NAIC survey found 92% of health insurers use or plan to use AI, but nearly one-third don't regularly test their models for bias — exactly the gap the NAIC's new AI Systems Evaluation Tool is built to catch."
  - "The EU AI Act classifies insurance risk-assessment AI as high-risk, with compliance required by August 2026 and penalties up to €35 million or 7% of global revenue."
callout:
  variant: "pro"
  title: "Build One Governance Program, Not Three"
  content: "Design your AI governance program around Colorado's algorithm-inventory standard, the strictest requirement — it satisfies NAIC and EU AI Act obligations by default."
---

Colorado's AI insurance law changed twice in six weeks this year. A federal court paused enforcement of the state's sweeping SB 24-205 on April 27, 2026, and by May 14 Governor Polis had signed its narrower replacement, SB 26-189, into law. For insurers and insurtech vendors, that whiplash is the clearest signal yet that AI compliance for insurance is not a settled checklist — it's a moving target across at least three regulatory layers at once.

This guide covers what AI compliance means specifically for insurance, what the NAIC Model Bulletin now requires in 25+ states, what actually changed in Colorado, where insurers are still failing bias-testing obligations, and a practical build order for a governance program that holds up under all three layers simultaneously.

## What Is AI Compliance for Insurance?

AI compliance for insurance is the set of regulatory obligations — model governance, bias testing, and vendor oversight — that apply to insurers and insurtech vendors using AI in underwriting, pricing, claims, or marketing decisions. It spans a state-adopted model bulletin, standalone state statutes, and international rules like the EU AI Act, each with different scope and enforcement timelines.

Unlike a generic [AI governance framework](/machine-learning/ai-governance-for-business-guide), insurance compliance concentrates almost entirely on decisions that touch a consumer's premium, coverage, or claim outcome. That's a narrower target than [AI compliance for financial services](/machine-learning/ai-compliance-for-financial-services-guide), which spans lending, trading, and consumer credit, or [AI compliance for healthcare](/machine-learning/ai-compliance-for-healthcare-guide), which splits between device law and patient privacy. Insurance compliance instead concentrates on one core question regulators keep asking: did this model treat a policyholder unfairly?

### Which Insurance Functions Draw the Most Regulatory Scrutiny?

Regulators focus overwhelmingly on functions with direct consumer impact: underwriting, pricing and rate-setting, claims decisions, and fraud detection. These are the areas where an AI model's output changes what a policyholder pays or receives. Administrative AI — scheduling, internal HR tools, back-office document routing — attracts comparatively little regulatory attention because it doesn't touch a consequential decision.

### What Are the Three Regulatory Layers Insurers Must Track?

US and global insurers need to track three distinct layers at once: state-level adoption of the NAIC's Model Bulletin, standalone state statutes like Colorado's, and the EU AI Act for any insurer operating in or selling into the EU. Missing any one layer leaves a real compliance gap, since each covers different obligations and enforcement bodies.

## What Does the NAIC Model Bulletin Require in 2026?

The NAIC's Model Bulletin on the Use of Artificial Intelligence Systems by Insurers, adopted in December 2023, requires insurers to maintain a written AI Systems Program with board and senior-management accountability, documented risk controls, model validation and bias testing, and oversight of third-party AI vendors. By July 2026, [25 states had formally adopted it](https://content.naic.org/sites/default/files/cmte-h-big-data-artificial-intelligence-wg-map-ai-model-bulletin.pdf), with 8 more in progress.

Maryland Insurance Commissioner Kathleen Birrane, who chaired the NAIC committee behind the bulletin, framed the goal at adoption as balancing innovation against risk:

> "This initiative represents a collaborative effort to set clear expectations for state Departments of Insurance regarding the utilization of AI by insurance companies, balancing the potential for innovation with the imperative to address unique risks." — Kathleen A. Birrane, Maryland Insurance Commissioner

### What Must a Written AI Systems Program Include?

A written AI Systems Program needs five concrete elements: named board or senior-management accountability for AI oversight, documented risk controls, a model validation process that includes bias and error testing before deployment, a third-party vendor oversight process, and documentation retained in a form ready for regulatory examination on request.

| Requirement | What It Means for Insurers |
|---|---|
| Written AI Systems Program | Centralized, auditable documentation of every AI use, risk assessment, and governance decision |
| Board/senior-management accountability | Named executives formally approve AI models and own the risk framework |
| Bias and error testing | Statistical testing for discriminatory outcomes before any model reaches production |
| Third-party vendor oversight | Vendor contracts require transparency, security, and compliance commitments |
| Documentation for exams | Testing results and governance records retained and retrievable for state review |

### Which States Run Their Own Frameworks Instead?

California, Colorado, New York, and Texas don't simply adopt the NAIC bulletin — each maintains its own insurance-specific AI framework, and each imposes requirements the bulletin doesn't cover. Insurers licensed in any of these four states cannot treat NAIC-bulletin compliance as sufficient on its own.

### Why Is the Enforcement Window Still Open?

The NAIC is currently piloting its first structured AI Systems Evaluation Tool, built specifically to examine insurers' AI governance programs. Through Q1 2026, no state had reported an enforcement action under any adopted bulletin — meaning insurers still have time to build real infrastructure before examinations start finding gaps.

> **Ready to build a compliant AI program for your insurance business?** GrowthGear's team has helped 50+ startups and insurers integrate AI solutions that hold up under regulatory scrutiny. [Book a Free Strategy Session](https://growthgear.com.au) to map your AI compliance roadmap.

## How Strict Are Colorado's AI Insurance Laws?

Colorado runs the toughest state-level AI insurance regime in the country, and it just rewrote half of it. SB 21-169 (2021) remains in effect, requiring insurers to inventory pricing algorithms, test for discriminatory outcomes, and file annual reports. Its companion law, SB 24-205, was paused by a federal court on April 27, 2026 and replaced by SB 26-189.

### What Happened to SB 24-205?

SB 24-205, Colorado's 2024 "Consumer Protections for Artificial Intelligence Act," would have regulated any "high-risk AI system" that made or substantially contributed to a consequential decision — including insurance underwriting, pricing, and claims. A federal court paused its enforcement on April 27, 2026, and a multi-stakeholder workgroup convened by Governor Polis recommended a narrower approach. The legislature passed the replacement, SB 26-189, on May 9, 2026, and the governor [signed it into law](https://leg.colorado.gov/bills/sb26-189) on May 14.

### What Does the New SB 26-189 Require?

SB 26-189 replaces the "high-risk AI system" language with a narrower concept: **Automated Decision-Making Technology (ADMT)** that "materially influences" a consequential decision. Insurance underwriting, pricing, and claims remain squarely inside that definition, but the new law narrows obligations, adds exemptions, and revises enforcement compared to its predecessor. It takes effect January 1, 2027 and applies to decisions made on or after that date — giving insurers a defined runway rather than the sudden compliance cliff SB 24-205 would have created.

### What Does SB 21-169's Algorithm Inventory Still Require?

Separately from the ADMT rewrite, SB 21-169 keeps three concrete obligations in force: a comprehensive inventory of every algorithm used in pricing, detailed enough for regulators to understand each model's logic and data inputs; systematic testing for discriminatory outcomes; and an annual compliance report documenting bias-testing results and any corrective action taken.

### Why Colorado Compliance Isn't a Single-State Problem

The infrastructure SB 21-169 requires — a model inventory, bias-testing pipeline, and documented corrective-action process — is largely the same infrastructure the NAIC Model Bulletin requires nationally. Insurers that build it once for Colorado can extend it to every NAIC-bulletin state as an incremental addition, not a second build from scratch.

## Why Are Insurers Failing Bias-Testing Requirements?

Adoption of AI has outpaced bias testing across the industry. A [2025 NAIC health insurance AI survey](https://content.naic.org/article/naic-survey-reveals-majority-health-insurers-embrace-ai) found that 92% of health insurers use or plan to use AI, alongside 88% of auto insurers, 70% of home insurers, and 58% of life insurers — but nearly one-third of health insurers don't regularly test their models for bias or discrimination.

### How Big Is the Adoption-vs-Testing Gap?

That gap between near-universal AI adoption and inconsistent bias testing is precisely the systemic risk regulators are now building examination tools to catch. High usage without matching testing discipline creates exposure regulators describe as a "black-box" risk — unfair outcomes that occur without the insurer even detecting them.

### How Does Proxy Discrimination Show Up in Insurance Models?

Regulators watch for three specific harm categories: unfair discrimination in pricing or underwriting, unfair claims practices, and misleading information provided to customers. Discrimination rarely comes from a model using race directly — it usually comes from proxy variables like zip codes or socioeconomic data that correlate strongly with protected classes, a pattern known as geographic redlining. A comparable pattern shows up in [model bias and variance behavior](/machine-learning/bias-variance-tradeoff-machine-learning-explained) more broadly: a model can perform well on aggregate accuracy while still producing systematically unfair outcomes for a subgroup the aggregate metric hides.

> **Common mistake:** Don't wait for a regulator's exam to discover a proxy-discrimination problem. Testing zip code, income proxy, and other correlated variables against protected-class outcomes before deployment is far cheaper than a corrective-action filing after the fact.

### How Should Insurers Test Before Regulators Do?

Insurers should run bias and discriminatory-outcome testing on every pricing and underwriting model using the same categories regulators test for: race-proxy variables, geographic redlining proxies, and socioeconomic proxies. Fraud-detection models deserve the same scrutiny — anomaly-detection systems built on techniques like [GANs and autoencoders](/deep-learning/gan-vs-autoencoder-anomaly-detection-guide) can flag legitimate claims from certain demographics at disproportionate rates if trained on unrepresentative historical data.

## How Do You Build an AI Governance Program That Satisfies Every Regulator?

A single AI governance program can satisfy the NAIC Model Bulletin, Colorado's statutes, and the EU AI Act if it's built around the strictest common denominator: a documented model inventory, mandatory pre-deployment bias testing, board-level accountability, and formal vendor oversight contracts.

### What Does the EU AI Act Require for Insurance Risk-Assessment AI?

The EU AI Act classifies insurance risk-assessment AI as high-risk, with compliance requirements taking effect in August 2026 and penalties reaching up to €35 million or 7% of worldwide annual revenue. Any US insurer or insurtech vendor operating in or selling into the EU needs this layer built alongside its domestic compliance program, not after it.

### What Business Value Is at Stake for Insurers That Get This Right?

According to [McKinsey](https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-ai-in-the-insurance-industry), AI could add up to $1.1 trillion in annual value to the global insurance industry — roughly $400 billion from pricing, underwriting, and promotion technology, and $300 billion from AI-powered customer service and personalization, with the rest from claims efficiency and fraud reduction. In some McKinsey-reviewed cases, quoting times dropped from several weeks to days.

That value only compounds for insurers whose governance programs keep models in production under regulatory scrutiny rather than forcing a pullback after an examination finding. According to Deloitte's 2026 Global Insurance Outlook, the gap here is mostly one of action, not awareness: 90% of insurance executives agree on the urgency of reinventing work around AI, but only 25% have taken tangible steps. The same discipline that keeps an insurance carrier's [CRM and policyholder data systems](https://sales.growthgear.com.au/crm-tools/best-crm-software-small-business-teams) audit-ready applies directly to AI model documentation — both are exam artifacts regulators expect on demand, not paperwork assembled after a request arrives.

### What Is the Five-Step Build Order?

Insurers building a governance program from scratch should follow this sequence: inventory every AI model touching pricing, underwriting, and claims; assign a named board-level sponsor for AI oversight; run bias and discrimination testing before any new model reaches production; formalize third-party vendor oversight contracts covering every insurtech vendor in the pipeline; and document every step to an exam-readiness standard. Insurers layering AI into [customer-facing marketing and personalization](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation) should route those tools through the same inventory — McKinsey's $300 billion personalization estimate assumes those models get the same governance treatment as pricing and underwriting, not an exemption because they sit in a different department. Insurers building this out as part of a broader technology roadmap can pair it with a [wider AI business strategy](https://sales.growthgear.com.au/b2b-sales/how-to-develop-business-development-strategy-plan) so compliance investment and growth investment move on the same timeline instead of competing for budget.

---

## Take the Next Step

AI compliance for insurance doesn't require waiting for every state and federal question to resolve before acting — Colorado's own law changed twice in six weeks, and the insurers already tracking the strictest requirements were the ones least affected by the rewrite. The practical path starts with a model inventory, extends to bias testing before deployment, and builds vendor oversight into procurement from day one.

GrowthGear has helped 50+ startups and growing businesses navigate AI implementation, including in regulated industries like insurance. Whether you're building your first AI Systems Program or preparing for Colorado's 2027 ADMT deadline, we can help you move from ad hoc AI use to a documented, defensible compliance program.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## AI Compliance for Insurance: Summary

| Framework | Applies To | Status | Action Required |
|---|---|---|---|
| **NAIC Model Bulletin** | Insurers in 25+ adopting states | Adopted; no enforcement actions through Q1 2026 | Written AI Systems Program with bias testing and vendor oversight |
| **Colorado SB 21-169** | Insurers licensed in Colorado | In effect | Algorithm inventory, bias testing, annual compliance report |
| **Colorado SB 26-189 (ADMT)** | Insurers licensed in Colorado | Signed May 14, 2026 | Effective January 1, 2027 |
| **EU AI Act** | Insurers operating in or selling into the EU | Compliance required Aug 2026 | High-risk classification controls for risk-assessment AI |

## FAQ

**What is AI compliance for insurance?**
AI compliance for insurance is the set of regulatory obligations — model governance, bias testing, and vendor oversight — that apply to insurers and insurtech vendors using AI in underwriting, pricing, claims, or marketing decisions.

**Which states have adopted the NAIC Model Bulletin on AI?**
By July 2026, 25 states had formally adopted the NAIC's Model Bulletin on the Use of AI Systems by Insurers, with 8 more in progress. California, Colorado, New York, and Texas run their own frameworks instead.

**What replaced Colorado's SB 24-205?**
A federal court paused SB 24-205's enforcement on April 27, 2026. Governor Polis then signed SB 26-189 on May 14, 2026, replacing it with a narrower Automated Decision-Making Technology framework effective January 1, 2027.

**Does Colorado's SB 21-169 still apply to insurers?**
Yes. SB 21-169 remains in effect and requires insurers to inventory every algorithm used in pricing, test for discriminatory outcomes, and file annual compliance reports with the state.

**How many insurers actually test their AI models for bias?**
According to a 2025 NAIC survey, 92% of health insurers use or plan to use AI, but nearly one-third don't regularly test their models for bias or discrimination.

**Does the EU AI Act apply to US insurers?**
Yes, if they operate in or sell into the EU. The Act classifies insurance risk-assessment AI as high-risk, with compliance required by August 2026 and penalties up to €35 million or 7% of global revenue.

**What should an insurer's AI governance program include?**
A documented model inventory, board-level accountability, mandatory pre-deployment bias testing, formal third-party vendor oversight, and exam-ready documentation — the common denominator across NAIC, Colorado, and EU requirements.

---

## Sources & References

1. [NAIC, Model Bulletin on the Use of Artificial Intelligence Systems by Insurers — State Adoption Map](https://content.naic.org/sites/default/files/cmte-h-big-data-artificial-intelligence-wg-map-ai-model-bulletin.pdf) — "25 states formally adopted by July 2026, 8 more in progress" (2026)
2. [NAIC, Members Approve Model Bulletin on Use of AI by Insurers](https://content.naic.org/article/naic-members-approve-model-bulletin-use-ai-insurers) — Commissioner Kathleen Birrane on balancing innovation with risk (2023)
3. [NAIC, Survey Reveals Majority of Health Insurers Embrace AI](https://content.naic.org/article/naic-survey-reveals-majority-health-insurers-embrace-ai) — "92% of health insurers use or plan to use AI; nearly one-third don't regularly test for bias" (2025)
4. [Colorado General Assembly, SB26-189 Automated Decision-Making Technology](https://leg.colorado.gov/bills/sb26-189) — Signed May 14, 2026, effective January 1, 2027, replacing SB 24-205 (2026)
5. [McKinsey, The Future of AI in the Insurance Industry](https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-ai-in-the-insurance-industry) — "$1.1 trillion in potential annual value across pricing, underwriting, claims, and fraud reduction" (2026)
6. [Deloitte, 2026 Global Insurance Outlook](https://www.deloitte.com/us/en/insights/industry/financial-services/financial-services-industry-outlooks/insurance-industry-outlook.html) — "90% of insurance executives see urgency to reinvent work around AI; 25% have acted" (2026)
7. [European Commission, EU AI Act Regulatory Framework](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) — High-risk classification for insurance risk-assessment AI, penalties up to €35M or 7% of global revenue (2026)
