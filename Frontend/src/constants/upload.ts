export const DEFAULT_ACCEPT = ".pdf,.docx,.txt,.epub";
export const DEFAULT_LABEL = "Upload document";
export const DEFAULT_HINT = "PDF · DOCX · TXT · EPUB";

export const UPLOAD_ENDPOINT = "/api/v1/upload";
export const UPLOAD_REQUEST_URL_ENDPOINT = "/api/v1/upload/request-url";
export const UPLOAD_FIELD_NAME = "files";

export const EXTENSION_CONTENT_TYPE: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
  ".epub": "application/epub+zip",
};
