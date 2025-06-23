import { useState, useEffect, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useReactTable } from "@tanstack/react-table";

export const usePagination = (
  table: ReturnType<typeof useReactTable>,
  totalRows: number,
  currentPageNumber: number,
  currentRowsPerPage: number,
  onPageChange: (page: number) => void,
  onRowsPerPageChange: (rows: number) => void
) => {
  const [pageInput, setPageInput] = useState<string>(currentPageNumber.toString());

  const totalPages = useMemo(() => {
    return currentRowsPerPage > 0
      ? Math.max(1, Math.ceil(totalRows / currentRowsPerPage))
      : 1;
  }, [totalRows, currentRowsPerPage]);

  useEffect(() => {
    setPageInput(currentPageNumber.toString());
  }, [currentPageNumber]);

  useEffect(() => {
    table.setPageCount(totalPages);
  }, [totalPages, table]);

  useEffect(() => {
    table.setPageIndex(currentPageNumber - 1);
    table.setPageSize(currentRowsPerPage);
  }, [currentPageNumber, currentRowsPerPage, table]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    } else {
      setPageInput(currentPageNumber.toString());
    }
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value as number;
    onRowsPerPageChange(newSize);
    setPageInput("1");
  };

  return {
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
    totalPages,
  };
};
