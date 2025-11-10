import { useState, useCallback } from "react";
import {
    runPipeGeneratePredictions,
    archiveRates,
    getPipeRunStatus,
    getPipelineHistory,
} from "../../../../services/adfPipelines";

export const useAdfPipeManager = () => {
    // States for generatePredictions
    const [genLoading, setGenLoading] = useState(false);
    const [genError, setGenError] = useState<Error | null>(null);
    const [genResult, setGenResult] = useState<any>(null);

    // States for archiveRates
    const [archiveLoading, setArchiveLoading] = useState(false);
    const [archiveError, setArchiveError] = useState<Error | null>(null);
    const [archiveResult, setArchiveResult] = useState<any>(null);

    // States for getPipeRunStatus
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusError, setStatusError] = useState<Error | null>(null);
    const [statusResult, setStatusResult] = useState<any>(null);

    // States for getPipelineHistory
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<Error | null>(null);
    const [historyResult, setHistoryResult] = useState<any>(null);

    const generatePredictions = useCallback(async () => {
        setGenLoading(true);
        setGenError(null);
        try {
            const data = await runPipeGeneratePredictions();
            setGenResult(data);
        } catch (err) {
            setGenError(err as Error);
        } finally {
            setGenLoading(false);
        }
    }, []);

    const archiveRatesCall = useCallback(async () => {
        setArchiveLoading(true);
        setArchiveError(null);
        try {
            const data = await archiveRates();
            setArchiveResult(data);
        } catch (err) {
            setArchiveError(err as Error);
        } finally {
            setArchiveLoading(false);
        }
    }, []);

    const getRunStatus = useCallback(async (runId: string) => {
        setStatusLoading(true);
        setStatusError(null);
        try {
            const data = await getPipeRunStatus(runId);
            setStatusResult(data);
        } catch (err) {
            setStatusError(err as Error);
        } finally {
            setStatusLoading(false);
        }
    }, []);

    const getHistory = useCallback(async (range: string) => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const data = await getPipelineHistory(range);
            setHistoryResult(data);
        } catch (err) {
            setHistoryError(err as Error);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    return {
        // generatePredictions
        generatePredictions,
        genLoading,
        genError,
        genResult,

        // archiveRates
        archiveRatesCall,
        archiveLoading,
        archiveError,
        archiveResult,

        // getPipeRunStatus
        getRunStatus,
        statusLoading,
        statusError,
        statusResult,

        // getPipelineHistory
        getHistory,
        historyLoading,
        historyError,
        historyResult,
    };
};
