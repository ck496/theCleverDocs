# CleverDocs Coding Standards

> **Purpose**: Detailed coding patterns, conventions, and implementation guidelines for all tiers.

## 🐍 Backend Standards (FastAPI + Python)

### **File Organization**

```python
# Current: backend/api.py ✅
# Migration target: backend/app/ structure 🔄

backend/app/
├── api/routes.py           # FastAPI routes
├── services/service.py     # Business logic
├── models/model.py         # Pydantic models
├── clients/aws_client.py   # AWS service wrappers
├── core/config.py          # Configuration
└── main.py                 # FastAPI app instance
```

### **Naming Conventions**

- **Files**: snake_case (`blog_service.py`, `upload_handler.py`)
- **Functions**: snake_case (`create_blog`, `process_upload`)
- **Classes**: PascalCase (`BlogService`, `S3Client`)
- **Variables**: snake_case (`blog_data`, `user_id`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `API_VERSION`)

### **Error Handling Pattern**

```python
try:
    result = await service.process_content(data)
    return {"status": "success", "data": result}
except ValidationError as e:
    raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
except AIServiceError as e:
    logger.error(f"AI service failed: {e}")
    raise HTTPException(status_code=503, detail="Content generation temporarily unavailable")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise HTTPException(status_code=500, detail="Internal server error")
```

### **Pydantic Model Pattern**

```python
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class BlogCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=10)
    expertise_level: str = Field(..., regex="^(beginner|intermediate|expert)$")
    tags: Optional[List[str]] = Field(default=[], max_items=10)

    @validator('tags')
    def validate_tags(cls, v):
        return [tag.strip().lower() for tag in v if tag.strip()]

class BlogResponse(BaseModel):
    id: str
    title: str
    content: str
    expertise_level: str
    tags: List[str]
    created_at: datetime
    author_id: str
```

### **AWS Client Pattern**

```python
import boto3
from botocore.exceptions import ClientError
from tenacity import retry, stop_after_attempt, wait_exponential

class S3Client:
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.client = boto3.client('s3')

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def upload_file(self, file_content: bytes, file_key: str) -> str:
        try:
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_content,
                ServerSideEncryption='AES256'
            )
            return f"s3://{self.bucket_name}/{file_key}"
        except ClientError as e:
            logger.error(f"S3 upload failed: {e}")
            raise
```

## ⚛️ Frontend Standards (React + TypeScript + Chakra UI)

### **Current Structure (✅ What Exists)**

```typescript
frontend/src/
├── components/              # ✅ Exists but has mixed usage
│   └── ui/                  # ⚠️ ShadCN components (available but UNUSED)
├── lib/
│   └── utils.ts            # ✅ Tailwind utility functions
├── pages/                  # ✅ Active - page-level components
│   ├── HomePage.tsx        # ✅ Main landing page (IMPLEMENTED)
│   ├── BlogsGridPage.tsx   # 🔄 Planned page components
│   ├── BlogDetails.tsx     # 🔄 Planned page components
│   ├── UploadNotes.tsx     # 🔄 Planned page components
│   ├── About.tsx           # 🔄 Planned page components
│   ├── LeaderboardPage.tsx # 🔄 Planned page components
│   └── LoginPage.tsx       # 🔄 Planned page components
├── stories/                # ⚠️ Storybook stories (available but unused)
├── types/
│   └── supabase.ts         # ⚠️ Supabase types (available but unused)
└── App.tsx                 # ✅ Router with multiple routes defined
```

### **Planned Expansion Structure**

```typescript
frontend/src/
├── components/[Feature]/    # 🔄 Feature-specific components to be created
├── hooks/api/              # 🔄 React Query hooks (not implemented yet)
├── api/                    # 🔄 API client functions (not implemented yet)
├── types/                  # 🔄 CleverDocs-specific types (expand beyond Supabase)
└── theme/                  # 🔄 Chakra UI custom theme
```

### **Technology Stack (Actual Current State)**

- **Build Tool**: Vite 6.2.3 ✅
- **Framework**: React 18.2.0 + TypeScript 5.8.2 ✅
- **Primary UI**: Chakra UI 2.10.9 ✅ (actively used in HomePage)
- **Secondary UI**: ShadCN + Tailwind ⚠️ (available but NOT used - stick to Chakra UI)
- **Routing**: React Router 6.23.1 ✅ (with multiple routes defined)
- **Icons**: React Icons 5.5.0 ✅ (Feather icons actively used)
- **Development**: Tempo devtools 2.0.108 ✅ (visual development environment)

### **IMPORTANT: UI Framework Decision**

- **Use Chakra UI exclusively** - it's actively used in HomePage.tsx
- **Do NOT use ShadCN components** from `src/components/ui/` - they exist but are unused
- **Tailwind CSS is configured but secondary** - only used for ShadCN components
- **Cleanup planned**: Remove `.next/` directory (Next.js artifact)

### **Current Routing Structure**

```typescript
// App.tsx has these routes defined:
<Route path="/" element={<HomePage />} />          // ✅ Implemented
<Route path="/blogs" element={<BlogsGridPage />} />    // 🔄 Planned
<Route path="/blog/:id" element={<BlogDetails />} />  // 🔄 Planned
<Route path="/upload" element={<UploadNotes />} />     // 🔄 Planned
<Route path="/about" element={<About />} />            // 🔄 Planned
<Route path="/leaderboards" element={<LeaderboardPage />} /> // 🔄 Planned
<Route path="/login" element={<LoginPage />} />        // 🔄 Planned
```

### **Naming Conventions**

