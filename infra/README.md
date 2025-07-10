# Infra Folder

This folder contains all AWS infrastructure as code for the CleverDocs project, including Step Functions, Lambdas, S3, and more. Each lambda directory should be independently deployable. Infrastructure can be managed using Terraform, AWS CDK, or Pulumi.

## Structure
- `lambdas/`: Individual Lambda functions (e.g., sanitize, llm_step1, llm_step2, save_to_db)
- `stepfunctions/`: State machine definitions (Amazon States Language or CDK)
- `terraform/`: Terraform modules for AWS resources

Refer to the main setup documentation for more details. 