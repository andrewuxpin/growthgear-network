---
title: "What Is a Data Pipeline? ETL, ELT and How It Works"
description: "Understand what a data pipeline is, how ETL and ELT differ, how modern data stack architecture works, and which pipeline tools best fit your team's needs."
category: "machine-learning"
author:
  name: "Abe Dearmer"
publishedAt: 2026-07-05
image:
  src: "/images/data-pipeline-explained-etl-elt-guide.webp"
  alt: "Data pipeline architecture showing ETL and ELT data flow with glowing nodes"
tags:
  - data-pipeline
  - etl
  - elt
  - data-engineering
  - machine-learning
faq:
  - question: "What is a data pipeline in simple terms?"
    answer: "A data pipeline is an automated system that moves raw data from source systems through transformation stages to a destination like a data warehouse or ML model, making it usable for analysis."
  - question: "What is the difference between ETL and ELT?"
    answer: "ETL transforms data before loading it to a destination. ELT loads raw data into a cloud data warehouse first, then transforms it there. ELT is preferred for cloud-native, large-scale architectures."
  - question: "What is a real-time data pipeline?"
    answer: "A real-time data pipeline processes data continuously as it arrives, delivering results within milliseconds to seconds. It uses streaming tools like Apache Kafka for fraud detection or live dashboards."
  - question: "What tools are used in a data pipeline?"
    answer: "Common pipeline tools include Fivetran or Airbyte (ingestion), Snowflake or BigQuery (storage), dbt (transformation), Apache Kafka (streaming), and Tableau or Looker (consumption)."
  - question: "How much does a data pipeline cost?"
    answer: "Startup data pipelines can cost $200–$2,000/month using open-source ingestion (Airbyte), pay-per-query storage (BigQuery), and dbt Cloud free tier. Enterprise stacks with Fivetran and Snowflake run higher."
  - question: "What is a batch data pipeline?"
    answer: "A batch data pipeline processes data in scheduled chunks — hourly, nightly, or weekly. It suits non-urgent workloads like overnight reports where real-time latency is not required."
  - question: "How do data pipelines work with machine learning?"
    answer: "Data pipelines supply cleaned, transformed data to ML models as training input and inference features. They enforce consistent feature engineering and automated retraining for production ML systems."
keyTakeaways:
  - "A data pipeline automates data flow from source systems to destinations — without one, raw data stays inaccessible to ML models and BI tools."
  - "ELT has replaced ETL as the standard for cloud-native architectures: load raw data first, then transform it inside Snowflake or BigQuery for far more flexibility."
  - "According to Gartner, poor data quality costs organizations an average of $12.9 million per year — a well-built pipeline is a direct ROI investment."
  - "Startup data pipeline costs range from $0 (open-source Airbyte + BigQuery free tier) to $2,000/month — far below the six-figure cost of legacy on-premises ETL infrastructure."
  - "The most common pipeline failure is schema drift — when source systems change column names or data types without warning, breaking downstream transformations."
callout:
  variant: "warning"
  title: "Don't Skip Data Quality Tests"
  content: "Most pipeline failures aren't caused by tooling — they're caused by upstream schema changes. Build data quality tests into every transformation layer from day one."
---

Most businesses generate far more data than they can use. CRM records, website events, payment transactions, and application logs all produce streams of raw information — but without a structured system to move, clean, and organize that data, it remains inaccessible to the analytics dashboards and machine learning models that create business value.

A data pipeline solves this problem. It's the infrastructure layer between raw data sources and the systems that consume them: BI reports, ML training datasets, operational applications, and executive dashboards.

This guide explains what data pipelines are, how ETL compares to modern ELT approaches, what a production pipeline architecture looks like, and how to choose the right tools for your scale. Understanding how data moves through your systems is the foundation for any serious [data science vs data analytics](/machine-learning/data-science-vs-data-analytics-guide) capability — and for building AI products that actually work.

## What Is a Data Pipeline?

A data pipeline is a series of automated processes that moves raw data from various source systems, transforms it into a structured format, and delivers it to a destination where it can be analyzed or consumed. It connects disparate data sources to the tools and models that extract business insights.

