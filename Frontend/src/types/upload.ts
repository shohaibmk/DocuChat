export type UploadStatus = "requesting" | "ready" | "uploaded" | "error" | "canceled";

export type UploadEntry = {
  key: string;
  file: File;
  status: UploadStatus;
  presignedUrl?: string;
  error?: string;
  controller: AbortController;
};
