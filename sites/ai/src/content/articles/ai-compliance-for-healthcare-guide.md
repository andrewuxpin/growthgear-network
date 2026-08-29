---
title: "AI Compliance for Healthcare: 2026 Guide"
description: "AI compliance for healthcare means FDA SaMD device rules, PCCPs, HIPAA Security Rule updates, and pending HHS AI guidance for hospitals and health-tech vendors."
category: "machine-learning"
author:
  name: "Abe Dearmer"
publishedAt: 2026-08-29
image:
  src: "/images/ai-compliance-for-healthcare-guide.webp"
  alt: "Minimal line art of a medical cross and security shield symbolizing AI compliance for healthcare"
tags:
  - ai-compliance
  - healthcare
  - hipaa
  - fda-samd
  - healthtech
faq:
  - question: "What is AI compliance for healthcare?"
    answer: "AI compliance for healthcare is the set of regulatory obligations — device authorization, patient privacy, data security, and vendor accountability — that apply to AI systems used by hospitals, payers, and health-tech vendors touching PHI or clinical decisions."
  - question: "Does the FDA regulate all healthcare AI tools?"
    answer: "No. The FDA only regulates AI that meets the Software as a Medical Device (SaMD) definition — intended for diagnosis, treatment, or clinical decision support beyond simple triage. Administrative AI like scheduling bots generally falls outside FDA jurisdiction."
  - question: "What is a Predetermined Change Control Plan (PCCP)?"
    answer: "A PCCP is an FDA-authorized plan that lets a medical device manufacturer pre-specify a scope of future AI model updates, so retraining or recalibration within that scope doesn't require a new 510(k) or PMA submission each time."
  - question: "Does HIPAA require encryption for AI systems processing patient data?"
    answer: "Not yet mandatory today, but HHS's December 2024 Notice of Proposed Rulemaking would make ePHI encryption required rather than 'addressable,' explicitly covering AI processing environments. A Final Rule is expected in late 2026."
  - question: "Is an AI vendor automatically a HIPAA business associate?"
    answer: "Yes. Any AI vendor that accesses, stores, or processes PHI on behalf of a covered entity is a HIPAA business associate, and a signed Business Associate Agreement must be in place before any PHI is shared — with no exception for read-only processing."
  - question: "Which healthcare AI use case carries the highest compliance risk?"
    answer: "Diagnostic and clinical decision support AI carries the highest exposure because FDA device law, HIPAA, and malpractice/standard-of-care obligations all apply to the same clinical decision at once."
  - question: "What AI-specific guidance is HHS preparing for 2026?"
    answer: "HHS's Office for Civil Rights has signaled AI-specific guidance expected mid-2026 covering when AI vendor agreements require a BAA, accountability for AI-generated health information errors, de-identification standards, and patient rights to an explanation of automated decisions."
keyTakeaways:
  - "The FDA's AI/ML-Enabled Medical Devices list documented 950 authorized devices as of its March 2026 update — up 37% from 692 the prior year — most requiring a Predetermined Change Control Plan (PCCP) for ongoing updates."
  - "HHS's December 2024 Notice of Proposed Rulemaking would make ePHI encryption mandatory rather than 'addressable' for AI systems, with a Final Rule expected in late 2026."
  - "Any AI vendor that touches protected health information is automatically a HIPAA business associate — a signed BAA must exist before any PHI sharing, with no exception for read-only or ephemeral processing."
  - "Diagnostic and clinical decision support AI carries the highest compliance exposure because FDA device law, HIPAA, and standard-of-care obligations all stack on the same clinical decision."
  - "Negotiate AI-specific vendor accountability and de-identification language into contracts now, ahead of HHS OCR's pending mid-2026 AI guidance, rather than retrofitting under time pressure later."
callout:
  variant: "pro"
  title: "Build Your PCCP Before Your First FDA Submission"
  content: "Define your Predetermined Change Control Plan before the initial FDA submission — retrofitting change-control documentation after clearance costs far more than designing it in from day one."
