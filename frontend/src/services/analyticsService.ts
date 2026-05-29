import type { DocumentAnalyticsResponseDto } from "../api";
import { axiosInstance } from "../config/api";

export const analyticsService = {
    getDocumentsAnalytics: (): Promise<DocumentAnalyticsResponseDto> =>
        axiosInstance.get(`/analytics/documents`) as Promise<DocumentAnalyticsResponseDto>,
}   