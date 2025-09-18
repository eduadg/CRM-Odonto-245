import { useState } from "react";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>("");

  const showLoading = (text?: string) => {
    setLoadingText(text || "");
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingText("");
  };

  return {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
  };
};
