import { useState, useEffect } from "react";
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
    // Simulate API loading - easily replaceable with actual API call
    const loadBlogs = async () => {
      try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch('/api/blogs');
        // const blogsData = await response.json();

        // For now, use shared data source (single source of truth)
        const savedBlogs = localStorage.getItem("cleverdocs-blogs");
        const blogsData = savedBlogs ? JSON.parse(savedBlogs) : initialBlogs;

        // Simulate network delay for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAllBlogs(blogsData);
      } catch (error) {
        console.error("Error loading blogs:", error);
        // Fallback to initial blogs
        setAllBlogs(initialBlogs);
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
    setAllBlogs((prevBlogs) => {
      const updatedBlogs = prevBlogs.map((blog) => {
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

      // Save to localStorage (remove when API is ready)
      localStorage.setItem("cleverdocs-blogs", JSON.stringify(updatedBlogs));
      return updatedBlogs;
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

// Future API-ready version (for reference)
/*
export const useBlogs = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setAllBlogs(data.data); // Assuming API returns { status: "success", data: Blog[] }
      } catch (error) {
        console.error('Error loading blogs:', error);
        setAllBlogs(initialBlogs); // Fallback to static data
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Rest stays the same...
};
*/
