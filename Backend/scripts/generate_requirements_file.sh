#!/bin/bash
# Generate requirements.txt from pyproject.toml

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Extract dependencies from pyproject.toml and save to requirements.txt
# Uses Python to parse TOML reliably
python3 - <<'EOF' > requirements.txt
import tomllib
from pathlib import Path

with open("pyproject.toml", "rb") as f:
    data = tomllib.load(f)

dependencies = data.get("project", {}).get("dependencies", [])
dev_dependencies = data.get("dependency-groups", {}).get("dev", [])

print("# Generated from pyproject.toml")
print()

# Write main dependencies
for dep in dependencies:
    print(dep)

# Write dev dependencies with comment
print()
print("# Dev dependencies:")
if dev_dependencies:
    for dep in dev_dependencies:
        print(dep)
EOF

echo "requirements.txt generated successfully!"