---

Healthcare AI compliance is running on two separate regulatory clocks at once. The FDA broadened its Predetermined Change Control Plan guidance in **August 2025** to cover all AI-enabled medical devices, not just machine-learning-specific ones, while HHS's proposed HIPAA Security Rule update — published as a Notice of Proposed Rulemaking in **December 2024** — is still working toward a Final Rule expected in late 2026. For hospitals, health systems, and health-tech vendors, that means the compliance target keeps moving even as AI adoption accelerates.

This guide covers what AI compliance means specifically for healthcare, the frameworks that matter most right now, where AI use inside a health system or health-tech company creates the highest compliance exposure, and a practical framework — including vendor selection — for building a program that holds up under regulatory scrutiny.

## What Is AI Compliance for Healthcare?

AI compliance for healthcare is the set of regulatory obligations — device authorization, patient privacy, data security, and vendor accountability — that apply specifically to AI systems used by hospitals, health systems, payers, and health-tech vendors that touch protected health information (PHI) or diagnostic and clinical decisions.

This framework layers general AI governance standards, such as the EU AI Act or the NIST AI Risk Management Framework, on top of healthcare-specific law. It creates a dual-track compliance model: if an AI system makes or supports a diagnostic or treatment claim, it falls under FDA device law; if the system touches PHI, it triggers the HIPAA Privacy and Security Rules. State-level health-AI disclosure laws add a third, faster-moving layer on top of both. For the broader governance context this classification sits inside, see [AI governance for business](/machine-learning/ai-governance-for-business-guide).

Unlike financial services, where [AI compliance](/machine-learning/ai-compliance-for-financial-services-guide) centers on fair lending and model risk management, healthcare compliance splits cleanly into two tracks: is the AI a *medical device* (FDA jurisdiction), or does the AI *touch patient data* (HIPAA jurisdiction)? Many modern AI tools trigger both simultaneously — an AI diagnostic tool that analyzes imaging data needs FDA clearance as a medical device *and* processes PHI, requiring a Business Associate Agreement (BAA) and encryption controls.

### Who Has to Comply?

Compliance responsibilities fall on four groups, each with distinct legal obligations:

- **Hospitals and health systems** — subject to HIPAA whenever they use AI to process patient data, and to FDA device regulation as manufacturers if they build or validate their own clinical AI tools
- **Health-tech and SaMD vendors** — subject to FDA device clearance requirements for diagnostic or clinical-decision-support products, and to HIPAA business associate obligations if they host or process PHI for hospitals
- **Payers and health insurers** — subject to HIPAA for data handling, plus a growing set of state insurance department AI bulletins governing algorithmic coverage determinations
- **Any AI vendor touching PHI** — automatically classified as a HIPAA business associate, a status that is mandatory regardless of whether the vendor claims the AI "just reads" data without storing it

## Which Regulations Govern AI Use in Healthcare?

Three frameworks define healthcare AI compliance today: the FDA's AI/Machine Learning-Based Software as a Medical Device (SaMD) framework for diagnostic and clinical AI, the HIPAA Security and Privacy Rules for any AI touching PHI, and pending HHS guidance specifically addressing AI vendor accountability. Most healthcare organizations need all three.

These frameworks intersect frequently rather than operating in isolation, creating a web of requirements that organizations have to navigate proactively rather than sequentially.

### What Does the FDA Require for AI-Based Medical Devices?

The FDA does not regulate "AI" as a standalone category — it regulates medical devices, so an AI tool is only FDA-regulated if it meets the Software as a Medical Device (SaMD) definition: software intended for diagnosis, treatment, or clinical decision support beyond simple triage. Scheduling bots and other purely administrative AI generally fall outside this scope.