Without a data pipeline, every team accessing data must extract and clean it manually — a process that's slow, error-prone, and impossible to scale. According to Gartner, poor data quality costs organizations an average of $12.9 million per year. A well-engineered pipeline eliminates most of that cost by enforcing consistent data cleaning, validation, and delivery at every stage.

Data pipelines power nearly every modern data use case: training machine learning models, populating real-time dashboards, feeding product recommendation engines, and enabling [what is data engineering](/machine-learning/what-is-data-engineering-guide) workflows that keep raw data warehouse-ready.

### Key Components of a Data Pipeline

A typical data pipeline comprises five stages:

- **Data Sources** — The origin points of data, including transactional databases (PostgreSQL, MySQL), SaaS applications (Salesforce, HubSpot), event streams, IoT devices, and external APIs.
- **Ingestion** — Extracting data from sources and moving it to a staging area or storage layer via connectors, APIs, or dedicated ingestion tools like Fivetran or Airbyte.
- **Transformation** — Cleaning, structuring, enriching, and aggregating raw data into a format suitable for its intended use. This includes validation, deduplication, joining datasets, and applying business logic.
- **Storage** — The destination repository: a cloud data warehouse (Snowflake, BigQuery, Redshift), a data lake (AWS S3, Azure Data Lake), or a data lakehouse (Databricks) that combines both.
- **Consumption** — The final endpoint: BI dashboards (Tableau, Looker), machine learning models, operational applications, or reverse ETL tools that push data back into business systems.

### Batch vs Streaming Data Pipelines

Data pipelines process data in one of two modes:

**Batch processing** collects and processes data in chunks at scheduled intervals — hourly, nightly, or weekly. It's suited for workloads where immediate results aren't critical: monthly financial reporting, nightly inventory sync, or large-scale historical model training. Latency typically ranges from minutes to hours.

**Streaming processing** ingests and processes data continuously as it arrives, with latency measured in milliseconds to seconds. It's essential for fraud detection, real-time personalization, live analytics dashboards, and low-latency ML inference scenarios that require instant responsiveness.

The right mode depends on your business requirements for data freshness. Most mature architectures combine both: streaming for time-critical events, batch for large historical loads.

## ETL vs ELT: Understanding the Key Difference

The core distinction between ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform) is *when* transformation happens relative to loading data into the target system. This single timing difference drives entirely different architectures, tooling choices, cost structures, and flexibility trade-offs — and it's why most cloud-native teams have switched from ETL to ELT in the last five years.

**ETL** is the traditional approach, dominant before cloud data warehouses became mainstream. Data is extracted from sources, transformed on a dedicated ETL server into a clean, structured format, and then loaded into the target database. The destination only receives pre-processed data.

**ELT** is the modern cloud-native approach. Raw data is extracted from sources and loaded directly into a powerful cloud data warehouse. Transformation then happens *inside* the warehouse using its own compute resources — typically SQL-based tools like dbt (data build tool). The warehouse stores both raw and transformed versions of the data.

The shift to ELT is directly tied to cloud data warehouse adoption. Services like Snowflake, Google BigQuery, and Amazon Redshift provide elastic compute at a fraction of the cost of dedicated ETL infrastructure, making in-warehouse transformation far more economical and flexible.

| Feature | ETL (Extract, Transform, Load) | ELT (Extract, Load, Transform) |
|---|---|---|
| **Transformation timing** | Before loading to destination | After loading, inside the warehouse |
| **Raw data retention** | Often discarded after transform | Preserved; multiple transforms possible |
| **Compute location** | Dedicated ETL server (Informatica, SSIS) | Cloud data warehouse (Snowflake, BigQuery) |
| **Flexibility** | Schema defined upfront; hard to change | Schema-on-read; multiple use cases from same raw data |
| **Scalability** | Limited by ETL server capacity | Elastic cloud scaling |
| **Typical latency** | Higher — complex pre-load transform | Lower initial load; on-demand transformation |
| **Cost model** | High upfront infrastructure cost | Pay-for-compute; higher warehouse spend |
| **Best for** | Legacy on-prem, strict compliance | Cloud-native, large datasets, ML workloads |

