// Updated to use shared data source for cross-tier consistency
// Maintains exact same interface as the original frontend structure
import blogsData from "../../../shared/data/blogs.json";

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: {
    beginner: string;
    intermediate: string;
    expert: string;
  };
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  coverImage: string;
  avgRating: number;
  totalRatings: number;
  docType: "official" | "community";
  teamInfo?: {
    teamName: string;
    email: string;
  };
}

// Export typed blogs data from shared source (maintains exact same functionality)
export const blogs: Blog[] = blogsData as Blog[];

// Helper functions for CleverDocs features (same as before but with shared data)
export const getBlogsByDocType = (
  docType: "official" | "community"
): Blog[] => {
  return blogs.filter((blog) => blog.docType === docType);
};

export const getBlogsByTag = (tag: string): Blog[] => {
  return blogs.filter((blog) => blog.tags.includes(tag));
};

export const getBlogById = (id: string): Blog | undefined => {
  return blogs.find((blog) => blog.id === id);
};

export const getCommunityBlogs = (): Blog[] => {
  return blogs.filter((blog) => blog.docType === "community");
};

export const getOfficialBlogs = (): Blog[] => {
  return blogs.filter((blog) => blog.docType === "official");
};

export const getTopRatedBlogs = (limit: number = 5): Blog[] => {
  return blogs
    .filter((blog) => blog.docType === "community" && blog.totalRatings > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, limit);
};
