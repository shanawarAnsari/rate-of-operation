
import { v4 as uuidv4 } from 'uuid';

const SESSION_STORAGE_KEY = 'telemetry_session_id';

/**
 * Generates a new UUID session ID and stores it in sessionStorage.
 */
export const createNewSessionId = (): string => {
    const sessionId = uuidv4();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
};

/**
 * Retrieves the current session ID from sessionStorage.
 */
export const getSessionId = (): string | null => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
};
