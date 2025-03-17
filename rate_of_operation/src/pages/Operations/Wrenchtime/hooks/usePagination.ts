import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useReactTable } from "@tanstack/react-table";

export const usePagination = (table: ReturnType<typeof useReactTable>) => {
  const [pageInput, setPageInput] = useState<string>("1");

  useEffect(() => {
    table.setPageSize(10);
    setPageInput("1");
  }, [table]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= table.getPageCount()) {
      table.setPageIndex(pageNumber - 1);
    } else {
      setPageInput((table.getState().pagination.pageIndex + 1).toString());
    }
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value as number;
    table.setPageSize(newSize);
    table.setPageIndex(0);
    setPageInput("1");
  };

  useEffect(() => {
    setPageInput((table.getState().pagination.pageIndex + 1).toString());
  }, [table.getState().pagination.pageIndex]);

  return {
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
  };
};
