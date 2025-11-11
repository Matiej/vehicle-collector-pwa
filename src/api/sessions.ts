import { api } from '../lib/api';
import type { SortDir, SessionSummaryResponse, CreateSessionRequest, SessionResponse } from '../types/types';

export async function listSessions(ownerId: string, page = 0, size = 50, sortDir: SortDir = 'DESC') {
    const { data } = await api.get<SessionSummaryResponse[]>(`/sessions`, {
        params: { ownerId, page, size, sortDir }
    });
    return data;
}

export async function createSession(req: CreateSessionRequest) {
    const { data } = await api.post<SessionResponse>(`/sessions`, req);
    return data;
}

export async function getSession(sessionId: string) {
    const { data } = await api.get<SessionResponse>(`/sessions/${sessionId}`);
    return data;
}


export async function closeSession(sessionId: string, status: 'CLOSED' | 'OPEN' | 'ERROR') {
    const { data } = await api.put<SessionResponse>(`/sessions/${sessionId}`, null, {
        params: { sessionStatus: status }
    });
    return data;
}