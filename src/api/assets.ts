import { api } from '../lib/api';
import type { AssetsResponse, AssetType } from '../types/types';

export async function listAssetsByOwner(ownerId: string, query?: { page?: number; size?: number; sortDir?: 'ASC' | 'DESC'; type?: AssetType; hasSpot?: boolean; status?: string }) {
    const { data } = await api.get<AssetsResponse>(`/assets/owner/${ownerId}`, { params: query });
    return data;
}

export async function listAssetsBySession(sessionPublicId: string, query?: { page?: number; size?: number; sortDir?: 'ASC' | 'DESC' }) {
    const { data } = await api.get<AssetsResponse>(`/assets/session/${sessionPublicId}`, { params: query });
    return data;
}

export async function uploadAsset({
  sessionPublicId,
  ownerId,
  file,
  type,
}: {
  sessionPublicId: string;
  ownerId: string;
  file: File;
  type: 'IMAGE' | 'AUDIO';
}) {
  const form = new FormData();
  form.append('file', file); // only file here

  const { data } = await api.post(
    `/sessions/${sessionPublicId}/assets`,
    form,                                 // <-- body = FormData
    { params: { ownerId, type } }         // <-- query params (bo @RequestParam w BE)
  );
  return data;
}