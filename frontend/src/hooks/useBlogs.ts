import { useState, useEffect } from "react";
import apiClient from "@/api/client";
import {
  blogs as initialBlogs,
  Blog,
  getBlogById as getById,
  getBlogsByDocType,
  getBlogsByTag as getByTag,
} from "@/data/blogs";

export const useBlogs = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await apiClient.get('/blogs');
        const data = response.data;
        setAllBlogs(data.data); // API returns { status: "success", data: Blog[], total: number, filteredTotal: number }
      } catch (error) {
        console.error('Error loading blogs:', error);
        setAllBlogs(initialBlogs); // Fallback to static data
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Use helper functions from data layer (maintains consistency)
  const getBlogById = (id: string): Blog | undefined => {
    return getById(id) || allBlogs.find((blog) => blog.id === id);
  };

  const getBlogsByTag = (tag: string): Blog[] => {
    return allBlogs.filter((blog) =>
      blog.tags.some((blogTag) =>
        blogTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  };

  const getBlogsByType = (docType: "official" | "community"): Blog[] => {
    return allBlogs.filter((blog) => blog.docType === docType);
  };

  const searchBlogs = (query: string): Blog[] => {
    const lowercaseQuery = query.toLowerCase();
    return allBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowercaseQuery) ||
        blog.excerpt.toLowerCase().includes(lowercaseQuery) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const updateBlogRating = (blogId: string, newRating: number) => {
    // TODO: Implement API call to update blog rating on backend
    // For now, update local state only
    setAllBlogs((prevBlogs) => {
      return prevBlogs.map((blog) => {
        if (blog.id === blogId) {
          const totalScore = blog.avgRating * blog.totalRatings + newRating;
          const newTotalRatings = blog.totalRatings + 1;
          const newAvgRating = totalScore / newTotalRatings;

          return {
            ...blog,
            avgRating: Math.round(newAvgRating * 10) / 10,
            totalRatings: newTotalRatings,
          };
        }
        return blog;
      });
    });
  };

  return {
    blogs: allBlogs,
    loading,
    getBlogById,
    getBlogsByTag,
    getBlogsByType, // New helper for cleaner component code
    searchBlogs,
    updateBlogRating,
  };
};

