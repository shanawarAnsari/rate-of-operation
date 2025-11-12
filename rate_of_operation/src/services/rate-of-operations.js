import { downloadAsExcelApi, getApi, postApi } from "./common";

export const getRecipies = async (req) => {
  return postApi("rate-of-operations/getRecipies", req)
    .then((data) => data)
    .catch((error) => error);
};
// Legacy endpoints (keep for backward compatibility)
export const getModelMetricesROP = async (req) => {
  return getApi("rate-of-operations/getModelData", req)
    .then((data) => data)
    .catch((error) => error);
};

export const getModelMetricesST = async (req) => {
  return getApi("wrenchtime/getModelData", req)
    .then((data) => data)
    .catch((error) => error);
};

// New structured endpoints for Rate of Operations
export const getAvailableMonths = async (modelType = "ROP") => {
  const endpoint =
    modelType === "ROP"
      ? "rate-of-operations/available-months"
      : "wrenchtime/available-months";
  return getApi(endpoint)
    .then((data) => data)
    .catch((error) => error);
};

export const getMetricCards = async (modelType = "ROP", selectedMonth) => {
  const endpoint =
    modelType === "ROP"
      ? "rate-of-operations/metric-cards"
      : "wrenchtime/metric-cards";
  const params = selectedMonth ? { selectedMonth } : {};
  return getApi(endpoint, params)
    .then((data) => data)
    .catch((error) => error);
};

export const getMonthlyTrends = async (modelType = "ROP") => {
  const endpoint =
    modelType === "ROP"
      ? "rate-of-operations/monthly-trends"
      : "wrenchtime/monthly-trends";
  return getApi(endpoint)
    .then((data) => data)
    .catch((error) => error);
};

export const getGroupedMetrics = async (options = {}) => {
  const {
    modelType = "ROP",
    groupBy = "INTERFACE",
    selectedMonth,
    selectedGroups,
  } = options;

  const endpoint =
    modelType === "ROP"
      ? "rate-of-operations/grouped-metrics"
      : "wrenchtime/grouped-metrics";

  const params = {
    groupBy,
    ...(selectedMonth && { selectedMonth }),
    ...(selectedGroups && { selectedGroups: selectedGroups.join(",") }),
  };

  return getApi(endpoint, params)
    .then((data) => data)
    .catch((error) => error);
};

export const getTrendsGroupedMetrics = async (options = {}) => {
  const { modelType = "ROP", groupBy = "INTERFACE", selectedGroups } = options;

  const endpoint =
    modelType === "ROP"
      ? "rate-of-operations/trends-grouped-metrics"
      : "wrenchtime/trends-grouped-metrics";

  const params = {
    groupBy,
    ...(selectedGroups && { selectedGroups: selectedGroups.join(",") }),
  };

  return getApi(endpoint, params)
    .then((data) => data)
    .catch((error) => error);
};

export const getFilters = async () => {
  return getApi("rate-of-operations/getFilters")
    .then((data) => data)
    .catch((error) => error);
};
export const getCategories = async () => {
  return getApi("rate-of-operations/getCategories")
    .then((data) => data)
    .catch((error) => error);
};
export const getReviewedStatus = async () => {
  return getApi("rate-of-operations/getReviewedStatus")
    .then((data) => data)
    .catch((error) => error);
};

export const searchRecipes = async (req) => {
  return postApi("rate-of-operations/search", req)
    .then((data) => data)
    .catch((error) => error);
};

export const updateRecipes = async (req) => {
  return postApi("rate-of-operations/updateRecipies", req)
    .then((data) => data)
    .catch((error) => error);
};

export const downloadRecipes = async (req) => {
  try {
    const fileType = req.fileType || "csv";
    const response = await downloadAsExcelApi(
      "rate-of-operations/downloadRecipes",
      req
    );

    // Create filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `rate-of-operations-${timestamp}.${fileType}`;

    // Create blob with appropriate MIME type
    let blob;
    if (fileType === "xlsx") {
      blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } else if (fileType === "csv") {
      blob = new Blob([response], {
        type: "text/csv;charset=utf-8;",
      });
    } else {
      throw new Error("Unsupported file type");
    }

    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(url);

    return { success: true, message: "File downloaded successfully" };
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};
