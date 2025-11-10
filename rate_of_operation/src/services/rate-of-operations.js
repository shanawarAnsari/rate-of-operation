import { downloadAsExcelApi, getApi, postApi } from "./common";

export const getRecipies = async (req) => {
  return postApi("rate-of-operations/getRecipies", req)
    .then((data) => data)
    .catch((error) => error);
};
export const getModelMetricesROP = async (req) => {
  return postApi("rate-of-operations/getMonitorData", req)
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
    const response = await downloadAsExcelApi("rate-of-operations/downloadRecipes", req);

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
