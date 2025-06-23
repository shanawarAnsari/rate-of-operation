import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Paper,
  Table,
  TableContainer,
  Typography,
  Pagination,
  TextField,
  Select,
  InputLabel,
  InputAdornment,
  MenuItem,
  IconButton,
  Tooltip,
  Menu,
  Badge,
} from "@mui/material";
import { useRateOfOperationTable } from "../hooks/useRateOfOperationTable";
import SearchInput from "./SearchInput";
import ColumnVisibilityControl from "./ColumnVisibilityControl";
import TableHeader from "./TableHeader";
import TableBodyComponent from "./TableBody";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import { FilterAltRounded, SaveRounded, DownloadRounded } from "@mui/icons-material";
import FilterPopper from "./filters/FilterPopper";
import SaveConfirmationDialog from "./SaveConfirmationDialog";
import SnackbarAlert from "./SnackbarAlert";

import { useRecipesData } from "../hooks/useRecipeData";
import { useReviewedStatusData } from "../hooks/useReviewedStatusData";
import { CircularProgress } from "@mui/material";
import { useColumnVisibility } from "../hooks/useColumnVisibility";
import { useFilterStore } from "../../../../store/filterStore";
import { useUserStore } from "../../../../store/userStore";
import {
  downloadRecipes,
  searchRecipes,
  updateRecipes,
} from "../../../../services/rate-of-operations";

interface RateOfOperationTableProps { }

