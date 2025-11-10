import { getApi } from "./common";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getReviewStatus = async (type, groupBy) => {
    return getApi(`review-status/getReviewStatus?type=${type}&groupBy=${groupBy}`)
        .then((data) => data)
        .catch((error) => error);
};


export const downloadWindShuttle = async () => {
    try {
        const response = await axios.post(
            `${BASE_URL}/review-status/downloadWindschuttleScripts`,
            {},
            {
                responseType: "blob", // Important: treat response as a binary blob
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            }
        );

        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        // Use the filename from the response header if available
        const contentDisposition = response.headers["content-disposition"];
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        let filename = `windschuttlescript_${timestamp}.zip`;
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match && match[1]) {
                filename = match[1];
            }
        }

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true, message: "ZIP file downloaded successfully" };
    } catch (error) {
        console.error("Download error:", error);
        throw error;
    }
};