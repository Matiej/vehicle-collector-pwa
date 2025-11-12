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

export async function getSession(sessionPublicId: string) {
    const { data } = await api.get<SessionResponse>(`/sessions/${sessionPublicId}`);
    return data;
}


export async function closeSession(sessionPublicId: string, status: 'CLOSED' | 'OPEN' | 'ERROR') {
    const { data } = await api.put<SessionResponse>(`/sessions/${sessionPublicId}`, null, {
        params: { sessionStatus: status }
    });
    return data;
}