import { downloadAsExcelApi, getApi, postApi } from "./common";

export const getWrenchtimeData = async (req) => {
  return postApi("wrenchtime/getWrenchtime", req)
    .then((data) => data)
    .catch((error) => error);
};

export const getWrenchtimeFilters = async () => {
  return getApi("wrenchtime/getFilters")
    .then((data) => data)
    .catch((error) => error);
};

export const getWrenchtimeCategories = async () => {
  return getApi("wrenchtime/getCategories")
    .then((data) => data)
    .catch((error) => error);
};

export const getWrenchtimeReviewedStatus = async () => {
  return getApi("wrenchtime/getReviewedStatus")
    .then((data) => data)
    .catch((error) => error);
};

export const searchWrenchtimeData = async (req) => {
  return postApi("wrenchtime/search", req)
    .then((data) => data)
    .catch((error) => error);
};

export const updateWrenchtimeData = async (req) => {
  return postApi("wrenchtime/updateWrenchtime", req)
    .then((data) => data)
    .catch((error) => error);
};

export const downloadWrenchtimeData = async (req) => {
  try {
    const fileType = req.fileType || "csv";
    const response = await downloadAsExcelApi("wrenchtime/downloadWrenchtime", req);

    // Create filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `wrenchtime-data-${timestamp}.${fileType}`;

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
