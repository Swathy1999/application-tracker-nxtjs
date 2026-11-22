// Use this helper only in Client Components or browser event handlers.
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("careertrack_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("careertrack_token");
    localStorage.removeItem("careertrack_user");
  }
}
