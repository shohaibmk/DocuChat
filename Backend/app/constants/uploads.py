ALLOWED_EXTENSIONS = {".pdf", ".txt", ".doc", ".docx", ".epub"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/epub+zip",
}
MIN_FILES = 1
MAX_FILES = 5
MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024  # 150 MiB
READ_CHUNK_BYTES = 1 * 1024 * 1024
