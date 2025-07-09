import { useState, useEffect } from "react";
import { users as initialUsers, User } from "@/data/userData";

export const useUserData = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage or use initial data
    const savedUsers = localStorage.getItem("cleverdocs-users");
    const usersData = savedUsers ? JSON.parse(savedUsers) : initialUsers;

    // Simulate API call delay
    const timer = setTimeout(() => {
      setAllUsers(usersData);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getUserById = (id: string): User | undefined => {
    return allUsers.find((user) => user.userId === id);
  };

  const getTopContributors = (limit: number = 10): User[] => {
    return allUsers
      .sort((a, b) => b.contributions.length - a.contributions.length)
      .slice(0, limit);
  };

  const getTopLearners = (limit: number = 10): User[] => {
    return allUsers
      .sort((a, b) => b.learned.length - a.learned.length)
      .slice(0, limit);
  };

  const getUsersByTeam = (team: string): User[] => {
    return allUsers.filter((user) =>
      user.team.toLowerCase().includes(team.toLowerCase()),
    );
  };

  const searchUsers = (query: string): User[] => {
    const lowercaseQuery = query.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.team.toLowerCase().includes(lowercaseQuery),
    );
  };

  return {
    users: allUsers,
    loading,
    getUserById,
    getTopContributors,
    getTopLearners,
    getUsersByTeam,
    searchUsers,
  };
};
