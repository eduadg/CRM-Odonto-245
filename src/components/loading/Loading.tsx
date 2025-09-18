"use client";

import React from "react";
import "./Loading.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "white" | "dark";
  text?: string;
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  color = "primary",
  text,
  overlay = false,
}) => {
  const LoadingSpinner = () => (
    <div className={`loading-container ${overlay ? "loading-overlay" : ""}`}>
      <div className={`loading-spinner loading-${size} loading-${color}`}>
        <div className="loading-dot loading-dot-1"></div>
        <div className="loading-dot loading-dot-2"></div>
        <div className="loading-dot loading-dot-3"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  return overlay ? (
    <div className="loading-backdrop">
      <LoadingSpinner />
    </div>
  ) : (
    <LoadingSpinner />
  );
};
