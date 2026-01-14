import { Navigate } from "react-router-dom";
import { auth } from "../firebase/Firebase";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