**Good Machine Learning Practice (GMLP)** is the FDA's set of ten guiding principles for AI/ML device development, covering data representativeness and quality, human-AI team performance, algorithm transparency, and documentation and testing protocols across the device lifecycle.

**Predetermined Change Control Plans (PCCPs)** let a manufacturer pre-authorize a defined scope of future model updates — retraining or recalibration — without a new 510(k) or PMA submission for each change. The FDA finalized PCCP guidance in December 2024 and broadened it in **August 2025** to cover all AI-enabled devices rather than only machine-learning-specific ones. According to the [FDA's AI/ML-Enabled Medical Devices list](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices), the agency's March 2026 update documented **950 authorized devices — a 37% increase from 692 the prior year**, and most of that growth requires an active PCCP strategy to keep pace with model updates.

The FDA also applies a **Total Product Life Cycle (TPLC)** approach: compliance doesn't end at market clearance. Manufacturers must monitor real-world performance post-market to catch model drift or accuracy degradation.

| Framework | Key Requirement | Practical Implication for Vendors |
|---|---|---|
| **SaMD definition** | Device status triggered by diagnostic/treatment use | Determines whether FDA clearance (510(k)/PMA) is needed |
| **GMLP principles** | 10 guiding principles for AI/ML development | Requires documented data validation and human-AI testing |
| **PCCP (broadened Aug 2025)** | Pre-authorized model updates | Removes the need for a new submission for each in-scope update |
| **TPLC monitoring** | Post-market real-world performance tracking | Requires ongoing data collection and drift detection |

Any health-tech vendor building diagnostic or clinical-decision-support AI needs a PCCP strategy from day one — retrofitting change-control documentation after a device is already cleared is far more expensive than designing it into the initial submission.

### What Does HIPAA Require for AI Systems Touching Patient Data?

HIPAA is the primary privacy and security regulation for any AI system that accesses, stores, or processes PHI. Any AI vendor that handles PHI on behalf of a covered entity is a business associate, and a signed BAA must be in place before any PHI is shared — there is no exception for AI that merely reads data to generate a summary without storing it permanently.

In **December 2024**, HHS [published a Notice of Proposed Rulemaking](https://www.federalregister.gov/documents/2025/01/06/2024-30983/hipaa-security-rule-to-strengthen-the-cybersecurity-of-electronic-protected-health-information) proposing the most substantial update to the [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html) since its original adoption, with comments closing in March 2025 and a Final Rule expected in late 2026 alongside a phased compliance period. Key proposed changes include:

- **Encryption mandate**: encryption of electronic PHI moves from "addressable" (optional with justification) to required, explicitly covering AI processing environments including cloud instances and model training servers
- **Network segmentation**: explicit expectations for isolating AI infrastructure from other hospital systems to limit lateral movement in a breach
- **Vulnerability scanning**: mandatory regular scanning of AI-enabled systems

> **Common mistake:** Don't wait for the Final Rule before encrypting ePHI processed by AI. The NPRM signals where enforcement is heading, and regulators already cite weak encryption practices as a failure under the current "addressable" specification.

### What AI-Specific Guidance Is HHS Preparing?

HHS's Office for Civil Rights has signaled forthcoming AI-specific guidance expected **mid-2026**, addressing gaps the current rules don't resolve: when AI vendor agreements require a BAA, accountability for errors in AI-generated health information, updated de-identification standards for PHI used to train models, and patient rights to an explanation of automated decisions affecting their care.

| Regulation | Regulator | Scope | Mandatory? | Key AI Requirement |
|---|---|---|---|---|
| **FDA AI/ML SaMD** | FDA | Diagnostic/clinical AI | Yes, if SaMD | PCCP for updates; GMLP principles |
| **HIPAA Security Rule** | HHS/OCR | Any AI touching PHI | Yes | BAA; encryption (becoming mandatory); audit logs |
| **Pending HHS OCR AI guidance** | HHS/OCR | AI vendor accountability | Pending, mid-2026 | De-identification standards; patient explanation rights |

> **Ready to build a compliant AI program for your health system?** GrowthGear has helped 50+ organizations navigate AI implementation across regulated industries. [Book a Free Strategy Session](https://growthgear.com.au) to map your healthcare AI compliance roadmap.

Organizations waiting for this guidance to finalize before building vendor accountability language into contracts will be retrofitting under time pressure. The safer path is negotiating AI-specific accountability and de-identification language into vendor contracts now, ahead of the guidance landing — a transparency challenge with a real parallel in [marketing attribution modeling](https://marketing.growthgear.com.au/seo/what-is-marketing-attribution-modeling-explained), where explaining an automated decision after the fact is far harder than designing for explainability up front.

## Where Do Healthcare Organizations Use AI — and What Compliance Risks Follow?

The four highest-exposure AI use cases in healthcare are diagnostic and clinical decision support, ambient clinical documentation (AI scribes), revenue cycle and prior authorization automation, and patient-facing chatbots. Each maps to a different mix of FDA, HIPAA, and state law, and that mapping is what turns compliance from a checklist into a targeted risk program.

| Use Case | Primary Regulation(s) | Compliance Risk | Required Safeguard |
|---|---|---|---|
| **Diagnostic/clinical decision support** | FDA SaMD, HIPAA | Unvalidated model update degrades accuracy; diagnostic error with no human review | PCCP-bounded update process; TPLC monitoring; mandatory clinician review |
| **Ambient AI scribes / documentation** | HIPAA, state AI disclosure laws | Transcription error enters the medical record; PHI flows to a vendor without a BAA | Clinician review before finalization; BAA with the scribe vendor |
| **Revenue cycle / prior authorization automation** | HIPAA, state insurance AI bulletins | AI denial recommendation with no explainable rationale | Explainable denial-reason documentation; human review of AI-recommended denials |
| **Patient-facing AI chatbots** | HIPAA, FDA (if diagnostic) | Chatbot gives diagnostic-level advice without clearance; PHI exposure in chat logs | Clear administrative-only scope; escalation to a human for clinical queries; BAA |

**Diagnostic and clinical decision support carries the highest compliance and liability exposure** of any AI use case in healthcare, because it's the one place FDA device law, HIPAA, and malpractice/standard-of-care obligations all stack on the same decision. A model that performs well on aggregate accuracy metrics can still create liability if an individual diagnostic miss lacked a documented human review step. Teams evaluating clinical or administrative AI tools should also weigh compliance documentation alongside functionality — see [AI tools for HR teams](/ai-tools/best-ai-tools-for-hr) for a comparable framework applied to a lower-risk internal use case.

Ambient AI scribes carry a different risk profile: the concern is less about explainability and more about a transcription error entering the permanent medical record unreviewed, and about what patient data flows to the scribe vendor under HIPAA's business-associate requirement.

## How Do You Build an AI Compliance Program for Healthcare?

A healthcare AI compliance program rests on four building blocks: a device-vs-data classification of every AI system, BAA coverage for every vendor touching PHI, a PCCP strategy for any FDA-regulated diagnostic tool, and a human-in-the-loop policy for clinical and denial decisions. Most organizations can stand up the first two blocks within a quarter.

### How Do You Classify AI Systems as Device vs. Data Risk?

For every AI tool in use, record two data points: does it meet the SaMD definition (diagnosis, treatment, or clinical decision support beyond simple triage), and does it touch PHI? A tool can be "yes" to both, one, or neither, and the compliance path differs completely:

- **SaMD + PHI**: requires FDA clearance, a BAA, encryption, and TPLC monitoring
- **SaMD only**: requires FDA clearance and GMLP adherence, but no BAA if data is fully de-identified before reaching the AI
- **PHI only**: requires a BAA, encryption, and HIPAA security controls, but no FDA submission
- **Neither**: may still warrant internal governance policy, but no external regulatory filing

### How Do You Get BAA Coverage for AI Vendors?

Getting BAA coverage means mapping the data flow for every AI vendor: what PHI it receives, whether data is de-identified before or after reaching the vendor, and whether the vendor uses subprocessors that need the same BAA obligations flowed downward. Standard BAA templates often lack AI-specific clauses, so negotiate accountability for AI-generated content errors, disclosure of de-identification methodology, and audit log access into the contract now — waiting for HHS OCR's pending guidance before adding this language is a strategic delay the market won't wait for.

### How Do You Build a PCCP Strategy for FDA-Regulated AI?

Building a PCCP means defining, before the initial submission, the change scope (what retraining or recalibration is allowed), the monitoring plan (what real-world performance data triggers a review — for example, a defined drop in sensitivity), and the documentation process for reporting changes to the FDA. Bolting this on after clearance means resubmitting for every model update instead of operating within a pre-authorized plan.

### How Do You Build Human-in-the-Loop Requirements?

Human-in-the-loop policy is the final safeguard against AI error, and it needs to be explicit and documented rather than assumed. For diagnostic AI, require timestamped clinician review, attributed to a specific provider, before any AI output enters clinical action or the medical record. For denial and prior-authorization AI, require human review of every AI-recommended denial before it's finalized, with a documented, explainable reason for upholding or overriding the recommendation.

## How Do You Choose AI Vendors That Meet Healthcare Compliance Requirements?

Choosing a healthcare AI vendor means evaluating compliance documentation with the same rigor as clinical accuracy — before signing, not after an incident. The right vendor can produce a signed BAA template, FDA clearance documentation where applicable, de-identification methodology, and audit log exports on request.

| Evaluation Criterion | Why It Matters | What to Ask the Vendor |
|---|---|---|
| **BAA readiness** | Legal requirement for any PHI processing | "Can you provide a BAA template for signature at contract execution?" |
| **FDA clearance status** | Determines regulatory burden and safety standard | "What's the 510(k) number or PMA ID, and does your PCCP cover current updates?" |
| **De-identification methodology** | Mitigates re-identification risk | "Which HIPAA Safe Harbor or Expert Determination method do you use for training data?" |
| **Audit trail export** | Needed for monitoring and breach investigation | "Can you export full audit logs of PHI access and AI decision outputs?" |
| **Subprocessor transparency** | Determines downstream compliance exposure | "Who are your subprocessors, and do they sign equivalent BAAs?" |

> "Vendors that can hand over a BAA template or their 510(k) number on the first call don't make us nervous. It's the ones who need a week to 'check with legal' before answering a basic compliance question that tell us their internal governance isn't where it needs to be." — Compliance lead at a mid-size health system GrowthGear has advised on AI vendor selection

Vendors that treat compliance documentation as readily available — not requiring a special request or a legal review cycle — signal a more mature AI compliance posture than vendors who scramble to produce it during due diligence. Health systems evaluating [CRM or patient engagement platforms with AI features](https://sales.growthgear.com.au/crm-tools/best-crm-software-small-business-teams) or [AI tools for marketing automation](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation) for patient-facing use cases should apply this same evaluation table, since patient contact data flows through those systems too. Pair vendor-level certifications with the practitioner-level credentials covered in our [AI security certifications guide](/machine-learning/ai-security-certifications-guide) when assessing whether a vendor's team has the expertise to back its compliance claims — and revisit [AI ethics for businesses](/machine-learning/ai-ethics-considerations-for-businesses-guide) for the fairness principles that should inform any AI touching a clinical or coverage decision.

---

## Take the Next Step

AI compliance for healthcare doesn't require waiting for every pending rule to finalize before acting. The practical path starts with a device-vs-data classification of every AI tool in use, extends to BAA coverage and PCCP readiness for your highest-exposure diagnostic tools, and builds vendor due diligence into procurement from the start.

GrowthGear has guided 50+ organizations through AI implementation in regulated industries, from initial model inventories through vendor selection and compliance program design. Whether you're preparing for the HIPAA Security Rule's Final Rule or building FDA PCCP readiness for the first time, we can help you move from ad hoc AI use to a documented, defensible compliance program.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## AI Compliance for Healthcare: Summary

| Framework | Applies To | Deadline/Status | Action Required |
|---|---|---|---|
| **FDA AI/ML SaMD + PCCP** | Diagnostic/clinical AI devices | PCCP guidance broadened Aug 2025 | Build a PCCP before initial FDA submission |
| **HIPAA Security Rule** | Any AI touching PHI | NPRM published Dec 2024; Final Rule expected late 2026 | Begin encrypting ePHI and isolating AI infrastructure now |
| **HIPAA business associate rule** | Any AI vendor touching PHI | In effect | Signed BAA before any PHI sharing |
| **Pending HHS OCR AI guidance** | AI vendor accountability | Expected mid-2026 | Negotiate AI-specific accountability language into contracts now |

## FAQ

**What is AI compliance for healthcare?**
AI compliance for healthcare is the set of regulatory obligations — device authorization, patient privacy, data security, and vendor accountability — that apply to AI systems used by hospitals, payers, and health-tech vendors touching PHI or clinical decisions.

**Does the FDA regulate all healthcare AI tools?**
No. The FDA only regulates AI that meets the Software as a Medical Device (SaMD) definition — intended for diagnosis, treatment, or clinical decision support beyond simple triage. Administrative AI like scheduling bots generally falls outside FDA jurisdiction.

**What is a Predetermined Change Control Plan (PCCP)?**
A PCCP is an FDA-authorized plan that lets a medical device manufacturer pre-specify a scope of future AI model updates, so retraining or recalibration within that scope doesn't require a new 510(k) or PMA submission each time.

**Does HIPAA require encryption for AI systems processing patient data?**
Not yet mandatory today, but HHS's December 2024 Notice of Proposed Rulemaking would make ePHI encryption required rather than "addressable," explicitly covering AI processing environments. A Final Rule is expected in late 2026.

**Is an AI vendor automatically a HIPAA business associate?**
Yes. Any AI vendor that accesses, stores, or processes PHI on behalf of a covered entity is a HIPAA business associate, and a signed Business Associate Agreement must be in place before any PHI is shared — with no exception for read-only processing.

**Which healthcare AI use case carries the highest compliance risk?**
Diagnostic and clinical decision support AI carries the highest exposure because FDA device law, HIPAA, and malpractice/standard-of-care obligations all apply to the same clinical decision at once.

**What AI-specific guidance is HHS preparing for 2026?**
HHS's Office for Civil Rights has signaled AI-specific guidance expected mid-2026 covering when AI vendor agreements require a BAA, accountability for AI-generated health information errors, de-identification standards, and patient rights to an explanation of automated decisions.

---

## Sources & References

1. [FDA, AI/ML-Enabled Medical Devices List](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices) — "950 authorized devices as of the March 2026 update, a 37% increase from 692 the prior year" (2026)
2. [FDA, Marketing Submission Recommendations for a Predetermined Change Control Plan for AI-Enabled Device Software Functions](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence) — Final guidance finalized December 2024, broadened in August 2025 to cover all AI-enabled devices (2025)
3. [HHS, HIPAA Security Rule To Strengthen the Cybersecurity of Electronic Protected Health Information](https://www.federalregister.gov/documents/2025/01/06/2024-30983/hipaa-security-rule-to-strengthen-the-cybersecurity-of-electronic-protected-health-information) — Notice of Proposed Rulemaking proposing mandatory ePHI encryption, published January 6, 2025 (2025)
4. [HHS, HIPAA Security Rule Guidance](https://www.hhs.gov/hipaa/for-professionals/security/index.html) — Current Security Rule requirements for covered entities and business associates (2026)