- **Components**: PascalCase (`BlogsGridPage.tsx`, `BlogDetails.tsx`)
- **Hooks**: camelCase with `use` prefix (`useBlogList`, `useCreateBlog`) - 🔄 to be created
- **API functions**: camelCase (`createBlog`, `getBlogList`) - 🔄 to be created
- **Types**: PascalCase (`BlogData`, `UserProfile`) - 🔄 to be created
- **Variables**: camelCase (`blogData`, `isLoading`)

### **Current Component Pattern (Based on HomePage.tsx)**

```tsx
import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBook, FiUsers, FiTrendingUp, FiStar } from "react-icons/fi";

const HomePage: React.FC = () => {
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient={bgGradient} color="white" py={20}>
        <Container maxW="6xl">
          <VStack spacing={6} textAlign="center">
            <Heading size="2xl">
              Transform Your Notes Into Polished Tech Blogs
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              AI-powered platform that accelerates new-hire ramp-up...
            </Text>
            <Button size="lg" colorScheme="white" variant="solid">
              Get Started
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="6xl" py={16}>
        <VStack spacing={12}>
          <Heading size="xl" textAlign="center">
            Key Features
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={8}
          >
            {/* Feature cards with icons */}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;
```

### **Development Commands (Current)**

```bash
cd frontend

# Development (✅ works)
npm run dev                  # Start Vite dev server

# Build (✅ works)
npm run build               # TypeScript compilation + Vite build
npm run build-no-errors    # Build without TypeScript errors

# Code Quality (✅ works)
npm run lint               # ESLint with TypeScript

# Preview (✅ works)
npm run preview            # Preview production build

# Type Generation (⚠️ requires Supabase setup)
npm run types:supabase     # Generate Supabase types (not currently used)
```

### **Planned React Query Hook Pattern (🔄 To Be Implemented)**

```typescript
// hooks/api/useBlog.ts - to be created when backend is ready
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { blogApi } from "../api/blog";

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: blogApi.create,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (old: Blog[] = []) => [
        ...old,
        newBlog,
      ]);

      toast({
        title: "Blog created",
        status: "success",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating blog",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });
};
```

### **Implementation Priority for New Components**

1. **BlogsGridPage.tsx** - List all blogs (use mock data initially)
2. **BlogDetails.tsx** - Individual blog view (use mock data initially)
3. **UploadNotes.tsx** - File upload component for note transformation
4. **API integration** - Connect to backend when ready
5. **Authentication** - LoginPage.tsx integration when backend auth ready

## ☁️ Infrastructure Standards (Terraform)

### **File Organization**

```hcl
infra/
├── modules/
│   ├── s3/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── dynamodb/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── lambdas/
```

### **Naming Conventions**

- **Resources**: `{environment}-cleverdocs-{resource-type}`
- **Variables**: snake_case (`bucket_name`, `table_name`)
- **Modules**: kebab-case directories (`s3-bucket`, `lambda-function`)

### **Resource Pattern**

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "uploads" {
  bucket = "${var.environment}-cleverdocs-uploads"

  tags = merge(var.common_tags, {
    Name = "${var.environment}-cleverdocs-uploads"
    Type = "S3"
  })
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

## 🤖 AI Integration Standards

### **Content Generation Pattern**

```python
EXPERTISE_LEVELS = ["beginner", "intermediate", "expert"]

CONTENT_TEMPLATES = {
    "beginner": "shared/prompts/blog-generation/beginner.txt",
    "intermediate": "shared/prompts/blog-generation/intermediate.txt",
    "expert": "shared/prompts/blog-generation/expert.txt"
}

class ContentGenerator:
    async def generate_blog_variants(self, notes: str, title: str) -> Dict[str, str]:
        results = {}

        for level in EXPERTISE_LEVELS:
            prompt = self.load_prompt_template(CONTENT_TEMPLATES[level])
            content = await self.bedrock_client.generate_content(
                prompt.format(notes=notes, title=title)
            )
            results[level] = content

        return results
```

## 📝 Documentation Standards

### **API Documentation**

- Use OpenAPI 3.0 specifications
- Document all endpoints with examples
- Include error response schemas
- Provide authentication requirements

### **Component Documentation**

```tsx
/**
 * BlogCard component displays a blog post summary with actions
 *
 * @param blog - Blog data object
 * @param onEdit - Callback when edit button is clicked
 * @param onDelete - Callback when delete button is clicked
 * @param showActions - Whether to show edit/delete actions (default: true)
 */
export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  // Implementation
};
```

### **Infrastructure Documentation**

```hcl
# S3 bucket for storing uploaded files
# Configured with:
# - Server-side encryption (AES256)
# - Public access blocked
# - Lifecycle policies for cost optimization
resource "aws_s3_bucket" "uploads" {
  # Configuration
}
```

## 🔗 Cross-Tier Integration

### **API Contract Definition**

```typescript
// shared/types/api.ts
export interface BlogCreateRequest {
  title: string;
  content: string;
  expertise_level: "beginner" | "intermediate" | "expert";
  tags?: string[];
}

export interface BlogResponse {
  id: string;
  title: string;
  content: string;
  expertise_level: string;
  tags: string[];
  created_at: string;
  author_id: string;
}
```

### **Environment Variable Pattern**

```bash
# .env.example
# Database
DATABASE_URL=postgresql://localhost:5432/cleverdocs

# AWS Configuration
AWS_REGION=us-west-2
AWS_S3_BUCKET=cleverdocs-uploads-dev

# AI Configuration
BEDROCK_MODEL_ID=claude-3-sonnet-20240229-v1:0

# Application
API_VERSION=v1
DEBUG=false
```

---

**These standards ensure consistency across all tiers and prevent common implementation issues.**
