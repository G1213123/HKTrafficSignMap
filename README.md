# HK Traffic Sign Map

A simple interactive map showing traffic sign pole locations in Hong Kong using data from the CSDI Portal.

## Setup

The project consists of:
- `index.html`: The main map page.
- `style.css`: Map styling.
- `script.js`: Logic to fetch data and render the map using Leaflet.js.

## Running the Map

Due to browser security restrictions (CORS), you may not be able to fetch the data if you open `index.html` directly from your file explorer. It is recommended to run a local web server.

### Using Python (easiest):
1. Open a terminal in this folder.
2. Run:
   ```bash
   python -m http.server
   ```
3. Open http://localhost:8000 in your browser.

## Data Source & Auto-Update
- **WFS Service**: [CSDI Portal](https://portal.csdi.gov.hk/)
- **Data Updates**: 
  The map reads layer data from the local cache in `public/data/wfs/` through the internal API route `GET /api/layers`.
  
  To fetch or update the data cache manually:
  1. Run the update script:
     ```bash
     npm run sync-wfs
     ```
  2. This job:
     - Downloads full Hong Kong extent data for all configured layers.
     - Paginates through WFS responses (`startIndex` + `count`) until each layer is complete.
     - Saves one GeoJSON per layer under `public/data/wfs/`.
     - Writes sync metadata to `public/data/wfs/metadata.json`.
  
  **Scheduled Updates (Cron):**
  - A GitHub Actions workflow is included at `.github/workflows/sync-wfs-data.yml`.
  - It runs daily (`0 2 * * *`) and can also be triggered manually.
  - The workflow refreshes cache files and auto-commits updates back to `main`.

## Internal Layer API
- Endpoint: `GET /api/layers?typeName=<layer>&bbox=<south,west,north,east>`
- `typeName` is required.
- `bbox` is optional; if provided, the API filters cached features server-side before returning GeoJSON.
- The map now uses this API instead of directly requesting CSDI WFS.

## Layer Info
- **Layer**: All 51 traffic sign related layers (DTAD series)

