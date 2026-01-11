import { useState, useEffect } from "react";
import LandingPage from './LandingPage';

// Simple icon components
const Check = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Plus = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Send = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const Sparkles = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
  </svg>
);

const X = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LogOut = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Target = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const TrendingUp = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ArrowLeft = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const MessageSquare = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ThumbsUp = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const ThumbsDown = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </svg>
);

const Bell = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const Clock = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Flame = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// Types
interface User {
  id: string;
  email: string;
  name: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string | null;
  status: string;
  progress: number;
  createdAt: string;
}

interface Step {
  id: string;
  goalId: string;
  title: string;
  description: string;
  week: number | null;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  frequency: string;
  active: boolean;
  streak: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  commentCount: number;
  userVote: "like" | "dislike" | null;
  createdAt: string;
}

interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface Notification {
  id: string;
  userId: string;
  postId: string;
  postTitle: string;
  commenterName: string;
  read: boolean;
  createdAt: string;
}

// API Service
class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Request failed" } }));
      throw new Error(error.error?.message || "Request failed");
    }

    return response.json();
  }

  async login(email: string, password: string) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.accessToken);
    return data;
  }

  async register(name: string, email: string, password: string) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(data.accessToken);
    return data;
  }

  async getMe() {
    return this.request("/auth/me");
  }

  async getGoals() {
    return this.request("/goals");
  }

  async createGoal(goal: { title: string; description: string; targetDate?: string }) {
    return this.request("/goals", {
      method: "POST",
      body: JSON.stringify(goal),
    });
  }

  async generateSteps(goalId: string, intensity: string, timeframe: string) {
    return this.request(`/goals/${goalId}/generate-steps`, {
      method: "POST",
      body: JSON.stringify({ intensity, timeframe }),
    });
  }

  async getSteps(goalId: string) {
    return this.request(`/goals/${goalId}/steps`);
  }

  async toggleStep(stepId: string, completed: boolean) {
    return this.request(`/steps/${stepId}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
  }

  async getHabits() {
    return this.request("/habits");
  }

  async createHabit(habit: { name: string; frequency: string; goalId?: string }) {
    return this.request("/habits", {
      method: "POST",
      body: JSON.stringify(habit),
    });
  }

  async deleteHabit(habitId: string) {
    return this.request(`/habits/${habitId}`, { method: "DELETE" });
  }

  async getCoaching(goalId: string, message: string) {
    return this.request("/ai/coach", {
      method: "POST",
      body: JSON.stringify({ goalId, message }),
    });
  }

  // Forum API methods
  async getForumPosts(sortBy: "recent" | "top" = "recent") {
    return this.request(`/forum/posts?sortBy=${sortBy}`);
  }

  async createForumPost(post: { title: string; content: string }) {
    return this.request("/forum/posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  async getPostComments(postId: string) {
    return this.request(`/forum/posts/${postId}/comments`);
  }

  async createComment(postId: string, content: string) {
    return this.request(`/forum/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async votePost(postId: string, voteType: "like" | "dislike") {
    return this.request(`/forum/posts/${postId}/vote`, {
      method: "POST",
      body: JSON.stringify({ voteType }),
    });
  }

  async getNotifications() {
    return this.request("/forum/notifications");
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/forum/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  }
}

const api = new ApiService();

// Goal Card Component
function GoalCard({ goal, onClick, isGenerating }: { goal: Goal; onClick: () => void; isGenerating: boolean }) {
  const [stepsData, setStepsData] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  const totalSteps = stepsData.length;

  useEffect(() => {
    loadSteps();
  }, [goal.id]);

  const loadSteps = async () => {
    try {
      const steps = await api.getSteps(goal.id);
      setStepsData(steps);
    } catch (err) {
      console.error("Failed to load steps:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedSteps = stepsData.filter(s => s.completed).length;
  const currentStepIndex = stepsData.findIndex(s => !s.completed);
  const startIndex = Math.max(0, (currentStepIndex >= 2 ? currentStepIndex - 1 : 0));
  const visibleSteps = stepsData.slice(startIndex, startIndex + 3);

  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-2xl p-6 border border-card-border hover:border-primary/30 cursor-pointer transition-all hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {goal.title}
        </h3>
        {isGenerating && (
          <div className="w-5 h-5 border-2 border-t-primary border-gray-200 rounded-full animate-spin"></div>
        )}
      </div>

      {goal.description && (
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
          {goal.description}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-t-primary border-gray-200 rounded-full animate-spin"></div>
        </div>
      ) : totalSteps > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-8 overflow-x-auto py-4">
            {visibleSteps.map((step, index) => {
              const globalIndex = startIndex + index;
              const isCompleted = step.completed;
              const isCurrent = globalIndex === currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${isCompleted
                        ? 'bg-accent text-white'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground scale-125 shadow-lg ring-4 ring-primary/20'
                        : 'bg-muted border-2 border-muted-foreground/20'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{globalIndex + 1}</span>}
                  </div>
                  {isCurrent && <span className="text-xs text-primary mt-2">Current</span>}

                  {index < visibleSteps.length - 1 && (
                    <div className={`w-12 h-1 mt-3 ${step.completed ? 'bg-accent' : 'bg-muted-foreground/20'}`}></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSteps} of {stepsData.length} completed
            </span>
            <span className="text-primary font-bold">
              {Math.round(goal.progress * 100)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Generating action plan...
        </div>
      )}
    </div>
  );
}

// Forum View Component
function ForumView({ user, notifications, onNotificationClick }: { user: User; notifications: Notification[]; onNotificationClick: (notif: Notification) => void }) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "top">("recent");
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadPosts();
  }, [sortBy]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getForumPosts(sortBy);
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    try {
      await api.createForumPost({ title: newPostTitle, content: newPostContent });
      setNewPostTitle("");
      setNewPostContent("");
      setShowNewPost(false);
      loadPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const openPost = async (post: ForumPost) => {
    setSelectedPost(post);
    try {
      const data = await api.getPostComments(post.id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    try {
      await api.createComment(selectedPost.id, newComment);
      setNewComment("");
      const data = await api.getPostComments(selectedPost.id);
      setComments(data);
      loadPosts();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleVote = async (postId: string, voteType: "like" | "dislike") => {
    try {
      await api.votePost(postId, voteType);
      loadPosts();
      if (selectedPost?.id === postId) {
        const updatedPost = posts.find(p => p.id === postId);
        if (updatedPost) setSelectedPost(updatedPost);
      }
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (selectedPost) {
    return (
      <div className="p-8">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Forum</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-card-border mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{selectedPost.title}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">{selectedPost.userName}</span>
                  <span>•</span>
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
              </div>
            </div>

            <p className="text-foreground whitespace-pre-wrap mb-6">{selectedPost.content}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleVote(selectedPost.id, "like")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPost.userVote === "like"
                    ? "bg-accent/20 text-accent"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedPost.likes}</span>
              </button>
              <button
                onClick={() => handleVote(selectedPost.id, "dislike")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPost.userVote === "dislike"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedPost.dislikes}</span>
              </button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{comments.length} comments</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-card-border">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            <div className="mb-6">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <button
                onClick={addComment}
                className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Post Comment
              </button>
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground text-lg">Share experiences and get support from others</p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("recent")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === "recent"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Recent</span>
            </div>
          </button>
          <button
            onClick={() => setSortBy("top")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === "top"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>Top</span>
            </div>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-card-border">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-lg mb-2">No posts yet</p>
          <p className="text-sm text-muted-foreground">Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => openPost(post)}
              className="bg-card rounded-2xl p-6 border border-card-border hover:border-primary/30 cursor-pointer transition-all hover:shadow-lg group"
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(post.id, "like");
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      post.userVote === "like"
                        ? "bg-accent/20 text-accent"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-bold">{post.likes - post.dislikes}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(post.id, "dislike");
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      post.userVote === "dislike"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">{post.userName}</span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentCount} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-6 max-w-2xl w-full shadow-xl border border-card-border">
            <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  placeholder="Share your thoughts, ask questions, or start a discussion..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={6}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={createPost}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Post
                </button>
                <button
                  onClick={() => {
                    setShowNewPost(false);
                    setNewPostTitle("");
                    setNewPostContent("");
                  }}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Notifications Panel Component
function NotificationsPanel({ 
  notifications, 
  onNotificationClick,
  onClose 
}: { 
  notifications: Notification[];
  onNotificationClick: (notif: Notification) => void;
  onClose: () => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl border border-card-border max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No new notifications</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onNotificationClick(notif);
                  onClose();
                }}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  notif.read ? "bg-muted/50" : "bg-primary/10 border border-primary/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">
                      <span className="text-primary">{notif.commenterName}</span> commented on your post
                    </p>
                    <p className="text-sm text-muted-foreground truncate mb-1">"{notif.postTitle}"</p>
                    <span className="text-xs text-muted-foreground">{formatDate(notif.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Dashboard View Component
function DashboardView({ 
  goals, 
  habits, 
  newHabit, 
  setNewHabit, 
  addHabit, 
  removeHabit,
  onSelectGoal,
  generatingSteps
}: { 
  goals: Goal[];
  habits: Habit[];
  newHabit: string;
  setNewHabit: (v: string) => void;
  addHabit: () => void;
  removeHabit: (id: string) => void;
  onSelectGoal: (goal: Goal) => void;
  generatingSteps: string | null;
}) {
  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Track your progress across all goals</p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">Your Goals</h2>
        
        {goals.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-card-border">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg mb-2">No goals yet</p>
            <p className="text-sm text-muted-foreground">Click the + button in the sidebar to create your first goal</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onClick={() => onSelectGoal(goal)}
                isGenerating={generatingSteps === goal.id}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Quick Habits</h2>
        
        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex gap-2 mb-6">
            <input
              placeholder="Add a new habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              className="flex-1 px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              onClick={addHabit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No habits yet. Add one above to get started!</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="group relative p-4 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{habit.name}</p>
                      <span className="text-xs text-muted-foreground">{habit.frequency}</span>
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-accent" />
                          <span className="text-xs text-accent font-medium">{habit.streak} day streak</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Goal Detail View
function GoalDetailView({ 
  goal, 
  steps, 
  toggleStep,
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  onBack
}: { 
  goal: Goal;
  steps: Step[];
  toggleStep: (id: string, completed: boolean) => void;
  messages: Message[];
  inputMessage: string;
  setInputMessage: (v: string) => void;
  sendMessage: () => void;
  onBack: () => void;
}) {
  const completedSteps = steps.filter(s => s.completed).length;

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{goal.title}</h1>
        {goal.description && (
          <p className="text-muted-foreground text-lg">{goal.description}</p>
        )}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${goal.progress * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary">{Math.round(goal.progress * 100)}%</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {completedSteps} of {steps.length} steps completed
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-md border border-card-border">
          <h2 className="text-xl font-semibold mb-6">Action Steps</h2>

          {steps.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`group flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${
                    step.completed 
                      ? 'bg-accent/10 border border-accent/20' 
                      : 'bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20'
                  }`}
                >
                  <button
                    onClick={() => toggleStep(step.id, step.completed)}
                    className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      step.completed 
                        ? 'bg-accent text-white' 
                        : 'bg-muted border-2 border-muted-foreground/20 hover:border-accent/50 hover:bg-accent/10'
                    }`}
                  >
                    {step.completed && <Check className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-base font-medium ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {step.title}
                      </p>
                      {step.week && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md ml-2 flex-shrink-0">
                          Week {step.week}
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-card-border flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold">AI Coach</h3>
              <p className="text-xs text-muted-foreground">Ask for guidance</p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-md' 
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                placeholder="Ask about this goal..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button 
                onClick={sendMessage}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Auth Page
function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await api.login(email, password);
      } else {
        await api.register(name, email, password);
      }
      onAuth();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-card-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Habitly</h1>
            <p className="text-muted-foreground">{isLogin ? "Welcome back!" : "Start your journey"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard
function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! I'm your AI habit coach. I can help you stay on track with your goals. How can I assist you today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");
  const [currentView, setCurrentView] = useState<"dashboard" | "goal-detail" | "forum">("dashboard");
  const [generatingSteps, setGeneratingSteps] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadData();
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [goalsData, habitsData] = await Promise.all([api.getGoals(), api.getHabits()]);
      setGoals(goalsData);
      setHabits(habitsData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    try {
      await api.markNotificationRead(notif.id);
      setCurrentView("forum");
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const selectGoal = async (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentView("goal-detail");
    try {
      const stepsData = await api.getSteps(goal.id);
      setSteps(stepsData);
    } catch (err) {
      console.error("Failed to load steps:", err);
    }
  };

  const goToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedGoal(null);
  };

  const goToForum = () => {
    setCurrentView("forum");
    setSelectedGoal(null);
  };

  const createGoal = async () => {
    if (!newGoalTitle.trim()) return;
    try {
      const goal = await api.createGoal({ title: newGoalTitle, description: newGoalDesc });
      setGoals([...goals, goal]);
      setNewGoalTitle("");
      setNewGoalDesc("");
      setShowNewGoal(false);

      setGeneratingSteps(goal.id);
      try {
        await api.generateSteps(goal.id, "medium", "flexible");
        const updatedGoals = await api.getGoals();
        setGoals(updatedGoals);
      } catch (err) {
        console.error("Failed to generate steps:", err);
      } finally {
        setGeneratingSteps(null);
      }
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const toggleStep = async (stepId: string, completed: boolean) => {
    try {
      await api.toggleStep(stepId, !completed);
      setSteps(steps.map(s => s.id === stepId ? { ...s, completed: !completed } : s));
      const updatedGoals = await api.getGoals();
      setGoals(updatedGoals);
    } catch (err) {
      console.error("Failed to toggle step:", err);
    }
  };

  const addHabit = async () => {
    if (!newHabit.trim()) return;
    try {
      const habit = await api.createHabit({ name: newHabit, frequency: "daily" });
      setHabits([...habits, habit]);
      setNewHabit("");
    } catch (err) {
      console.error("Failed to add habit:", err);
    }
  };

  const removeHabit = async (habitId: string) => {
    try {
      await api.deleteHabit(habitId);
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (err) {
      console.error("Failed to remove habit:", err);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedGoal) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: inputMessage };
    setMessages([...messages, userMsg]);
    setInputMessage("");

    try {
      const response = await api.getCoaching(selectedGoal.id, inputMessage);
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: response.coachResponse };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Failed to get coaching:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-72 bg-card border-r border-card-border flex flex-col">
        <div className="p-6 border-b border-card-border">
          <h1 className="text-2xl font-bold text-foreground mb-1">Habitly</h1>
          <p className="text-sm text-muted-foreground">{user.name}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={goToDashboard}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
              currentView === "dashboard" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={goToForum}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
              currentView === "forum" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <span>Community Forum</span>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          <div className="pt-4 pb-2 px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Goals</span>
              <button
                onClick={() => setShowNewGoal(true)}
                className="w-6 h-6 rounded-md bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>

          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => selectGoal(goal)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                selectedGoal?.id === goal.id && currentView === "goal-detail"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              }`}
            >
              <Target className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{goal.title}</div>
                <div className="text-xs text-muted-foreground">{Math.round(goal.progress * 100)}% complete</div>
              </div>
              {generatingSteps === goal.id && (
                <div className="w-4 h-4 border-2 border-t-primary border-gray-200 rounded-full animate-spin"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-card-border space-y-2">
          <button
            onClick={() => setShowNotifications(true)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {currentView === "dashboard" ? (
          <DashboardView 
            goals={goals} 
            habits={habits}
            newHabit={newHabit}
            setNewHabit={setNewHabit}
            addHabit={addHabit}
            removeHabit={removeHabit}
            onSelectGoal={selectGoal}
            generatingSteps={generatingSteps}
          />
        ) : currentView === "forum" ? (
          <ForumView 
            user={user}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />
        ) : (
          <GoalDetailView 
            goal={selectedGoal!}
            steps={steps}
            toggleStep={toggleStep}
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            onBack={goToDashboard}
          />
        )}
      </main>

      {showNotifications && (
        <NotificationsPanel 
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onClose={() => setShowNotifications(false)}
        />
      )}{showNewGoal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl border border-card-border">
        <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal Title</label>
            <input
              type="text"
              placeholder="e.g., Learn Spanish, Run a marathon..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <textarea
              placeholder="Add more context about your goal..."
              value={newGoalDesc}
              onChange={(e) => setNewGoalDesc(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={createGoal}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create Goal
            </button>
            <button
              onClick={() => {
                setShowNewGoal(false);
                setNewGoalTitle("");
                setNewGoalDesc("");
              }}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
);
}
export default function App() {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
const [showLanding, setShowLanding] = useState(true); // ADD THIS LINE
useEffect(() => {
checkAuth();
}, []);
const checkAuth = async () => {
try {
const token = api.getToken();
if (token) {
const userData = await api.getMe();
setUser(userData);
}
} catch (err) {
api.clearToken();
} finally {
setLoading(false);
}
};

const handleGetStarted = () => {
  setShowLanding(false);
};

const handleLogout = () => {
api.clearToken();
setUser(null);
};
if (loading) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Show landing page first
if (showLanding) {
  return <LandingPage onGetStarted={handleGetStarted} />;
}

// Then show auth or dashboard
return (
  <div className="min-h-screen bg-background">
    {user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthPage onAuth={checkAuth} />}
  </div>
);
}