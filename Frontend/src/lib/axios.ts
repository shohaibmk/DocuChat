import axios from "axios";
import type { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from "axios";
import { UPLOAD_ENDPOINT, UPLOAD_FIELD_NAME } from "../constants/upload";

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

export type UploadProgress = { loaded: number; total: number | undefined };

export type UploadOptions = {
  signal?: AbortSignal;
  onProgress?: (p: UploadProgress) => void;
};

export function uploadDocument<T = unknown>(
  file: File,
  opts: UploadOptions = {},
): Promise<AxiosResponse<T>> {
  const form = new FormData();
  form.append(UPLOAD_FIELD_NAME, file, file.name);

  const config: AxiosRequestConfig = {
    signal: opts.signal,
    onUploadProgress: (e: AxiosProgressEvent) =>
      opts.onProgress?.({ loaded: e.loaded, total: e.total }),
  };

  return axiosInstance.post<T>(UPLOAD_ENDPOINT, form, config);
}
