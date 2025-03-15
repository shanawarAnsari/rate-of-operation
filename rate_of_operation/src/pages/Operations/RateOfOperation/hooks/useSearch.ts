import { useState } from "react";

export const useSearch = () => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    // Implement filtering logic here or in a useEffect
  };

  return {
    searchText,
    handleSearchChange,
  };
};
