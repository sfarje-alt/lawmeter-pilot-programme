import { useState, useEffect } from "react";
import { StarredAlert, Comment } from "@/types/legislation";

const STORAGE_KEY = "starred_alerts";
const COMMENTS_KEY = "alert_comments";

export function useStarredAlerts() {
  const [starred, setStarred] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
    // Default starred alerts for demonstration - matching actual generated IDs
    // criticalTopics generates: [0]=7786, [1]=7558, [2]=9416, [3]=8220, [4]=7558
    return new Set([
      "ACTS:LEY-7786-5000",  // Operaciones Sospechosas
      "ACTS:LEY-7558-5001",  // KYC Biométrico
      "ACTS:LEY-9416-5002",  // Protección de Datos
      "ACTS:LEY-8220-5003",  // Otra normativa
      "ACTS:LEY-7558-5004"   // BCCR
    ]);
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    const stored = localStorage.getItem(COMMENTS_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(starred)));
  }, [starred]);

  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  const toggleStar = (scope: "ACTS" | "BILLS", alertKey: string) => {
    const key = `${scope}:${alertKey}`;
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isStarred = (scope: "ACTS" | "BILLS", alertKey: string): boolean => {
    return starred.has(`${scope}:${alertKey}`);
  };

  const addComment = (
    scope: "ACTS" | "BILLS",
    alertKey: string,
    visibility: "TEAM" | "PRIVATE",
    body: string,
    userId: string = "current-user",
    userName: string = "Current User"
  ) => {
    const key = `${scope}:${alertKey}`;
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      userId,
      userName,
      visibility,
      body,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newComment],
    }));
  };

  const deleteComment = (
    scope: "ACTS" | "BILLS",
    alertKey: string,
    commentId: string,
    currentUserId: string = "current-user"
  ) => {
    const key = `${scope}:${alertKey}`;
    setComments((prev) => {
      const alertComments = prev[key] || [];
      const comment = alertComments.find((c) => c.id === commentId);
      
      // Allow deletion of private comments by owner or any team comment
      if (!comment) {
        return prev;
      }
      
      // Private comments can only be deleted by owner
      if (comment.visibility === "PRIVATE" && comment.userId !== currentUserId) {
        return prev;
      }

      return {
        ...prev,
        [key]: alertComments.filter((c) => c.id !== commentId),
      };
    });
  };

  const getComments = (scope: "ACTS" | "BILLS", alertKey: string): Comment[] => {
    const key = `${scope}:${alertKey}`;
    return comments[key] || [];
  };

  return {
    starred: Array.from(starred),
    toggleStar,
    isStarred,
    addComment,
    deleteComment,
    getComments,
  };
}
