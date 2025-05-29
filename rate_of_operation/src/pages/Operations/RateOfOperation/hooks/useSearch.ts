import { useState, useCallback } from "react";

export const useSearch = (onSearchTriggered?: (searchText: string) => void) => {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);

      // Clear any existing timeout
      const timeoutId = setTimeout(() => {
        setDebouncedSearchText(value);
        if (onSearchTriggered) {
          onSearchTriggered(value);
        }
      }, 700);

      // Cleanup timeout on next keystroke
      return () => clearTimeout(timeoutId);
    },
    [onSearchTriggered]
  );

  return {
    searchText,
    debouncedSearchText,
    handleSearchChange,
    setSearchText,
  };
};
