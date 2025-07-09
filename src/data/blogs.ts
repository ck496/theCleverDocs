export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  coverImage: string;
}

export const blogs: Blog[] = [
  {
    id: "1",
    title: "Kubernetes Deployment Strategies: Blue-Green vs Rolling Updates",
    excerpt:
      "A comprehensive guide to Kubernetes deployment strategies, comparing blue-green deployments with rolling updates for zero-downtime releases.",
    content:
      "# Kubernetes Deployment Strategies: Blue-Green vs Rolling Updates\n\nChoosing the right deployment strategy is crucial for maintaining application availability and minimizing risk during releases.\n\n## Rolling Updates\n\nRolling updates gradually replace old pods with new ones, maintaining service availability throughout the process.\n\n### Advantages\n\n- Zero downtime deployments\n- Gradual rollout reduces blast radius\n- Built-in rollback capabilities\n- Resource efficient\n\n### Configuration Example\n\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\nspec:\n  replicas: 3\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 1\n      maxSurge: 1\n```\n\n## Blue-Green Deployments\n\nBlue-green deployments maintain two identical production environments, switching traffic between them during releases.\n\n### When to Use Blue-Green\n\n- Database schema changes\n- Major version upgrades\n- High-risk deployments\n- Need for instant rollback\n\n### Implementation with Kubernetes\n\nUse services and ingress controllers to manage traffic switching between blue and green environments.\n\n## Best Practices\n\n1. **Health Checks**: Implement proper readiness and liveness probes\n2. **Monitoring**: Set up comprehensive monitoring and alerting\n3. **Testing**: Automate testing in staging environments\n4. **Rollback Plans**: Always have a rollback strategy ready",
    author: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    publishedAt: "2024-01-15",
    readTime: "12 min read",
    tags: ["Kubernetes", "DevOps", "Deployment", "CI/CD"],
    coverImage:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
  },
  {
    id: "2",
    title: "AWS Cost Optimization: A Developer's Guide to Cloud Economics",
    excerpt:
      "Learn practical strategies to optimize AWS costs without sacrificing performance, including rightsizing, reserved instances, and monitoring techniques.",
    content:
      "# AWS Cost Optimization: A Developer's Guide to Cloud Economics\n\nCloud costs can spiral out of control quickly. Here's how to optimize your AWS spending while maintaining performance and reliability.\n\n## Understanding AWS Pricing Models\n\n### On-Demand vs Reserved Instances\n\n- **On-Demand**: Pay-as-you-go pricing, ideal for unpredictable workloads\n- **Reserved Instances**: Up to 75% savings for predictable workloads\n- **Spot Instances**: Up to 90% savings for fault-tolerant applications\n\n## Cost Optimization Strategies\n\n### 1. Rightsizing Resources\n\nRegularly analyze your resource utilization and adjust instance sizes accordingly.\n\n```bash\n# Use AWS CLI to analyze EC2 utilization\naws ce get-rightsizing-recommendation \\\n  --service EC2-Instance \\\n  --configuration '{\"BenefitsConsidered\":true}'\n```\n\n### 2. Implement Auto Scaling\n\nAuto scaling ensures you only pay for resources you actually need.\n\n### 3. Use AWS Cost Explorer\n\nRegularly review your spending patterns and identify optimization opportunities.\n\n## Monitoring and Alerting\n\n### CloudWatch Billing Alarms\n\nSet up billing alarms to get notified when costs exceed thresholds.\n\n### Cost Anomaly Detection\n\nEnable AWS Cost Anomaly Detection to identify unusual spending patterns.\n\n## Best Practices\n\n1. **Tag Everything**: Implement consistent tagging for cost allocation\n2. **Regular Reviews**: Schedule monthly cost optimization reviews\n3. **Automation**: Use AWS Lambda to automate cost optimization tasks\n4. **Training**: Educate your team on cost-conscious development practices",
    author: {
      name: "Michael Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    publishedAt: "2024-01-10",
    readTime: "10 min read",
    tags: ["AWS", "Cloud", "Cost Optimization", "FinOps"],
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
  {
    id: "3",
    title: "Building Resilient Microservices with Circuit Breakers",
    excerpt:
      "Implement the circuit breaker pattern to prevent cascading failures in distributed systems and improve overall system resilience.",
    content:
      "# Building Resilient Microservices with Circuit Breakers\n\nIn distributed systems, failures are inevitable. The circuit breaker pattern helps prevent cascading failures and improves system resilience.\n\n## Understanding Circuit Breakers\n\nCircuit breakers monitor for failures and temporarily disable failing services to prevent system-wide outages.\n\n### Circuit Breaker States\n\n1. **Closed**: Normal operation, requests flow through\n2. **Open**: Service is failing, requests are blocked\n3. **Half-Open**: Testing if service has recovered\n\n## Implementation in Node.js\n\n```javascript\nclass CircuitBreaker {\n  constructor(request, options = {}) {\n    this.request = request;\n    this.state = 'CLOSED';\n    this.failureCount = 0;\n    this.failureThreshold = options.failureThreshold || 5;\n    this.timeout = options.timeout || 60000;\n    this.monitor = options.monitor || console.log;\n  }\n\n  async call(...args) {\n    if (this.state === 'OPEN') {\n      if (this.nextAttempt <= Date.now()) {\n        this.state = 'HALF_OPEN';\n      } else {\n        throw new Error('Circuit breaker is OPEN');\n      }\n    }\n\n    try {\n      const result = await this.request(...args);\n      return this.onSuccess(result);\n    } catch (error) {\n      return this.onFailure(error);\n    }\n  }\n}\n```\n\n## Best Practices\n\n### 1. Proper Timeout Configuration\n\nSet appropriate timeouts based on your service SLAs and user expectations.\n\n### 2. Fallback Mechanisms\n\nImplement fallback responses when the circuit breaker is open.\n\n### 3. Monitoring and Alerting\n\nMonitor circuit breaker state changes and set up alerts for when breakers open.\n\n## Integration with Service Mesh\n\nService meshes like Istio provide built-in circuit breaker functionality.\n\n```yaml\napiVersion: networking.istio.io/v1alpha3\nkind: DestinationRule\nmetadata:\n  name: my-service\nspec:\n  host: my-service\n  trafficPolicy:\n    outlierDetection:\n      consecutiveErrors: 3\n      interval: 30s\n      baseEjectionTime: 30s\n```",
    author: {
      name: "Emily Zhang",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    publishedAt: "2024-01-05",
    readTime: "15 min read",
    tags: ["Microservices", "Resilience", "Architecture", "Node.js"],
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  },
  {
    id: "4",
    title: "Machine Learning Model Deployment with MLOps Best Practices",
    excerpt:
      "A comprehensive guide to deploying ML models in production, covering model versioning, monitoring, and automated retraining pipelines.",
    content:
      '# Machine Learning Model Deployment with MLOps Best Practices\n\nDeploying ML models to production requires careful consideration of versioning, monitoring, and maintenance strategies.\n\n## Model Versioning and Registry\n\n### MLflow Model Registry\n\nUse MLflow to track model versions and manage the ML lifecycle.\n\n```python\nimport mlflow\nimport mlflow.sklearn\nfrom mlflow.tracking import MlflowClient\n\n# Register model\nmlflow.sklearn.log_model(\n    model,\n    "model",\n    registered_model_name="fraud-detection"\n)\n\n# Transition model to production\nclient = MlflowClient()\nclient.transition_model_version_stage(\n    name="fraud-detection",\n    version=1,\n    stage="Production"\n)\n```\n\n## Deployment Strategies\n\n### 1. Batch Inference\n\nFor non-real-time predictions, use batch processing with tools like Apache Airflow.\n\n### 2. Real-time Serving\n\nDeploy models as REST APIs using frameworks like FastAPI or Flask.\n\n```python\nfrom fastapi import FastAPI\nimport joblib\nimport numpy as np\n\napp = FastAPI()\nmodel = joblib.load(\'model.pkl\')\n\n@app.post("/predict")\nasync def predict(features: list):\n    prediction = model.predict([features])\n    return {"prediction": prediction.tolist()}\n```\n\n## Model Monitoring\n\n### Data Drift Detection\n\nMonitor for changes in input data distribution that might affect model performance.\n\n### Performance Monitoring\n\nTrack key metrics like accuracy, precision, and recall in production.\n\n### A/B Testing\n\nImplement A/B testing to compare model versions safely.\n\n## Automated Retraining\n\n### Trigger Conditions\n\n- Performance degradation below threshold\n- Significant data drift detected\n- Scheduled retraining intervals\n\n### CI/CD for ML\n\nImplement continuous integration and deployment pipelines for ML models.\n\n```yaml\n# GitHub Actions workflow\nname: ML Pipeline\non:\n  push:\n    branches: [main]\n\njobs:\n  train-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Train Model\n        run: python train.py\n      - name: Validate Model\n        run: python validate.py\n      - name: Deploy Model\n        run: python deploy.py\n```',
    author: {
      name: "Dr. Alex Kumar",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    publishedAt: "2023-12-28",
    readTime: "18 min read",
    tags: ["Machine Learning", "MLOps", "AI", "Python", "Deployment"],
    coverImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  },
  {
    id: "5",
    title: "Infrastructure as Code with Terraform: Advanced Patterns",
    excerpt:
      "Master advanced Terraform patterns including modules, state management, and multi-environment deployments for scalable infrastructure.",
    content:
      '# Infrastructure as Code with Terraform: Advanced Patterns\n\nTerraform enables you to define infrastructure as code, but mastering advanced patterns is key to building scalable, maintainable infrastructure.\n\n## Terraform Modules\n\n### Creating Reusable Modules\n\nModules promote code reuse and standardization across environments.\n\n```hcl\n# modules/vpc/main.tf\nresource "aws_vpc" "main" {\n  cidr_block           = var.cidr_block\n  enable_dns_hostnames = true\n  enable_dns_support   = true\n\n  tags = {\n    Name        = var.name\n    Environment = var.environment\n  }\n}\n\nresource "aws_subnet" "public" {\n  count  = length(var.public_subnets)\n  vpc_id = aws_vpc.main.id\n\n  cidr_block              = var.public_subnets[count.index]\n  availability_zone       = data.aws_availability_zones.available.names[count.index]\n  map_public_ip_on_launch = true\n\n  tags = {\n    Name = "${var.name}-public-${count.index + 1}"\n    Type = "Public"\n  }\n}\n```\n\n## State Management\n\n### Remote State with S3\n\nStore Terraform state remotely for team collaboration and state locking.\n\n```hcl\nterraform {\n  backend "s3" {\n    bucket         = "my-terraform-state"\n    key            = "prod/terraform.tfstate"\n    region         = "us-west-2"\n    dynamodb_table = "terraform-locks"\n    encrypt        = true\n  }\n}\n```\n\n## Multi-Environment Management\n\n### Workspace Strategy\n\nUse Terraform workspaces to manage multiple environments.\n\n```bash\n# Create and switch to production workspace\nterraform workspace new prod\nterraform workspace select prod\n\n# Apply configuration\nterraform apply -var-file="prod.tfvars"\n```\n\n### Directory Structure\n\n```\ninfrastructure/\n├── modules/\n│   ├── vpc/\n│   ├── eks/\n│   └── rds/\n├── environments/\n│   ├── dev/\n│   ├── staging/\n│   └── prod/\n└── shared/\n```\n\n## Advanced Patterns\n\n### Data Sources\n\nUse data sources to reference existing infrastructure.\n\n```hcl\ndata "aws_ami" "ubuntu" {\n  most_recent = true\n  owners      = ["099720109477"] # Canonical\n\n  filter {\n    name   = "name"\n    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]\n  }\n}\n```\n\n### Conditional Resources\n\nCreate resources conditionally based on variables.\n\n```hcl\nresource "aws_instance" "web" {\n  count = var.create_instance ? 1 : 0\n  \n  ami           = data.aws_ami.ubuntu.id\n  instance_type = var.instance_type\n}\n```',
    author: {
      name: "Jordan Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    },
    publishedAt: "2023-12-20",
    readTime: "14 min read",
    tags: ["Terraform", "Infrastructure as Code", "DevOps", "AWS"],
    coverImage:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
  },
  {
    id: "6",
    title: "Monitoring and Observability: Prometheus, Grafana, and Jaeger",
    excerpt:
      "Build a comprehensive observability stack with Prometheus for metrics, Grafana for visualization, and Jaeger for distributed tracing.",
    content:
      '# Monitoring and Observability: Prometheus, Grafana, and Jaeger\n\nObservability is crucial for understanding system behavior in production. Here\'s how to build a comprehensive monitoring stack.\n\n## The Three Pillars of Observability\n\n### 1. Metrics (Prometheus)\n\nMetrics provide quantitative data about system performance over time.\n\n```yaml\n# prometheus.yml\nglobal:\n  scrape_interval: 15s\n\nscrape_configs:\n  - job_name: \'prometheus\'\n    static_configs:\n      - targets: [\'localhost:9090\']\n\n  - job_name: \'node-exporter\'\n    static_configs:\n      - targets: [\'localhost:9100\']\n\n  - job_name: \'my-app\'\n    static_configs:\n      - targets: [\'localhost:8080\']\n```\n\n### 2. Logs (ELK Stack)\n\nStructured logging provides detailed information about system events.\n\n```javascript\n// Application logging with Winston\nconst winston = require(\'winston\');\n\nconst logger = winston.createLogger({\n  level: \'info\',\n  format: winston.format.combine(\n    winston.format.timestamp(),\n    winston.format.json()\n  ),\n  transports: [\n    new winston.transports.File({ filename: \'app.log\' }),\n    new winston.transports.Console()\n  ]\n});\n\nlogger.info(\'User login\', { userId: 123, ip: \'192.168.1.1\' });\n```\n\n### 3. Traces (Jaeger)\n\nDistributed tracing tracks requests across multiple services.\n\n```javascript\n// OpenTelemetry instrumentation\nconst { NodeSDK } = require(\'@opentelemetry/sdk-node\');\nconst { JaegerExporter } = require(\'@opentelemetry/exporter-jaeger\');\n\nconst jaegerExporter = new JaegerExporter({\n  endpoint: \'http://localhost:14268/api/traces\',\n});\n\nconst sdk = new NodeSDK({\n  traceExporter: jaegerExporter,\n});\n\nsdk.start();\n```\n\n## Grafana Dashboards\n\n### Creating Effective Dashboards\n\n1. **Golden Signals**: Monitor latency, traffic, errors, and saturation\n2. **Business Metrics**: Track KPIs relevant to your application\n3. **Infrastructure Metrics**: Monitor CPU, memory, disk, and network\n\n### Dashboard as Code\n\n```json\n{\n  "dashboard": {\n    "title": "Application Metrics",\n    "panels": [\n      {\n        "title": "Request Rate",\n        "type": "graph",\n        "targets": [\n          {\n            "expr": "rate(http_requests_total[5m])",\n            "legendFormat": "{{method}} {{status}}"\n          }\n        ]\n      }\n    ]\n  }\n}\n```\n\n## Alerting Best Practices\n\n### Alert Fatigue Prevention\n\n1. **Alert on symptoms, not causes**\n2. **Use appropriate thresholds**\n3. **Implement alert escalation**\n4. **Regular alert review and cleanup**\n\n### Prometheus Alerting Rules\n\n```yaml\ngroups:\n  - name: application.rules\n    rules:\n      - alert: HighErrorRate\n        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1\n        for: 5m\n        labels:\n          severity: critical\n        annotations:\n          summary: "High error rate detected"\n```',
    author: {
      name: "Lisa Wang",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
    publishedAt: "2023-12-15",
    readTime: "16 min read",
    tags: ["Monitoring", "Observability", "Prometheus", "Grafana", "DevOps"],
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
];
