import { useState, useEffect, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useReactTable } from "@tanstack/react-table";

export const usePagination = (
  table: ReturnType<typeof useReactTable>,
  totalRows: number
) => {
  const [pageInput, setPageInput] = useState<string>("1");
  // Calculate the total number of pages based on total rows and page size
  const totalPages = useMemo(() => {
    const pageSize = table.getState().pagination.pageSize;
    // Always ensure we have at least 1 page, even if there's no data
    return pageSize > 0 ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1;
  }, [totalRows, table.getState().pagination.pageSize]);

  // Debug logging
  useEffect(() => {
    console.log("Pagination debug:", {
      totalRows,
      pageSize: table.getState().pagination.pageSize,
      calculatedTotalPages: totalPages,
    });
  }, [totalRows, table.getState().pagination.pageSize, totalPages]);

  useEffect(() => {
    table.setPageSize(10);
    setPageInput("1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().pagination.pageIndex]);

  return {
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
    totalPages,
  };
};
