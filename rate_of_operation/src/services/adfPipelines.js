import { getApi } from "./common";

export const runPipeGeneratePredictions = async () => {
    return getApi("dataFactoryPipelines/generatePredictions")
        .then((data) => data)
        .catch((error) => error);
};

export const archiveRates = async () => {
    return getApi("dataFactoryPipelines/archiveRates")
        .then((data) => data)
        .catch((error) => error);
};

export const getPipeRunStatus = async (runId) => {
    return getApi(`dataFactoryPipelines/getPipeRunStatus?runId=${runId}`)
        .then((data) => data)
        .catch((error) => error);
};
export const getPipelineHistory = async (range) => {
    return getApi(`dataFactoryPipelines/getPipelineHistory?historyRange=${range}`)
        .then((data) => data)
        .catch((error) => error);
};




