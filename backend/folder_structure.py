from pathlib import Path

# Base directory
BASE_DIR = Path("./")

# Folder structure
dirs = [
    BASE_DIR / "app" / "api",
    BASE_DIR / "app" / "excel",
    BASE_DIR / "app" / "models",
]

# Files to create
files = [
    BASE_DIR / "app" / "main.py",
    BASE_DIR / "app" / "api" / "upload.py",
    BASE_DIR / "app" / "excel" / "loader.py",
    BASE_DIR / "app" / "excel" / "parser.py",
    BASE_DIR / "app" / "excel" / "dependencies.py",
    BASE_DIR / "app" / "excel" / "exporter.py",
    BASE_DIR / "app" / "models" / "sheet.py",
    BASE_DIR / "requirements.txt",
]

# Create directories
for directory in dirs:
    directory.mkdir(parents=True, exist_ok=True)

# Create files
for file in files:
    file.touch(exist_ok=True)

print("✅ Backend folder structure created successfully!")
