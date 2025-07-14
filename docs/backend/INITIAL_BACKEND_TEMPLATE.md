# Backend Feature: Note to Blog Generation (Local MVP)

## 1. Feature Description

This feature implements the backend logic for the "5.1 Note → Blog Generation" capability, as outlined in the PRD. This initial version (MVP) will be a simplified, local-only implementation.

The primary goal is to create a backend endpoint that accepts a user's notes in markdown format, processes them locally without real AI, and adds the generated content as a new entry into the `shared/data/blogs.json` file.

## 2. Route Definition

-   **Endpoint**: `POST /api/v1/blogs/upload-note`
-   **Method**: `POST`
-   **Description**: Receives markdown content from the frontend, processes it, and saves it as a new blog entry.

## 3. Request Body (JSON)

The endpoint will expect a JSON object with the following structure:

```json
{
  "title": "My First Blog Post",
  "markdown_content": "# My Note\\n\\nThis is a sample note in markdown format.",
  "tags": ["python", "fastapi", "tutorial"]
}
```

-   `title`: The title of the blog post.
-   `markdown_content`: The user's notes as a single string.
-   `tags`: A list of relevant tags for the blog.

## 4. Core Logic & Implementation Steps

The implementation should follow these steps precisely:

1.  **Receive and Validate Request**:
    -   Create a Pydantic model for the request body.
    -   FastAPI will automatically handle validation.
2.  **Read Existing Data**:
    -   Open and read the contents of `shared/data/blogs.json` into a Python list of dictionaries.
3.  **Generate New Blog Entry**:
    -   Generate a new unique ID for the blog (e.g., using `uuid.uuid4()`).
    -   Create a placeholder function `generate_content_by_level(markdown: str) -> dict`.
    -   This function will return a dictionary with three versions of the content:
        -   `"beginner"`: `"BEGINNER: " + markdown`
        -   `"intermediate"`: `"INTERMEDIATE: " + markdown`
        -   `"expert"`: `"EXPERT: " + markdown`
4.  **Construct New Blog Object**:
    -   Create a new dictionary for the blog post, matching the structure of existing entries in `blogs.json`. It should include the new ID, title, tags, and the three generated content versions.
5.  **Append and Save**:
    -   Append the new blog object to the list read from `blogs.json`.
    -   Write the entire updated list back to the `shared/data/blogs.json` file, overwriting its contents.
6.  **Return Response**:
    -   Return the newly created blog object as a JSON response with a `201 Created` status code.

## 5. Testing Requirements

**This is critical.** The AI agent executing the PRP must follow a strict test-after-each-step process:

1.  **After Implementing the Route**: Write an integration test that calls the new endpoint and asserts that it returns a `422 Unprocessable Entity` for an empty request, confirming the route is active.
2.  **After Implementing the Logic**: Write a unit test for the placeholder function (`generate_content_by_level`) to ensure it prepends the correct strings.
3.  **After Full Implementation**: Write a full integration test that sends a valid request, then reads `shared/data/blogs.json` to assert that the new blog was added correctly. Clean up the file after the test.

## 6. TODOs for Future Development

The implementing agent should add these comments to the code where appropriate to flag future work:

-   `// TODO: Replace placeholder function with a call to the real AI service (AWS Bedrock).`
-   `// TODO: Implement file upload to S3 for the original note.`
-   `// TODO: Add support for other input types (e.g., .txt, .pdf, URL).`
-   `// TODO: Integrate WebSocket notifications for real-time frontend updates.`

## 7. Success Response

A successful request should return a `201 Created` status code and a JSON response body containing the newly created blog object.

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "title": "My First Blog Post",
  "tags": ["python", "fastapi", "tutorial"],
  "content": {
    "beginner": "BEGINNER: # My Note\\n\\nThis is a sample note in markdown format.",
    "intermediate": "INTERMEDIATE: # My Note\\n\\nThis is a sample note in markdown format.",
    "expert": "EXPERT: # My Note\\n\\nThis is a sample note in markdown format."
  },
  "rating": 0,
  "views": 0
}
```
