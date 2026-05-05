import logging
import sys
import os
from logging.config import dictConfig

PLAIN_FORMAT = "[%(asctime)s] | %(levelname)-8s | %(name)s | %(message)s"
COLOR_FORMAT = (
    "{cyan}[%(asctime)s]{reset} {white}|{reset} "
    "{level}%(levelname)-8s{reset} {white}|{reset} "
    "%(name)s {white}|{reset} {level}%(message)s{reset}"
)
DATE_FORMAT = "%Y-%m-%d %H:%M:%S %Z"

RESET = "\x1b[0m"
CYAN = "\x1b[36m"
WHITE = "\x1b[37m"
LEVEL_COLORS = {
    logging.DEBUG: "\x1b[34m",      # blue
    logging.INFO: "\x1b[32m",       # green
    logging.WARNING: "\x1b[33m",    # yellow
    logging.ERROR: "\x1b[31m",      # red
    logging.CRITICAL: "\x1b[1;31m", # bold red
}


class ColorFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        level_color = LEVEL_COLORS.get(record.levelno, "")
        fmt = COLOR_FORMAT.format(cyan=CYAN, white=WHITE, level=level_color, reset=RESET)
        formatter = logging.Formatter(fmt, datefmt=DATE_FORMAT)
        return formatter.format(record)


_configured = False


def configure_logging() -> None:
    global _configured
    if _configured:
        return

    debug: bool = os.getenv("DEBUG", "false").lower() in {"1", "true", "yes"}
    level: str = os.getenv("LOG_LEVEL", "INFO")
    use_color = sys.stdout.isatty()
    formatter_name = "color" if use_color else "default"

    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": PLAIN_FORMAT,
                    "datefmt": DATE_FORMAT,
                },
                "color": {
                    "()": "app.core.logging.ColorFormatter",
                },
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "stream": sys.stdout,
                    "formatter": formatter_name,
                    "level": level,
                },
            },
            "loggers": {
                "app": {"level": level, "handlers": ["console"], "propagate": False},
                "uvicorn": {"level": level, "handlers": ["console"], "propagate": False},
                "uvicorn.error": {"level": level, "handlers": ["console"], "propagate": False},
                "uvicorn.access": {"level": level, "handlers": ["console"], "propagate": False},
                "sqlalchemy.engine": {
                    "level": "INFO" if debug else "WARNING",
                    "handlers": ["console"],
                    "propagate": False,
                },
            },
            "root": {"level": level, "handlers": ["console"]},
        }
    )
    _configured = True


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
