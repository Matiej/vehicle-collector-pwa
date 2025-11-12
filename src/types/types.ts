export type SortDir = 'ASC' | 'DESC';


export type SessionStatus = 'CREATED' | 'OPEN' | 'CLOSED' | 'ERROR';
export type SessionMode = 'SPOT' | 'BULK';


export interface SessionAssetDto {
    assetPublicId: string;
    type: string; // image | audio (na teraz image)
    status: string; // RAW, VECTORIZED, TRANSCRIBED, ERROR
    thumbnailUrl?: string | null;
}


export interface SessionResponse {
    sessionPublicId: string;
    sessionName?: string | null;
    mode: SessionMode;
    ownerId: string;
    spotId?: string | null;
    sessionStatus: SessionStatus;
    createdAt: string; // ISO
    assets: SessionAssetDto[];
}


export interface SessionSummaryResponse {
    sessionPublicId: string;
    sessionName?: string | null;
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
    lat: number | string;
    lng: number | string;
}


export interface AssetResponse {
    assetPublicId: string;
    ownerId: string;
    sessionPublicId?: string | null;
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
    sessionName?: string;
    clientVersion?: string;
}