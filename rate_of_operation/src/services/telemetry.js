import { getApi } from "./common";
export const getAppTelemtry = async (dateRange) => {
    return getApi(`telemetry/getAllTelemetry?startDate=${dateRange.start}&endDate=${dateRange.end}`)
        .then((data) => data)
        .catch((error) => error);
};