const RateOfOperationTable: React.FC<RateOfOperationTableProps> = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [originalApiData, setOriginalApiData] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [updatedRecords, setUpdatedRecords] = useState<any[]>([]);
  const [changedRowsData, setChangedRowsData] = useState<any[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<HTMLElement | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [updateResponse, setUpdateResponse] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const {
    setFilterSelections,
    selectedCategory,
    selectedReviewedStatus,
    setSelectedCategory,
    setSelectedReviewedStatus,
    filterSelections,
  } = useFilterStore();
  const { user, userAssignedCategories, userAssignedInterfaces } = useUserStore();
  const {
    data,
    loading,
    error,
    totalRows,
    pageNumber,
    rowsPerPage,
    setTotalRows,
    reviewedStatus,
    updateData,
    refresh,
    updateReviewedStatus,
    updateRowsPerPage,
    updatePageNumber,
  } = useRecipesData();
  const { reviewedStatusOptions } = useReviewedStatusData();
  const {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
    availableColumns,
    priorityColumns,
  } = useColumnVisibility(data);



  const handleSearch = async (searchText: string) => {
    if (!searchText.trim()) {
      setIsSearching(false);
      setSearchData(null);
      return;
    }
    setIsSearching(true);
    try {
      const searchPayload = {
        searchText: searchText.trim(),
        pageNumber: pageNumber,
        rowsPerPage: rowsPerPage,
        reviewedStatus: selectedReviewedStatus,
        filters: filterSelections,
      };
      console.log("seachPayload:", JSON.stringify(searchPayload));
      const response = await searchRecipes(searchPayload);
      setSearchData(response);
      setTotalRows(response?.rowsCount)
    } catch (error) {
      console.error("Search error:", error);
      setSearchData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRowUpdate = (rowIndex: number, newValue: number) => {
    setTableData((prev) => {
      const updated = [...prev];
      const currentRow = updated[rowIndex];

      if (!originalApiData[rowIndex]) {
        return prev;
      }

      const originalRowData = originalApiData[rowIndex];
      const originalTRO =
        typeof originalRowData.NEW_RO === "number"
          ? originalRowData.NEW_RO
          : parseFloat(originalRowData.NEW_RO);

      if (isNaN(originalTRO)) {
        return prev;
      }

      const newPlanningTime =
        (originalRowData.RECIPE_BASE_QTY * originalRowData.PROD_PER_CASE) /
        originalRowData.PROD_PER_SU /
        newValue;

      const roPercentChange = (
        ((newValue - originalTRO) / originalTRO) *
        100
      ).toFixed(2);

      updated[rowIndex] = {
        ...currentRow,
        NEW_RO: newValue,
        NEW_PLANNING_TIME: newPlanningTime?.toFixed(2),
        RO_PCT_CHANGE: roPercentChange,
        isUpdated: true,
        UPDATED_BY: user?.email || "Web App User",
        UPDATED_ON: new Date().toISOString(),
      };

      const changedRowInfo = {
        RATE_OF_OPERATION_KEY:
          currentRow.RATE_OF_OPERATION_KEY || currentRow.RECIPE_NUMBER,
        NEW_RO: newValue,
        RO_PCT_CHANGE: roPercentChange,
        NEW_PLANNING_TIME: newPlanningTime?.toFixed(2),
        REVIEWED: currentRow.REVIEWED,
        UPDATED_BY: user?.email || "Web App User",
        UPDATED_ON: new Date().toISOString(),
        ACTION: "ROW_UPDATE",
      };

      setChangedRowsData((prevChanges) => {
        const existingIndex = prevChanges.findIndex(
          (change) =>
            change.RATE_OF_OPERATION_KEY === changedRowInfo.RATE_OF_OPERATION_KEY
        );

        let newChanges;
        if (existingIndex >= 0) {
          newChanges = [...prevChanges];
          newChanges[existingIndex] = {
            ...newChanges[existingIndex],
            ...changedRowInfo,
          };
        } else {
          newChanges = [...prevChanges, changedRowInfo];
        }

        console.log("Updated Row Data:", changedRowInfo);
        console.log("All Changed Rows:", newChanges);
        return newChanges;
      });

      return updated;
    });
  };

  const handleReview = (rowIndex: number) => {
    setTableData((prev) => {
      const updated = [...prev];
      const currentRow = updated[rowIndex];

      if (currentRow.REVIEWED === "Y - Reviewed from Web App") {
        if (!originalApiData[rowIndex]) {
          return prev;
        }

        const originalRowData = originalApiData[rowIndex];
        const resetRow = {
          ...originalRowData,
          REVIEWED: "N",
          isUpdated: false,
        };

        updated[rowIndex] = resetRow;

        const resetRowInfo = {
          RATE_OF_OPERATION_KEY:
            currentRow.RATE_OF_OPERATION_KEY || currentRow.RECIPE_NUMBER,
          NEW_RO: originalRowData.NEW_RO,
          RO_PCT_CHANGE: originalRowData.RO_PCT_CHANGE,
          NEW_PLANNING_TIME: originalRowData.NEW_PLANNING_TIME,
          REVIEWED: "N",
          UPDATED_BY: user?.email || "Web App User",
          UPDATED_ON: new Date().toISOString(),
          ACTION: "REVIEW_RESET",
        };

        setChangedRowsData((prevChanges) => {
          const existingIndex = prevChanges.findIndex(
            (change) =>
              change.RATE_OF_OPERATION_KEY === resetRowInfo.RATE_OF_OPERATION_KEY
          );

          let newChanges;
          if (existingIndex >= 0) {
            newChanges = [...prevChanges];
            newChanges[existingIndex] = {
              ...newChanges[existingIndex],
              ...resetRowInfo,
            };
          } else {
            newChanges = [...prevChanges, resetRowInfo];
          }

          console.log("Review Reset Data:", resetRowInfo);
          console.log("All Changed Rows:", newChanges);
          return newChanges;
        });

        return updated;
      } else {
        updated[rowIndex] = {
          ...currentRow,
          REVIEWED: "Y - Reviewed from Web App",
          UPDATED_BY: user?.email || "Web App User",
          UPDATED_ON: new Date().toISOString(),
        };

        const reviewedRowInfo = {
          RATE_OF_OPERATION_KEY:
            currentRow.RATE_OF_OPERATION_KEY || currentRow.RECIPE_NUMBER,
          NEW_RO: currentRow.NEW_RO,
          RO_PCT_CHANGE: currentRow.RO_PCT_CHANGE,
          NEW_PLANNING_TIME: currentRow.NEW_PLANNING_TIME,
          REVIEWED: "Y - Reviewed from Web App",
          UPDATED_BY: user?.email || "Web App User",
          UPDATED_ON: new Date().toISOString(),
          ACTION: "REVIEW_MARKED",
        };

        setChangedRowsData((prevChanges) => {
          const existingIndex = prevChanges.findIndex(
            (change) =>
              change.RATE_OF_OPERATION_KEY === reviewedRowInfo.RATE_OF_OPERATION_KEY
          );

          let newChanges;
          if (existingIndex >= 0) {
            newChanges = [...prevChanges];
            newChanges[existingIndex] = {
              ...newChanges[existingIndex],
              ...reviewedRowInfo,
            };
          } else {
            newChanges = [...prevChanges, reviewedRowInfo];
          }

          console.log("Review Marked Data:", reviewedRowInfo);
          console.log("All Changed Rows:", newChanges);
          return newChanges;
        });

        return updated;
      }
    });
  };

  const {
    table,
    searchText,
    handleSearchChange,
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
    anchorEl,
    open,
    handleClick,
    handleClose,
    totalPages,
  } = useRateOfOperationTable(
    searchData && searchData.rows ? searchData.rows : tableData,
    handleRowUpdate,
    handleReview,
    searchData
      ? searchData.totalCount || searchData.rowsCount || searchData.rows?.length || 0
      : totalRows,
    columnVisibility,
    setColumnVisibility,
    pageNumber,
    rowsPerPage,
    updatePageNumber,
    updateRowsPerPage,
    handleSearch
  );

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleReviewedStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedReviewedStatus(event.target.value);
  };

  const handleRefresh = () => {
    refresh();
  };

  const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleApplyFilters = (appliedFilters: { [key: string]: string[] }) => {
    setFilters(appliedFilters);
  };

  // Calculate the number of active filters
  const getActiveFiltersCount = () => {
    return Object.values(filterSelections).filter(
      (values) => Array.isArray(values) && values.length > 0
    ).length;
  };
  useEffect(() => {
    getActiveFiltersCount();
  }, [])

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };
  const handleDownload = async (format: "xlsx" | "csv") => {
    setDownloadAnchorEl(null);
    try {
      setIsDownloading(true);
      await downloadRecipes({
        fileType: format,
        reviewedStatus,
        filters: filterSelections,
      });
      setIsDownloading(false);
    } catch (error) {
      console.log(error);
      setIsDownloading(false);
    }
  };
  const handleSaveClick = () => {
    const reviewedRecipes = changedRowsData.filter(
      (recipe) => recipe.ACTION === "REVIEW_MARKED"
    );

    if (reviewedRecipes.length === 0) {
      // Show warning snackbar for no reviewed recipes
      setUpdateResponse({
        success: false,
        results: [],
        totalUpdated: 0,
        totalFailed: 0,
        message: "No reviewed recipes to save!",
        isWarning: true,
      });
      setSnackbarOpen(true);
      return;
    }

    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = async () => {
    setIsSaving(true);
    try {
      const reviewedRecipes = changedRowsData.filter(
        (recipe) => recipe.ACTION === "REVIEW_MARKED"
      );

      if (reviewedRecipes.length === 0) {
        return;
      }

      const recipesToSave = reviewedRecipes.map(({ ACTION, ...recipe }) => recipe);

      console.log("Sending reviewed recipes to API:", recipesToSave);

      const response = await updateRecipes(recipesToSave);

      // Set the response and show snackbar
      setUpdateResponse(response);
      setSnackbarOpen(true);

      if (response && !response.error) {
        console.log("Recipes updated successfully:", response);

        setChangedRowsData((prevChanges) =>
          prevChanges.filter((change) => change.ACTION !== "REVIEW_MARKED")
        );

        refresh();
        setSaveDialogOpen(false);
      } else {
        console.error("Error updating recipes:", response);
      }
    } catch (error) {
      console.error("Error saving recipes:", error);
      // Set error response and show snackbar
      setUpdateResponse({
        success: false,
        results: [],
        totalUpdated: 0,
        totalFailed: 1,
      });
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCancel = () => {
    setSaveDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setUpdateResponse(null);
  };

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setOriginalApiData(JSON.parse(JSON.stringify(data)));
      const dataWithFlags = data.map((row) => ({
        ...row,
        isUpdated: false,
      }));
      setTableData(dataWithFlags);
    } else if (
      data &&
      typeof data === "object" &&
      "rows" in data &&
      Array.isArray(data.rows)
    ) {
      setOriginalApiData(JSON.parse(JSON.stringify(data.rows)));
      const dataWithFlags = data.rows.map((row: any) => ({
        ...row,
        isUpdated: false,
      }));
      setTableData(dataWithFlags);
    } else if (data === null || data === undefined) {
      // Don't clear table data if data is null/undefined    } else {
      setTableData([]);
      setOriginalApiData([]);
    }
  }, [data]);

  return (
    <Box
      sx={{
        width: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        paddingBottom: 2,
        m: 1,
        mx: 2,
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <SearchInput
          searchText={searchText}
          handleSearchChange={handleSearchChange}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Tooltip title="Download" placement="top">
            <IconButton
              disabled={totalRows === 0}
              onClick={handleDownloadClick}
              color="primary"
              sx={{
                marginRight: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": {
                  borderColor: (theme) => theme.palette.text.primary,
                },
              }}
              aria-label="download"
            >
              <DownloadRounded style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>
          {isDownloading ? (
            <CircularProgress size="small" />
          ) : (
            <Menu
              anchorEl={downloadAnchorEl}
              open={Boolean(downloadAnchorEl)}
              onClose={handleDownloadClose}
            >
              <MenuItem onClick={() => handleDownload("xlsx")}>
                Download as Excel
              </MenuItem>
              <MenuItem onClick={() => handleDownload("csv")}>
                Download as CSV
              </MenuItem>
            </Menu>
          )}
          <TextField
            size="small"
            select
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            sx={{
              minWidth: 150,
              "& .MuiInputBase-input": { fontSize: "0.75rem" },
              "& .MuiInputBase-root": {
                height: 30,
                borderRadius: 0,
              },
            }}
          >
            {userAssignedCategories.map((item) => {
              return <MenuItem value={item} sx={{ fontSize: "0.75rem" }}>
                {item}
              </MenuItem>
            })}
            <MenuItem value="All" sx={{ fontSize: "0.75rem" }}>
              All
            </MenuItem>
          </TextField>
          <TextField
            size="small"
            select
            label="Reviewed Status"
            value={reviewedStatus}
            onChange={(e) => {
              updateReviewedStatus(e.target.value);
              handleReviewedStatusChange(e as React.ChangeEvent<HTMLInputElement>);
            }}
            sx={{
              minWidth: 150,
              "& .MuiInputBase-input": { fontSize: "0.75rem" },
              "& .MuiInputBase-root": {
                height: 30,
                borderRadius: 0,
                mr: 1,
              },
            }}
          >
            {Array.isArray(reviewedStatusOptions) && reviewedStatusOptions.length > 0
              ? reviewedStatusOptions.map((option: any) => (
                <MenuItem
                  key={option.REVIEWED}
                  value={option.REVIEWED}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {option.REVIEWED}
                </MenuItem>
              ))
              : null}
            <MenuItem value="All" sx={{ fontSize: "0.75rem" }}>
              All
            </MenuItem>
          </TextField>
          <Tooltip title="Filters" placement="top">
            <Badge
              badgeContent={getActiveFiltersCount()}
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.6rem",
                  height: "16px",
                  minWidth: "16px",
                  mr: 1,
                },
              }}
            >
              <IconButton
                onClick={handleFilterIconClick}
                color="primary"
                sx={{
                  marginRight: 1,
                  p: 0.25,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "0px",
                  "&:hover": {
                    borderColor: (theme) => theme.palette.text.primary,
                  },
                }}
                aria-label="filter"
              >
                <FilterAltRounded style={{ fontSize: "26px" }} />
              </IconButton>
            </Badge>
          </Tooltip>
          <Tooltip title="Save" placement="top">
            <IconButton
              onClick={handleSaveClick}
              color="primary"
              sx={{
                marginRight: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": {
                  borderColor: (theme) => theme.palette.text.primary,
                },
              }}
              aria-label="save"
            >
              <SaveRounded style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reload" placement="top">
            <IconButton
              onClick={handleRefresh}
              color="primary"
              sx={{
                marginRight: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": {},
              }}
              aria-label="refresh"
            >
              <ReplayCircleFilledIcon style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>
          <ColumnVisibilityControl
            table={table}
            anchorEl={anchorEl}
            open={open}
            handleClick={handleClick}
            handleClose={handleClose}
            visibleColumnsCount={visibleColumnsCount}
            totalColumnsCount={totalColumnsCount}
            disableColumns={[]}
            availableColumns={availableColumns}
            priorityColumns={priorityColumns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </Box>
      </Box>
      <FilterPopper
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        data={tableData}
        onApply={handleApplyFilters}
        interfaces={userAssignedInterfaces}
      />
      <TableContainer
        component={Paper}
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          overflowY: "auto",
          width: "100%",
          position: "relative",
          margin: 0,
          maxHeight: "65vh",
        }}
      >
        {loading || isSearching ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
            {isSearching && <Typography sx={{ ml: 2 }}>Searching...</Typography>}
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (tableData.length === 0 || totalRows === 0) && !loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Typography>No data available</Typography>
          </Box>
        ) : (
          <Table
            stickyHeader
            size="small"
            sx={{
              tableLayout: "auto",
              width: "100%",
              "& .MuiTableRow-root": {
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                  transition: "background-color 0.2s ease-in-out",
                },
              },
            }}
            aria-label="rate of operations table"
          >
            <TableHeader headerGroups={table.getHeaderGroups()} />
            <TableBodyComponent rows={table.getRowModel().rows} />
          </Table>
        )}
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
        >
          Total Records: {totalRows || 0}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="rows-per-page-label" sx={{ fontSize: "0.85rem" }}>
              Rows per page
            </InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              label="Rows per page"
              sx={{ fontSize: "0.75rem", borderRadius: 0, mr: -2 }}
            >
              {[5, 10, 20, 35, 50, 100].map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Page"
            variant="outlined"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handlePageInputSubmit();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">of {totalPages}</InputAdornment>
              ),
              inputProps: { style: { width: "40px" }, "aria-label": "page number" },
            }}
            sx={{
              width: "120px",
              "& .MuiOutlinedInput-root": {
                fontSize: "0.75rem",
                borderRadius: 0,
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
              },
            }}
          />
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={(_, page) => {
              updatePageNumber(page);
            }}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      </Box>
      {/* Save Confirmation Dialog */}
      <SaveConfirmationDialog
        open={saveDialogOpen}
        onClose={handleSaveCancel}
        onConfirm={handleSaveConfirm}
        reviewedRecipes={changedRowsData.filter(
          (recipe) => recipe.ACTION === "REVIEW_MARKED"
        )}
        originalData={originalApiData}
        isSaving={isSaving}
      />
      {/* Snackbar Alert */}
      <SnackbarAlert
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        updateResponse={updateResponse}
        autoHideDuration={15000}
      />
    </Box>
  );
};

export default RateOfOperationTable;
