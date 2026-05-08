import axios from "axios";
import type { AxiosResponse } from "axios";
import { UPLOAD_REQUEST_URL_ENDPOINT } from "../constants/upload";

const host = import.meta.env.VITE_API_HOST;
const port = import.meta.env.VITE_API_PORT;
const protocol = import.meta.env.VITE_API_PROTOCOL ?? "http";

if (!host || !port) {
  throw new Error(
    "Missing VITE_API_HOST or VITE_API_PORT. Copy example.env to .env.local and fill in values.",
  );
}

export const API_BASE_URL = `${protocol}://${host}:${port}`;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
});

export type PresignedUrlRequest = {
  sessionId: string;
  filename: string;
  contentType: string;
};

export type PresignedPost = {
  url: string;
  fields: Record<string, string>;
};

export type PresignedUrlResponse = {
  data: PresignedPost;
  message: string;
  status: string;
};

export function requestUploadUrl(
  params: PresignedUrlRequest,
  opts: { signal?: AbortSignal } = {},
): Promise<AxiosResponse<PresignedUrlResponse>> {
  return axiosInstance.post<PresignedUrlResponse>(
    UPLOAD_REQUEST_URL_ENDPOINT,
    {
      session_id: params.sessionId,
      filename: params.filename,
      content_type: params.contentType,
    },
    { signal: opts.signal },
  );
}
