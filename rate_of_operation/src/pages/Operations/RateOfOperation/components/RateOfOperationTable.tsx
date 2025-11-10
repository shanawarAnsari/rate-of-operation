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
  CircularProgress,
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
import { useColumnVisibility } from "../hooks/useColumnVisibility";
import { useFilterStore } from "../../../../store/rateOfOperationsFilterStore";
import { useUserStore } from "../../../../store/userStore";
import {
  downloadRecipes,
  searchRecipes,
  updateRecipes,
} from "../../../../services/rate-of-operations";
import useTelemetryEvent from "../../../../components/appInsights/usetelementryEvent";

type Row = Record<string, any>;
type RowKey = string | number;

const RateOfOperationTable: React.FC = () => {
  // ---------- Local UI/Data State ----------
  const [tableData, setTableData] = useState<Row[]>([]);
  const [searchData, setSearchData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // A robust baseline snapshot: seed from BOTH normal data and search results.
  const [originalByKey, setOriginalByKey] = useState<Record<string, Row>>({});

  const [changedRowsData, setChangedRowsData] = useState<Row[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<HTMLElement | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [updateResponse, setUpdateResponse] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Search mode control
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [lastSearchText, setLastSearchText] = useState<string>("");

  // ---------- Global Stores / Hooks ----------
  const {
    selectedCategory,
    selectedReviewedStatus,
    setSelectedCategory,
    setSelectedReviewedStatus,
    filterSelections,
  } = useFilterStore();
  const { user, userAssignedCategories, userAssignedInterfaces } = useUserStore();
  const { trackEvent } = useTelemetryEvent(user);
  const {
    data,
    loading,
    error,
    totalRows,
    pageNumber,
    rowsPerPage,
    setTotalRows,
    reviewedStatus,
    refresh,
    updateReviewedStatus,
    updateRowsPerPage,
    updatePageNumber,
  } = useRecipesData({ enabled: !isSearchActive });
  const { reviewedStatusOptions, refetch } = useReviewedStatusData();
  const {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
    availableColumns,
    priorityColumns,
  } = useColumnVisibility(data);

  // ---------- Helpers: stable key & updates ----------
  const getRowKey = (r: Row): RowKey => r?.RATE_OF_OPERATION_KEY ?? r?.RECIPE_NUMBER;

  const ensureOriginalSnapshots = (rows: Row[] = []) => {
    if (!Array.isArray(rows)) return;
    setOriginalByKey((prev) => {
      const next = { ...prev };
      rows.forEach((r) => {
        const k = getRowKey(r);
        if (k !== undefined && k !== null && !(k in next)) {
          // Deep clone to freeze the baseline
          next[k] = JSON.parse(JSON.stringify(r));
        }
      });
      return next;
    });
  };

  const pickOriginalByKey = (key: RowKey, fallback?: Row | null) => {
    const k = String(key);
    return originalByKey[k] ?? fallback ?? null;
  };

  const getDisplayedRows = () => (searchData?.rows ? (searchData.rows as Row[]) : tableData);

  const updateRowByKey = (arr: Row[], key: RowKey, updater: (row: Row) => Row) => {
    const idx = arr.findIndex((r) => getRowKey(r) === key);
    if (idx === -1) return arr;
    const next = [...arr];
    next[idx] = updater(next[idx]);
    return next;
    // You already used this pattern. Kept for clarity.
  };

  // ---------- Search-aware client pagination ----------
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchPageSize, setSearchPageSize] = useState<number>(rowsPerPage);

  type SearchOverride = {
    reviewedStatus?: string;
    pageNumber?: number;
    rowsPerPage?: number;
    filters?: Record<string, string[]>;
    searchText?: string;
  };

  const handleSearch = async (text: string, override?: SearchOverride) => {
    const rawText = override?.searchText ?? text;
    const trimmed = rawText.trim();

    setLastSearchText(rawText);
    setIsSearchActive(!!trimmed);

    if (!trimmed) {
      setIsSearching(false);
      setSearchData(null);
      setSearchPage(pageNumber);
      setSearchPageSize(rowsPerPage);
      return;
    }

    setIsSearching(true);
    try {
      const page = override?.pageNumber ?? searchPage;
      const size = override?.rowsPerPage ?? searchPageSize;
      const reviewed = override?.reviewedStatus ?? selectedReviewedStatus;
      const filtersToUse = override?.filters ?? filterSelections;

      const response = await searchRecipes({
        searchText: trimmed,
        pageNumber: page,
        rowsPerPage: size,
        reviewedStatus: reviewed,
        filters: filtersToUse,
      });

      // Seed originals with the search page as well
      if (response?.rows) ensureOriginalSnapshots(response.rows);

      setSearchData(response);
      setTotalRows(response?.rowsCount);
    } catch (err) {
      console.error("Search error:", err);
      setSearchData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const onPageChangeWrapped = (page: number) => {
    if (isSearchActive) {
      setSearchPage(page);
      handleSearch(lastSearchText, { pageNumber: page });
    } else {
      updatePageNumber(page);
    }
  };

  const onRowsPerPageChangeWrapped = (rows: number) => {
    if (isSearchActive) {
      setSearchPageSize(rows);
      setSearchPage(1);
      handleSearch(lastSearchText, { rowsPerPage: rows, pageNumber: 1 });
    } else {
      updateRowsPerPage(rows);
    }
  };

  // ---------- Various UI handlers ----------
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleReviewedStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReviewedStatus(event.target.value);
  };

  const handleRefresh = () => {
    if (isSearchActive) {
      handleSearch(lastSearchText);
    } else {
      refresh();
    }
  };
  useEffect(() => {
    handleRefresh();
  }, [filterSelections])
  const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => setFilterAnchorEl(null);

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
  };
  const handleDownloadClose = () => setDownloadAnchorEl(null);

  const handleDownload = async (format: "xlsx" | "csv") => {
    setDownloadAnchorEl(null);
    trackEvent("ButtonClick", {
      featureName: `Export_${format}`,
      page: "/operations/rate-of-operation",
      sessionId: sessionStorage.getItem("telemetry_session_id"),
    });
    try {
      setIsDownloading(true);
      await downloadRecipes({
        fileType: format,
        reviewedStatus,
        filters: filterSelections,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveClick = () => {
    const reviewedRecipes = changedRowsData.filter((recipe) => recipe.ACTION === "REVIEW_MARKED");
    if (reviewedRecipes.length === 0) {
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
    trackEvent("ButtonClick", {
      featureName: `SaveRecepies`,
      page: "/operations/rate-of-operation",
      sessionId: sessionStorage.getItem("telemetry_session_id"),
    });

    setIsSaving(true);
    try {
      const reviewedRecipes = changedRowsData.filter((r) => r.ACTION === "REVIEW_MARKED");
      if (reviewedRecipes.length === 0) return;

      const recipesToSave = reviewedRecipes.map(({ ACTION, ...recipe }) => recipe);
      const response: any = await updateRecipes(recipesToSave);

      setUpdateResponse(response);
      setSnackbarOpen(true);

      if (response && !response.error) {
        setChangedRowsData((prev) => prev.filter((c) => c.ACTION !== "REVIEW_MARKED"));
        if (isSearchActive && lastSearchText.trim()) {
          handleSearch(lastSearchText); // keep search context fresh
        } else {
          refresh();
        }
        refetch();
        setSaveDialogOpen(false);
      } else {
        console.error("Error updating recipes:", response);
      }
    } catch (error) {
      console.error("Error saving recipes:", error);
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

  const handleSaveCancel = () => setSaveDialogOpen(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setUpdateResponse(null);
  };

  // ---------- Update / Review handlers (now by stable key) ----------
  const handleRowUpdate = (
    rowKey: RowKey,
    newValue: number,
    _originalValue: number,
    comments: string
  ) => {
    const displayed = getDisplayedRows();
    const currentIdx = displayed.findIndex((r) => getRowKey(r) === rowKey);
    if (currentIdx === -1) return;
    const currentRow = displayed[currentIdx];

    // Use a robust baseline: from originals if present, else fall back to current row
    const baseline = pickOriginalByKey(rowKey, currentRow) as Row;

    const currentTRO =
      typeof baseline.CURRENT_RO === "number" ? baseline.CURRENT_RO : parseFloat(baseline.CURRENT_RO);
    const validCurrentTRO = isFinite(currentTRO) && !isNaN(currentTRO) ? currentTRO : Number(newValue);

    const newPlanningTime =
      (baseline.RECIPE_BASE_QTY * baseline.PROD_PER_CASE) / baseline.PROD_PER_SU / Number(newValue);

    const roPercentChange = validCurrentTRO !== 0 ? (((Number(newValue) - validCurrentTRO) / validCurrentTRO) * 100).toFixed(2) : 0;

    const applyUpdate = (row: Row): Row => ({
      ...row,
      NEW_RO: Number(newValue),
      NEW_PLANNING_TIME: isFinite(newPlanningTime) ? newPlanningTime.toFixed(2) : row.NEW_PLANNING_TIME,
      RO_PCT_CHANGE: roPercentChange,
      isUpdated: true,
      COMMENT: comments,
      UPDATED_BY: user?.email ?? "Web App User",
      UPDATED_ON: new Date().toISOString(),
    });

    // Update both the base data and search data when relevant
    const updateEverywhere = (key: RowKey, updater: (row: Row) => Row) => {
      setTableData((prev) => updateRowByKey(prev, key, updater));
      setSearchData((prev: any) =>
        prev && Array.isArray(prev.rows)
          ? { ...prev, rows: updateRowByKey(prev.rows, key, updater) }
          : prev
      );
    };

    updateEverywhere(rowKey, applyUpdate);

    // Track change for save payload
    setChangedRowsData((prev) => {
      const changedRowInfo = {
        RATE_OF_OPERATION_KEY: currentRow.RATE_OF_OPERATION_KEY ?? currentRow.RECIPE_NUMBER,
        NEW_RO: Number(newValue),
        RO_PCT_CHANGE: roPercentChange,
        NEW_PLANNING_TIME: isFinite(newPlanningTime) ? newPlanningTime.toFixed(2) : undefined,
        REVIEWED: currentRow.REVIEWED,
        UPDATED_BY: user?.email ?? "Web App User",
        UPDATED_ON: new Date().toISOString(),
        ACTION: "ROW_UPDATE",
        COMMENT: comments,
      };
      const idx = prev.findIndex(
        (c: any) => c.RATE_OF_OPERATION_KEY === changedRowInfo.RATE_OF_OPERATION_KEY
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...changedRowInfo };
        return copy;
      }
      return [...prev, changedRowInfo];
    });
  };

  const handleReview = (rowKey: RowKey) => {
    const displayed = getDisplayedRows();
    const idx = displayed.findIndex((r) => getRowKey(r) === rowKey);
    if (idx === -1) return;
    const currentRow = displayed[idx];

    const resetToOriginal = (row: Row) => {
      const orig = pickOriginalByKey(rowKey, row);
      if (!orig) return row;
      // Keep our snapshot as the true baseline for resets
      return { ...orig, REVIEWED: "N", isUpdated: false };
    };

    const markReviewed = (row: Row): Row => ({
      ...row,
      REVIEWED: "Y - Reviewed from Web App",
      UPDATED_BY: user?.email ?? "Web App User",
      UPDATED_ON: new Date().toISOString(),
    });

    const apply = (row: Row) =>
      row.REVIEWED === "Y - Reviewed from Web App" ? resetToOriginal(row) : markReviewed(row);

    setTableData((prev) => updateRowByKey(prev, rowKey, apply));
    setSearchData((prev: any) =>
      prev && Array.isArray(prev.rows) ? { ...prev, rows: updateRowByKey(prev.rows, rowKey, apply) } : prev
    );

    // Audit payload
    setChangedRowsData((prev) => {
      const newState =
        currentRow.REVIEWED === "Y - Reviewed from Web App" ? "N" : "Y - Reviewed from Web App";
      const action = newState === "N" ? "REVIEW_RESET" : "REVIEW_MARKED";
      const info = {
        RATE_OF_OPERATION_KEY: currentRow.RATE_OF_OPERATION_KEY ?? currentRow.RECIPE_NUMBER,
        NEW_RO: currentRow.NEW_RO,
        RO_PCT_CHANGE: currentRow.RO_PCT_CHANGE,
        NEW_PLANNING_TIME: currentRow.NEW_PLANNING_TIME,
        REVIEWED: newState,
        UPDATED_BY: user?.email ?? "Web App User",
        UPDATED_ON: new Date().toISOString(),
        ACTION: action,
      };
      const i = prev.findIndex((c: any) => c.RATE_OF_OPERATION_KEY === info.RATE_OF_OPERATION_KEY);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], ...info };
        return copy;
      }
      return [...prev, info];
    });
  };

  // ---------- Build the table (search-aware plumbing) ----------
  const {
    table,
    searchText, // shown in SearchInput
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
    // rows:
    searchData && searchData.rows ? searchData.rows : tableData,
    // edit/review handlers:
    handleRowUpdate,
    handleReview,
    // total for pagination:
    searchData
      ? searchData.totalCount ?? searchData.rowsCount ?? (searchData.rows?.length ?? 0)
      : totalRows,
    // column visibility:
    columnVisibility,
    setColumnVisibility,
    // pagination (search-aware values):
    isSearchActive ? searchPage : pageNumber,
    isSearchActive ? searchPageSize : rowsPerPage,
    onPageChangeWrapped,
    onRowsPerPageChangeWrapped,
    // onSearch:
    handleSearch
  );

  // ---------- Sync incoming data into local state & originals ----------
  useEffect(() => {
    // Regular (non-search) data changed
    if (Array.isArray(data) && data.length > 0) {
      const dataWithFlags = data.map((row) => ({ ...row, isUpdated: false }));
      setTableData(dataWithFlags);
      ensureOriginalSnapshots(data);
    } else if (data && typeof data === "object" && "rows" in (data as any) && Array.isArray((data as any).rows)) {
      const rows = (data as any).rows.map((row: any) => ({ ...row, isUpdated: false }));
      setTableData(rows);
      ensureOriginalSnapshots(rows);
    } else if (data === null || data === undefined) {
      // Keep table data as-is when data is temporarily null/undefined
    } else {
      setTableData([]);
    }
  }, [data]);

  // ---------- Derived values for UI ----------
  const displayedTotal = searchData?.totalCount ?? searchData?.rowsCount ?? (searchData?.rows?.length ?? totalRows ?? 0);
  const displayedRowsLength = searchData?.rows?.length ?? tableData.length;

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
      {/* Top bar */}
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
        <SearchInput searchText={searchText} handleSearchChange={handleSearchChange} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Tooltip title="Download" placement="top">
            <IconButton
              disabled={(displayedTotal ?? 0) === 0}
              onClick={handleDownloadClick}
              color="primary"
              sx={{
                mr: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": { borderColor: (theme) => theme.palette.text.primary },
              }}
              aria-label="download"
            >
              {isDownloading ? <CircularProgress size={24} /> : <DownloadRounded style={{ fontSize: "26px" }} />}
            </IconButton>
          </Tooltip>

          {isDownloading ? (
            <CircularProgress size="small" />
          ) : (
            <Menu anchorEl={downloadAnchorEl} open={Boolean(downloadAnchorEl)} onClose={handleDownloadClose}>
              <MenuItem onClick={() => handleDownload("xlsx")}>Download as Excel</MenuItem>
              <MenuItem onClick={() => handleDownload("csv")}>Download as CSV</MenuItem>
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
              "& .MuiInputBase-root": { height: 30, borderRadius: 0 },
            }}
          >
            {userAssignedCategories.map((item) => (
              <MenuItem key={item} value={item} sx={{ fontSize: "0.75rem" }}>
                {item}
              </MenuItem>
            ))}
            <MenuItem value="All" sx={{ fontSize: "0.75rem" }}>
              All
            </MenuItem>
          </TextField>

          <TextField
            size="small"
            select
            label="Reviewed Status"
            value={isSearchActive ? selectedReviewedStatus : reviewedStatus}
            onChange={(e) => {
              const val = (e as any).target.value;
              if (isSearchActive) {
                setSelectedReviewedStatus(val);
                setSearchPage(1);
                handleSearch(lastSearchText, { reviewedStatus: val, pageNumber: 1 });
              } else {
                updateReviewedStatus(val);
                handleReviewedStatusChange(e as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            sx={{ minWidth: 150, "& .MuiInputBase-input": { fontSize: "0.75rem" }, "& .MuiInputBase-root": { height: 30, borderRadius: 0, mr: 1 } }}
          >
            {Array.isArray(reviewedStatusOptions) && reviewedStatusOptions.length > 0
              ? reviewedStatusOptions.map((option: any) => (
                <MenuItem key={option.REVIEWED} value={option.REVIEWED} sx={{ fontSize: "0.75rem" }}>
                  {option.REVIEWED?.toUpperCase()}
                </MenuItem>
              ))
              : null}
            <MenuItem value="All" sx={{ fontSize: "0.75rem" }}>
              All
            </MenuItem>
          </TextField>

          <Tooltip title="Filters" placement="top">
            <Badge
              badgeContent={Object.values(filterSelections).filter((values) => Array.isArray(values) && values.length > 0).length}
              color="secondary"
              sx={{
                "& .MuiBadge-badge": { fontSize: "0.6rem", height: "16px", minWidth: "16px", mr: 1 },
              }}
            >
              <IconButton
                onClick={handleFilterIconClick}
                color="primary"
                sx={{
                  mr: 1,
                  p: 0.25,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "0px",
                  "&:hover": { borderColor: (theme) => theme.palette.text.primary },
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
                mr: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": { borderColor: (theme) => theme.palette.text.primary },
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
                mr: 1,
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
        onApply={() => { }}
        interfaces={userAssignedInterfaces}
      />

      {/* Table */}
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
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <CircularProgress />
            {isSearching && <Typography sx={{ ml: 2 }}>Searching...</Typography>}
          </Box>
        ) : error ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (displayedRowsLength === 0 || (displayedTotal ?? 0) === 0) && !loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
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

      {/* Footer */}
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
        <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
          Total Records: {displayedTotal ?? 0}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="rows-per-page-label" sx={{ fontSize: "0.85rem" }}>
              Rows per page
            </InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={isSearchActive ? searchPageSize : rowsPerPage}
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
              endAdornment: <InputAdornment position="end">of {totalPages}</InputAdornment>,
              inputProps: { style: { width: "40px" }, "aria-label": "page number" },
            }}
            sx={{
              width: "120px",
              "& .MuiOutlinedInput-root": { fontSize: "0.75rem", borderRadius: 0 },
              "& .MuiInputLabel-root": { fontSize: "0.85rem" },
            }}
          />

          <Pagination
            count={totalPages}
            page={isSearchActive ? searchPage : pageNumber}
            onChange={(_, page) => onPageChangeWrapped(page)}
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
        reviewedRecipes={changedRowsData.filter((recipe) => recipe.ACTION === "REVIEW_MARKED")}
        originalData={Object.values(originalByKey)}
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
