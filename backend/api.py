from fastapi import FastAPI


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"} 
    


# @app.get("/blogs")
# def get_blogs():
#     return {"message": "Blogs!"}

# @app.get("/blogs/{blog_id}")
# def get_blog(blog_id: int):
#     return {"message": f"Blog {blog_id}"}


# @app.post("/blogs")
# def create_blog(blog: Blog):
#     return {"message": "Blog created!"}

# @app.put("/blogs/{blog_id}")
# def update_blog(blog_id: int, blog: Blog):
#     return {"message": f"Blog {blog_id} updated!"}

# @app.delete("/blogs/{blog_id}")
# def delete_blog(blog_id: int):
#     return {"message": f"Blog {blog_id} deleted!"}