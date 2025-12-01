# PDFreedom - Project Documentation

## 1. Project Overview
**PDFreedom** is a modern, desktop-based PDF manipulation tool designed to mimic the professional aesthetic of Adobe Acrobat. It allows users to view, merge, split, and clone PDF documents within a clean, distraction-free interface.

## 2. Technical Architecture
The project is built as a **Monorepo** with the following structure:

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + pdf-lib (for PDF processing)
- **Desktop Wrapper**: Electron (manages the window and spawns the backend)

### Directory Structure
```
PDFreedom/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/     # Logic for PDF operations
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # pdf-lib integration
│   │   └── app.js           # Express server entry point
│   └── package.json
├── frontend/                # React UI
│   ├── src/
│   │   ├── components/      # Dashboard, Header, Sidebar, PDFViewer
│   │   ├── context/         # ThemeContext
│   │   └── App.jsx          # Main layout
│   ├── tailwind.config.js   # Styling configuration
│   └── package.json
├── electron/                # Electron Main Process
│   ├── electron.js          # Window management & Backend spawning
│   └── preload.js           # IPC bridge (if needed)
├── build/                   # Icons and build artifacts
└── package.json             # Root scripts
```

## 3. Key Features
- **View PDF**: Full-screen, immersive PDF reading with zoom controls and text selection.
- **Merge PDFs**: Combine multiple PDF files into a single document.
- **Split PDF**: Extract specific pages from a PDF.
- **Clone PDF**: Create a duplicate of a PDF file.
- **Dark/Light Mode**: Fully supported themes with smooth transitions.
- **Keyboard Shortcuts**:
    - `Ctrl + (+/-)`: Zoom In/Out
    - `Ctrl + 0`: Reset Zoom
    - `Ctrl + Wheel`: Zoom
    - `Ctrl + C/V/Z`: Standard system commands

## 4. Detailed Technical Specifications

### Key Dependencies
- **Frontend**:
    - `react`, `react-dom`: UI Framework
    - `vite`: Build tool and dev server
    - `tailwindcss`, `postcss`, `autoprefixer`: Styling
    - `lucide-react`: Icons
    - `react-pdf`: PDF rendering
    - `react-dropzone`: File drag-and-drop
    - `axios`: HTTP client
- **Backend**:
    - `express`: Web server framework
    - `cors`: Cross-Origin Resource Sharing
    - `pdf-lib`: PDF manipulation (Merge, Split, Create)
    - `multer`: File upload handling (if applicable, or raw body parsing)
- **Electron**:
    - `electron`: Desktop runtime
    - `electron-is-dev`: Dev/Prod detection
    - `electron-builder`: Installer generation
- **Utilities**:
    - `concurrently`: Run multiple scripts at once
    - `wait-on`: Wait for ports/files before execution

### API Reference (Backend)
The backend runs on `http://localhost:5000` (or configured port).

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/pdf/merge` | Merge multiple PDFs | `files`: [File] |
| `POST` | `/api/pdf/split` | Split PDF by indices | `file`: File, `indices`: [Number] |
| `POST` | `/api/pdf/clone` | Duplicate a PDF | `file`: File |
| `GET` | `/health` | Server health check | N/A |

### Component Architecture
- **`ThemeContext.jsx`**: Manages `isDarkMode` state using local storage and applies the `dark` class to the HTML root.
- **`PDFViewer.jsx`**: Wraps `react-pdf`. Handles page navigation, zoom state (`scale`), and enables the text layer for copy/paste.
- **`Dashboard.jsx`**: The main state container. Manages the list of files, active tool selection, and communicates with the backend.
- **`Sidebar.jsx`**: Navigation component. Updates the `activeTool` state in `App.jsx`.

## 5. Installation & Usage

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    (This installs dependencies for root, frontend, backend, and electron via the `postinstall` script).

2.  **Development Mode**:
    ```bash
    npm run dev
    ```
    This command concurrently starts:
    - Backend API (Port 5000)
    - Frontend Vite Server (Port 3000)
    - Electron Window (Proxying to Port 3000)

3.  **Build for Production**:
    - Windows: `npm run build:win`
    - macOS: `npm run build:mac`
    - Linux: `npm run build:linux`

## 5. Recent Changes & Fixes
- **UI Redesign**: Implemented an "Adobe Acrobat" style layout with a left sidebar, centered header filename, and full-width document view.
- **Backend Restructuring**: Moved `controllers`, `routes`, and `services` into `backend/src` for better organization.
- **Shortcuts**: Added native Electron menu and keyboard listeners for improved usability.
- **Bug Fixes**: Resolved `MODULE_NOT_FOUND` errors by correcting file paths.

## 6. Troubleshooting
- **Backend Error (Module Not Found)**: Ensure all backend source files are in `backend/src`.
- **Electron White Screen**: Ensure the frontend is running on port 3000 before Electron starts (handled by `wait-on` in the dev script).
- **Shortcuts Not Working**: Restart the application to reload the Electron main process.
