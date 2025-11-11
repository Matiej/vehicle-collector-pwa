export type SortDir = 'ASC' | 'DESC';


export type SessionStatus = 'CREATED' | 'OPEN' | 'CLOSED' | 'ERROR';
export type SessionMode = 'SPOT' | 'BULK';


export interface SessionAssetDto {
    id: string;
    type: string; // image | audio (na teraz image)
    status: string; // RAW, VECTORIZED, TRANSCRIBED, ERROR
    thumbnailUrl?: string | null;
}


export interface SessionResponse {
    sessionId: string;
    mode: SessionMode;
    ownerId: string;
    spotId?: string | null;
    status: SessionStatus;
    createdAt: string; // ISO
    assets: SessionAssetDto[];
}


export interface SessionSummaryResponse {
    sessionId: string;
    sessionMode: SessionMode;
    ownerId: string;
    assetsCount: number;
    coverThumbnailUrl?: string | null;
    sessionStatus: SessionStatus;
    createdAt: string;
}


export type AssetStatus = 'RAW' |'VECTORIZED' | 'TRANSCRIBED' | 'ERROR';
export type AssetType = 'IMAGE' | 'AUDIO';  


export interface AssetLocation {
    locationSource: 'EXIF' | 'UPLOAD' | 'DEVICE' | 'UNKNOWN';
    lat: string;
    lng: string;
}


export interface AssetResponse {
    id?: string | null;
    assetPublicId: string;
    ownerId: string;
    sessionId?: string | null;
    spotId?: string | null;
    assetType: AssetType;
    assetStatus: AssetStatus;
    thumbUrl: string;
    geoLocation: AssetLocation;
    createdAt: string; // ISO
}


export interface AssetsResponse {
    assets: AssetResponse[];
    page?: number | null;
    size?: number | null;
    totalCount?: number | null;
    totalPages?: number | null;
}


export interface CreateSessionRequest {
    ownerId: string;
    mode: SessionMode; // w MVP zawsze 'BULK'
    device?: string;
}