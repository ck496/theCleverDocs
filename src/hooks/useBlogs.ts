import { useState, useEffect } from "react";
import { blogs, Blog } from "@/data/blogs";

export const useBlogs = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setAllBlogs(blogs);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getBlogById = (id: string): Blog | undefined => {
    return allBlogs.find((blog) => blog.id === id);
  };

  const getBlogsByTag = (tag: string): Blog[] => {
    return allBlogs.filter((blog) =>
      blog.tags.some((blogTag) =>
        blogTag.toLowerCase().includes(tag.toLowerCase()),
      ),
    );
  };

  const searchBlogs = (query: string): Blog[] => {
    const lowercaseQuery = query.toLowerCase();
    return allBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowercaseQuery) ||
        blog.excerpt.toLowerCase().includes(lowercaseQuery) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    );
  };

  return {
    blogs: allBlogs,
    loading,
    getBlogById,
    getBlogsByTag,
    searchBlogs,
  };
};