### When ETL Is the Right Choice

ETL remains the better fit in three scenarios:

- **Legacy on-premises systems** where cloud migration isn't viable and the target warehouse has limited compute capacity
- **Strict compliance requirements** where data must be cleaned and validated before it reaches any storage system (HIPAA, GDPR, financial services regulations)
- **Well-defined, stable schemas** where upstream data structures never change and the transformation logic is fixed

### When ELT Makes More Sense

ELT is the correct default for most modern data architectures:

- **Cloud-native environments** — BigQuery, Snowflake, and Redshift have the compute to handle transformation at scale without a separate ETL server
- **Large or diverse datasets** — Loading raw data first allows schema-on-read flexibility; you can add new transformations without re-ingesting data
- **Machine learning workloads** — ML models often require access to raw feature data for [feature engineering in machine learning](/machine-learning/what-is-feature-engineering-in-machine-learning); ELT preserves full data fidelity
- **Agile analytics teams** — Data analysts can write new SQL transformations in dbt without waiting for ETL pipeline changes from engineering

> **Ready to build your data pipeline?** GrowthGear has helped 50+ startups architect data infrastructure that feeds ML models and BI dashboards reliably. [Book a Free Strategy Session](https://growthgear.com.au) to map out your data stack.

## How a Modern Data Pipeline Architecture Works

A modern data pipeline is a layered, cloud-first system designed to ingest raw data quickly into a central repository, then transform it for multiple consumption patterns. It prioritizes modularity — each layer can be swapped independently — and uses managed services to minimize operational overhead.

Tristan Handy, Founder and CEO of [dbt Labs](https://docs.getdbt.com/docs/introduction), has written that the goal of the modern data stack is to let data teams focus on creating value from data rather than managing infrastructure — a design principle that separates modular cloud-native pipelines from the monolithic ETL systems that required specialized engineers to maintain.

The four layers of a modern data pipeline:

| Stage | Tool Examples | Purpose |
|---|---|---|
| **Sources** | Salesforce, PostgreSQL, Shopify, webhooks, IoT sensors | Origin of raw business and operational data |
| **Ingestion** | Fivetran, Airbyte, Stitch, Apache Kafka, AWS Kinesis | Extract from sources; load into storage (often raw, unmodified) |
| **Storage** | Snowflake, Google BigQuery, Amazon Redshift, Databricks, AWS S3 | Central repository for raw and modeled data; scalable and queryable |
| **Transformation** | dbt, Spark (Databricks), in-warehouse SQL | Clean, model, enrich, and aggregate data into consumption-ready tables |
| **Consumption** | Tableau, Looker, Power BI, Jupyter notebooks, ML models, Hightouch | Visualize, analyze, or feed back into operational systems |

### Real-Time vs Batch Architecture

Modern pipelines often combine streaming and batch layers in a **Lambda architecture** or the newer **Kappa architecture**:

- **Lambda** maintains separate batch and streaming paths, joining results at the consumption layer. It's reliable but operationally complex.
- **Kappa** uses a single streaming path (typically [Apache Kafka](https://kafka.apache.org/documentation/)) for all data, replaying historical data as needed. It's simpler to maintain but requires mature streaming infrastructure.

For most startups and mid-market companies, a managed batch pipeline (Fivetran → Snowflake → dbt) covers 90% of use cases. Real-time streaming adds complexity and cost that only makes sense for specific latency-sensitive applications.

### The Modern Data Stack and What Changed Post-2018

Before cloud data warehouses became affordable (roughly 2018–2020), data pipelines required significant on-premises infrastructure and specialist ETL engineers. The modern data stack emerged as cloud compute costs dropped:

- **Ingestion** became a commodity (Fivetran launched 2012; Airbyte open-sourced in 2020)
- **Storage** shifted to elastic cloud warehouses billed per query or storage rather than per server
- **Transformation** moved to SQL-based tools (dbt launched 2016) that data analysts could own without engineering support

This shift cut data pipeline build time from months to weeks. For analytics and [training machine learning models](/machine-learning/how-to-train-machine-learning-models-beginners), having clean, consistently transformed data available in hours rather than days is the difference between iterating quickly and being blocked.

## How to Choose the Right Data Pipeline for Your Business

The right data pipeline architecture depends on four factors: data volume, latency requirements, team skills, and budget. Startups can build a functional batch pipeline for near-zero cost using open-source tools; mid-market teams benefit most from managed connectors like Fivetran paired with Snowflake; enterprises with real-time needs require Kafka-based streaming infrastructure.

**Startup (< 1TB/month, batch is fine)**
- Stack: Airbyte (open-source, self-hosted) → Google BigQuery → dbt Cloud (free tier) → Looker Studio
- Cost: $0–$500/month for most early-stage use cases
- Best for: Product analytics, CRM sync, basic ML feature stores
- Trade-off: Self-managed Airbyte requires engineering time; Fivetran is more reliable but costs $500+/month

**Mid-market (1TB–100TB/month, mixed batch + streaming)**
- Stack: Fivetran → Snowflake → dbt Cloud → Tableau or Looker
- Cost: $2,000–$15,000/month depending on data volume
- Best for: Multi-source operational analytics, predictive models, real-time [marketing attribution modeling](https://marketing.growthgear.com.au/seo/what-is-marketing-attribution-modeling-explained)
- Trade-off: Fivetran costs scale with monthly active rows; forecast usage carefully

**Enterprise (> 100TB/month, real-time required)**
- Stack: Apache Kafka → Databricks → dbt + Spark → Databricks MLflow + custom BI
- Cost: $20,000–$200,000+/month
- Best for: Fraud detection, real-time personalization, large-scale ML model pipelines
- Trade-off: Requires dedicated data engineering team to operate Kafka and Databricks

### Build vs Buy: The Right Decision Framework

Most teams should **buy** (use managed SaaS tools) rather than **build** custom pipelines until they hit a clear limitation:

- **Buy first** if your data sources are standard (CRM, database, ad platforms) — Fivetran and Airbyte cover 300+ connectors
- **Build** when you have proprietary data sources, sub-second latency requirements, or cost constraints at very large scale

> **Common mistake:** Teams often start with custom-built ingestion scripts because they seem simple. Within 6 months, these scripts become unmaintained, break on schema changes, and block the analytics team. Managed connectors pay for themselves in engineering time saved.

### Common Data Pipeline Mistakes to Avoid

- **Skipping data quality tests** — Schema changes in source systems (a Salesforce field renamed, a column added) break downstream transforms silently. dbt's built-in testing framework catches these automatically.
- **Over-engineering streaming** — Most business analytics doesn't need millisecond latency. Batch pipelines running hourly are simpler, cheaper, and cover 90% of use cases.
- **Not tracking lineage** — Knowing which dashboards break when an upstream table changes is critical. Tools like dbt's DAG view and [Google Cloud Dataflow](https://cloud.google.com/dataflow/docs/overview) provide lineage tracking natively.
- **Storing too little raw data** — ELT's biggest advantage is that you keep raw data forever. Organizations that transform-and-discard raw data lose the ability to reprocess historical records when business logic changes.

For data-driven businesses, a reliable pipeline is as foundational as a CRM — it's what makes [business development strategies](https://sales.growthgear.com.au/b2b-sales/how-to-develop-business-development-strategy-plan) plannable with real numbers rather than gut feel.

## Top Data Pipeline Tools Compared

No single tool handles every pipeline stage — the market segments by function, and most teams assemble a stack across ingestion, storage, transformation, and consumption layers. The right combination depends on your cloud provider, data volume, team's SQL or Python preference, and whether you prioritize zero-maintenance managed connectors or cost-effective open-source flexibility.

### Ingestion Tools

| Tool | Best For | Pricing Model | Strengths | Weaknesses |
|---|---|---|---|---|
| **Fivetran** | Teams needing zero-maintenance connectors | Monthly Active Rows (MAR) | 300+ connectors, automatic schema updates, SOC 2 | Cost scales fast at high volume; vendor lock-in |
| **Airbyte** | Cost-sensitive teams with engineering capacity | Open-source free; Cloud $15/connector | 350+ connectors, fully customizable, self-hosted option | Requires ops to run self-hosted; UI less polished |
| **Apache Kafka** | High-throughput real-time streaming | Open-source; Confluent Cloud per-CU | Handles millions of events/second; battle-tested | Complex to operate; overkill for batch-only needs |
| **AWS Glue** | AWS-native shops running Spark | Pay-per-DPU-hour | Deep AWS integration, serverless | AWS-specific; Spark learning curve |

### Storage and Transformation Tools

| Tool | Type | Best For | Pricing |
|---|---|---|---|
| **Snowflake** | Cloud data warehouse | Multi-cloud enterprises, SQL analytics | Credits per compute-second + storage |
| **Google BigQuery** | Cloud data warehouse | Google Cloud users, ad-hoc analytics | Pay-per-query or flat-rate |
| **Databricks** | Data lakehouse | ML-heavy workloads, Python/Spark teams | DBU credits per cluster-hour |
| **dbt Cloud** | Transformation layer | SQL-based transform, testing, lineage | Free tier + $50/seat/month |
| **Amazon Redshift** | Cloud data warehouse | AWS shops with heavy BI workloads | Reserved or on-demand instances |

### What Business Users Are Saying

Data and analytics leaders consistently report that the Fivetran + Snowflake + dbt combination reduces pipeline build time from months to 2-4 weeks for standard data sources. The main friction point is cost: Fivetran's pricing based on monthly active rows can surprise teams when data volumes grow quickly, sometimes tripling costs within a quarter.

Teams that choose Airbyte for cost control report higher engineering overhead — connector maintenance and schema-change debugging adds hours that managed tools absorb automatically. At startup scale, that trade-off is worthwhile. At mid-market scale, most teams switch to managed connectors to reclaim engineering time for product work.

For analytics platforms that directly feed into [AI tools for data analysis](/machine-learning/best-ai-tools-for-data-analysis) or [Google Analytics 4 implementations](https://marketing.growthgear.com.au/seo/how-to-set-up-google-analytics-4-guide), having a reliable, tested pipeline upstream makes the difference between dashboards teams trust and dashboards they ignore.

---

## Data Pipeline Summary: Choosing Your Stack

| Pipeline Type | Best Use Case | Example Stack | Complexity | Est. Monthly Cost |
|---|---|---|---|---|
| **Batch (startup)** | Product analytics, CRM sync | Airbyte → BigQuery → dbt | Low | $0–$500 |
| **Batch (mid-market)** | Multi-source analytics, reporting | Fivetran → Snowflake → dbt → Tableau | Medium | $2,000–$10,000 |
| **Streaming (real-time)** | Fraud detection, live dashboards | Kafka → Databricks → dbt → Looker | High | $5,000–$50,000 |
| **Lakehouse** | ML training, raw data exploration | Airbyte → Databricks → MLflow | High | $3,000–$30,000 |
| **Legacy ETL** | Compliance-heavy, on-prem data | Informatica / Talend → on-prem warehouse | Very High | $10,000+ |

---

## Take the Next Step

Building a data pipeline doesn't have to mean months of custom engineering. Whether you're connecting your first data sources or re-architecting a brittle legacy ETL system, GrowthGear can map the right stack for your team size, data volume, and ML goals — and help you avoid the schema drift and cost surprises that derail most pipeline projects.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Sources & References

1. [Gartner — Data Quality Market Survey](https://www.gartner.com/en/information-technology/glossary/data-integration-tools) — "Poor data quality costs organizations an average of $12.9 million per year" (2022)
2. [Apache Kafka Documentation](https://kafka.apache.org/documentation/) — Core streaming platform documentation covering partition, consumer group, and throughput architecture (2024)
3. [Google Cloud Dataflow Overview](https://cloud.google.com/dataflow/docs/overview) — Fully managed stream and batch data processing service with lineage tracking (2024)
4. [Databricks — ETL Pipeline Glossary](https://www.databricks.com/glossary/etl-pipeline) — Definition and architectural comparison of ETL vs ELT in cloud data lakehouse environments (2024)
5. [dbt Labs — Introduction to dbt](https://docs.getdbt.com/docs/introduction) — SQL-first transformation framework documentation covering testing, lineage, and modern data stack integration (2024)
