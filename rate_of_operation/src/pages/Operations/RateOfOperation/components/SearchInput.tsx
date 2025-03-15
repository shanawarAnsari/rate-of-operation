import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps {
  searchText: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchText,
  handleSearchChange,
}) => (
  <TextField
    id="search-input"
    variant="outlined"
    size="small"
    placeholder="Search..."
    value={searchText}
    onChange={handleSearchChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    sx={{ width: "300px" }}
  />
);

export default SearchInput;
