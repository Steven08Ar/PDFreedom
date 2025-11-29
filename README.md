# PDFreedom

PDFreedom is a professional desktop application for viewing, editing, merging, splitting, and cloning PDFs. Built with Electron, React, and Node.js.

## Features

- **View PDF**: High-quality PDF rendering.
- **Merge PDFs**: Combine multiple PDF files into one.
- **Split PDF**: Extract pages from a PDF.
- **Clone PDF**: Duplicate PDF files.
- **Edit PDF**: Add text, annotations, and highlights.
- **Cross-Platform**: Runs on Windows, macOS, and Linux.

## Project Structure

- `frontend/`: React application (UI).
- `backend/`: Node.js Express server (PDF processing).
- `electron/`: Main Electron process.

## Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
   This will automatically install dependencies for root, frontend, and backend.

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   This starts the backend, frontend, and Electron window concurrently.

## Build

To create a distributable executable:

- **Windows**: `npm run build:win`
- **macOS**: `npm run build:mac`
- **Linux**: `npm run build:linux`
- **All**: `npm run build`

The output files will be in the `build/` directory.

## Architecture

The application uses a split architecture:
- **Frontend**: React handles the UI and sends requests to the backend.
- **Backend**: An Express server running locally handles heavy PDF operations using `pdf-lib`.
- **Electron**: Wraps everything into a desktop experience and manages the lifecycle.