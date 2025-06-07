import { useState, useCallback, useEffect } from "react";

export const useSearch = (onSearchTriggered?: (searchText: string) => void) => {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== debouncedSearchText) {
        setDebouncedSearchText(searchText);
        if (onSearchTriggered) {
          onSearchTriggered(searchText);
        }
      }
    }, 700);

    // Cleanup timeout on component unmount or searchText change
    return () => clearTimeout(timeoutId);
  }, [searchText, debouncedSearchText, onSearchTriggered]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );
  return {
    searchText,
    debouncedSearchText,
    handleSearchChange,
    setSearchText,
  };
};
