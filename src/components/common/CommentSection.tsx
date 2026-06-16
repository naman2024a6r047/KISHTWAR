"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { CommentWithUser } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Reply, Trash2, Edit2, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";

interface CommentSectionProps {
  initialComments: CommentWithUser[];
  itemId: number;
  itemType: "blog" | "place" | "photo";
}

export default function CommentSection({
  initialComments,
  itemId,
  itemType,
}: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newCommentText,
          [`${itemType}Id`]: itemId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewCommentText("");
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          parentId,
          [`${itemType}Id`]: itemId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) => {
          return prev.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [data.comment, ...(comment.replies || [])],
              };
            }
            return comment;
          });
        });
        setReplyText("");
        setReplyToId(null);
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: number) => {
    if (!editingText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingText }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const updateCommentInTree = (list: CommentWithUser[]): CommentWithUser[] => {
          return list.map((c) => {
            if (c.id === commentId) {
              return { ...c, content: editingText, isEdited: true };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateCommentInTree(c.replies) };
            }
            return c;
          });
        };
        setComments((prev) => updateCommentInTree(prev));
        setEditingId(null);
        setEditingText("");
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const removeCommentFromTree = (list: CommentWithUser[]): CommentWithUser[] => {
          return list
            .filter((c) => c.id !== commentId)
            .map((c) => {
              if (c.replies && c.replies.length > 0) {
                return { ...c, replies: removeCommentFromTree(c.replies) };
              }
              return c;
            });
        };
        setComments((prev) => removeCommentFromTree(prev));
      }
    } catch {
      // Handle error
    }
  };

  const renderComment = (comment: CommentWithUser, isReply = false) => {
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    const isOwner = user && user.id === comment.userId;
    const isAdmin = user && user.role === "SUPER_ADMIN";

    return (
      <div key={comment.id} className={cn("flex flex-col space-y-2 py-4", isReply ? "pl-6 sm:pl-10 border-l border-kishtwar-cream-200 mt-2" : "border-b border-kishtwar-cream-100")}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {comment.user.avatar ? (
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="h-8 w-8 rounded-full object-cover border border-kishtwar-gold shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-kishtwar-green-600 border border-kishtwar-gold flex items-center justify-center text-white text-xs font-bold shrink-0">
              {comment.user.name.charAt(0)}
            </div>
          )}

          {/* Comment Bubble */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-kishtwar-green-900">{comment.user.name}</span>
              <span className="text-[10px] text-gray-400 font-medium">{timeAgo}</span>
              {comment.isEdited && (
                <span className="text-[10px] text-gray-400 italic font-semibold">(edited)</span>
              )}
            </div>

            {/* Comment Text / Edit form */}
            {editingId === comment.id ? (
              <div className="mt-2 space-y-2">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-kishtwar-green-500 bg-white"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(comment.id)}
                    className="px-3 py-1.5 text-xs bg-kishtwar-green-900 text-white rounded-full font-bold hover:bg-kishtwar-green-800 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {/* Actions Bar */}
            <div className="flex items-center space-x-4 mt-2.5 text-xs text-gray-400 font-semibold select-none">
              {/* Like action */}
              <LikeButton
                initialLiked={false}
                initialLikeCount={comment.likeCount}
                itemId={comment.id}
                itemType="comment"
                className="text-gray-400 hover:text-red-500 p-0 hover:bg-transparent"
                size="sm"
              />

              {/* Reply action (only on top level comments) */}
              {!isReply && isAuthenticated && (
                <button
                  onClick={() => {
                    setReplyToId(replyToId === comment.id ? null : comment.id);
                    setReplyText("");
                  }}
                  className="flex items-center space-x-1 hover:text-kishtwar-green-700 transition-colors cursor-pointer"
                >
                  <Reply className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </button>
              )}

              {/* Edit action */}
              {isOwner && editingId !== comment.id && (
                <button
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditingText(comment.content);
                  }}
                  className="flex items-center space-x-1 hover:text-kishtwar-gold transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              )}

              {/* Delete action */}
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>

            {/* Reply Input Box */}
            {replyToId === comment.id && (
              <div className="mt-3 flex items-start gap-2 animate-fade-in pl-4 border-l-2 border-kishtwar-gold">
                <CornerDownRight className="h-4 w-4 text-kishtwar-gold shrink-0 mt-2.5" />
                <div className="flex-grow space-y-2">
                  <textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-kishtwar-green-500 bg-white"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="px-3 py-1 bg-kishtwar-green-900 text-white rounded-full font-bold text-xs hover:bg-kishtwar-green-800 transition-colors"
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() => setReplyToId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full font-bold text-xs hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-1">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-3 border-b border-kishtwar-cream-200">
        <MessageSquare className="h-5 w-5 text-kishtwar-green-700" />
        <h3 className="text-lg font-serif font-bold text-kishtwar-green-900">
          Comments ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* New Comment Textarea */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            placeholder="Share your thoughts, questions, or experiences about this place..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full text-sm p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-kishtwar-green-500 bg-white shadow-sm"
            rows={3}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || isSubmitting}
            className="px-5 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-800 text-white rounded-full text-sm font-serif font-bold transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="bg-kishtwar-cream/50 rounded-2xl border border-kishtwar-cream-200 p-6 text-center space-y-3">
          <p className="text-sm text-gray-600 font-medium">
            Join the community to share your feedback and comments.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold text-white bg-kishtwar-green-900 hover:bg-kishtwar-green-800 transition-colors uppercase tracking-wider"
          >
            Login to comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="divide-y divide-kishtwar-cream-100">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <p className="text-sm text-gray-500 italic py-6 text-center">
            No comments yet. Be the first to start the conversation!
          </p>
        )}
      </div>
    </div>
  );
}
