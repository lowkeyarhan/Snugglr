import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { isAuthenticated } from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactElement;
}

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to 404 page if user is not logged in (security measure - don't reveal which routes exist)
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/404" replace />;
  }

  return children;
}
