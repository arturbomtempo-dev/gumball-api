export interface ErrorResponse {
    statusCode: number;
    error: string;
    message: string | string[];
    path: string;
    timestamp: string;
}
