
## 1. Purpose

CleverDocs is an AI-powered onboarding and knowledge-sharing platform that accelerates new-hire ramp-up and empowers engineers to formalize and distribute institutional knowledge as polished, multi-level tech blogs and custom guides.

## 2. Problem Statement

- **Onboarding friction:** New engineers struggle to find consistent, up‑to‑date documentation and lose days context‑switching among outdated wikis, internal threads, and scattered notes. 
- **Knowledge hoarding:** Senior contributors accumulate years of quick‑jot notes but lack an efficient way to structure and publish their insights to help share their knowledge. 
- **Tutorial overload:** Learners bounce among official docs, community tutorials, and repos  without a clear path or level of depth.

## 3. Objectives

1. **Rapid blog generation:** Transform raw notes into well-structured, accurate, and typo‑free tech blogs in under 5 minutes.
2. **Dynamic expertise slider:** Offer on‑demand Beginner, Intermediate, and Expert variants of each blog.
3. **Custom guide builder:** Assemble topic‑specific blogs into streamlined, use‑case–tailored playbooks.
4. **Community & curation:** Support Official (admin‑curated) and Community sections with ratings, comments, and leaderboards.

## 4. User Personas

| Persona                | Needs                                                         | Value                                                                     |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **New Engineer**       | A clear, digestible path from zero to productive contributor. | Reduced context‑switching; faster confidence and impact.                  |
| **Senior Contributor** | Low‑effort mechanism to formalize and share expertise.        | Amplified impact; better knowledge retention; career visibility.          |
| **Team Lead / L&D**    | Measurable onboarding metrics and consistent, vetted content. | Lower training overhead; improved retention and team performance metrics. |
|                        |                                                               |                                                                           |


---

## 5. Key Features

### 5.1 Note → Blog Generation 
Allow users to your years of cluttered, quickly jotted notes into well documented and in depth tech blogs with examples and share it with your community. 

- **Input:** File upload, text paste, or URL link.
- **Pipeline:**
  1. Chunk and embed notes via AWS Bedrock or SageMaker.
  2. Summarize into blog structure: Introduction, Steps, Examples, Conclusion.
  3. Secrets detection & redaction via Amazon Macie or custom regex.
- **QA:**
  - Automated grammar/spell checks (Amazon Comprehend + custom dictionaries).
  - Link validity scanner for outdated URLs.
  - Human‑in‑the‑loop review queue (for Official content publications).

### 5.2 Custom content for each readers level of expertise
 Every tech blogs content can be dynamically changed for different levels of expertises 
- **Levels:**
  - **Beginner:** High‑level explanations, analogies, inline definitions, minimal prerequisites.
  - **Intermediate:** Clear code examples, configuration details, trade‑off discussions.
  - **Expert:** Deep dives on optimizations, edge cases, and advanced patterns.
- **Implementation:** On‑the‑fly prompts to Bedrock LLM with original blog context + level parameter.

### 5.3 Custom Guide Builder
Platform uses AI to combine multiple different blogs into one easy to follow step by step custom guide for their individual use-case. 
- **Tagging & Indexing:** Use Amazon OpenSearch Serverless for vector + full‑text search of blogs.
- **Source Ranking:** Metadata‑driven (Official vs. Community rating, recency).
- **Interfaces:**
  - **Wizard UI:** Dropdowns/checkboxes for tech stack selections (e.g., React, Kubernetes).
  - **Chatbot:** Conversational refinement of scope and content ordering.

### 5.4 Community & Official Sections

- **Community:** Open uploads, upvotes/downvotes, comments, version history.
- **Official:** Admin‑only publishing, audit logs, gated review, and comment moderation.

### 5.5 Gamified Leaderboards

- Points for blog contributions, ratings received, comments posted.
- Leaderboards by team/organization and badges for milestones.

## 6. System Architecture

```
Frontend: React + Vite + TypeScript + Chakra UI
Backend: 
	- Python FastAPI, 
	- AWS Step functions for
		- Triggering AI components 
Storage:
  - S3 for raw uploads & generated content
  - DynamoDB for metadata & ratings
  - OpenSearch Serverless for search & retrieval
AI Services:
  - AWS Bedrock (LLM + RAG) with OpenSearch KB
  - Amazon Comprehend (entity recognition) & Macie (secrets detection)
Auth & Security: AWS Cognito, IAM roles, VPC endpoints
CI/CD: GitHub Actions + Terraform
```


---
## 7. Goals of this app
1. Make onboarding less intimidating and a lot faster 
2. Allow readers different levels of expertise to get value out of the same post by dynamically changing its contents for its user.
3.  Make it as easy as possible for people to upload their notes to turn into valuable tech blogs
4. help build and launch faster with custom guides that consolidate many different blogs into one simple guide for a users specific use-case
5. App needs to be easy to use and understand 
6. Simple and intuitive UX
7. Make people want to upload their 
8. Great performance, scalable and secure 

