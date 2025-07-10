import { useState, useEffect } from "react";
import { blogs as initialBlogs, Blog } from "@/data/blogs";

export const useBlogs = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blogs from localStorage or use initial data
    const savedBlogs = localStorage.getItem("cleverdocs-blogs");
    const blogsData = savedBlogs ? JSON.parse(savedBlogs) : initialBlogs;

    // Simulate API call delay
    const timer = setTimeout(() => {
      setAllBlogs(blogsData);
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

  const updateBlogRating = (blogId: string, newRating: number) => {
    setAllBlogs((prevBlogs) => {
      const updatedBlogs = prevBlogs.map((blog) => {
        if (blog.id === blogId) {
          const totalScore = blog.avgRating * blog.totalRatings + newRating;
          const newTotalRatings = blog.totalRatings + 1;
          const newAvgRating = totalScore / newTotalRatings;

          return {
            ...blog,
            avgRating: Math.round(newAvgRating * 10) / 10, // Round to 1 decimal place
            totalRatings: newTotalRatings,
          };
        }
        return blog;
      });

      // Save to localStorage
      localStorage.setItem("cleverdocs-blogs", JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
  };

  return {
    blogs: allBlogs,
    loading,
    getBlogById,
    getBlogsByTag,
    searchBlogs,
    updateBlogRating,
  };
};
