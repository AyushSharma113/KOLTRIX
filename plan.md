# KOLTRIX — Updated Project Plan

**Project:** Koltrix  
**Working title:** Kolkata Urban Intelligence Platform  
**Initial release:** v0.1 — Interactive Ward Explorer  
**Primary goal:** Build a web GIS for exploring Kolkata's wards, verified demographic indicators, and public facilities. Later releases may add accessibility and urban analysis when the input data and methods support them.

## 1. Project vision

Koltrix will bring together geographical, demographic, and infrastructure datasets for Kolkata in an interactive web application. Users should be able to explore ward boundaries, compare demographic indicators, view public facilities, and understand the data and methods behind each map.

The first release is a practical ward and facility explorer. It is not an urban-planning recommendation system. Analytical outputs in later releases must state their assumptions and limitations.

## 2. Decisions and prerequisites

Resolve these before publishing real map layers or city statistics:

1. **Study boundary:** Choose Kolkata Municipal Corporation (KMC) or Kolkata district. These are different geographies. Ward, facility, and future road data must use a consistent boundary.
2. **Ward dataset:** Confirm ward count, unique ward identifier, data year, field names, units, definitions, missing values, and geometry validity.
3. **Facility data:** Inventory the available categories, attributes, source dates, geographic coverage, and licenses. Include only categories supported by the actual data.
4. **Data provenance:** Maintain a data register with source, date, coverage, license, processing steps, and known limitations for every dataset.
5. **Repository and environment:** Inspect the existing repository before changing configuration. Confirm Node.js, npm, and Python versions before setup.

These decisions can be resolved during setup and data auditing. The visual dashboard shell may use clearly labelled demo content while the audit is in progress; real statistics and analysis must wait for verified inputs.

## 3. Product principles

1. Validate data before using it to support conclusions.
2. Separate GIS preparation and analysis from interface code.
3. Build incrementally, keeping a working application at each milestone.
4. Document sources, dates, CRS, formulas, classification choices, assumptions, and limitations.
5. Identify all demo or placeholder content; never present it as verified Kolkata data.
6. Keep map components and data access isolated so they can evolve without a full frontend rewrite.
7. Add dependencies and shared state only when the implementation needs them.

## 4. v0.1 product scope

### Included

- Dark, responsive dashboard based on the supplied reference image's composition and visual hierarchy.
- Interactive 2D map of the confirmed study area.
- Ward boundaries, pan and zoom, hover styling, selection, and reset view.
- One active demographic choropleth at a time, for indicators that exist and pass validation.
- Independently toggleable facility categories that exist in the verified data.
- Ward details showing the selected ward's actual available attributes.
- A matching legend with units, data year, class breaks, and a distinct missing-data style.
- Useful facility popups and a selected-facility state where supported by attributes.
- Loading, empty, and error states for data layers.
- Verified summary values only when their sources or calculations are documented.
- Attribution and data/method information accessible from the interface.

### Deferred

Keep these out of v0.1 unless validated data and a clear use case justify them:

- Road-network service areas and accessibility scores.
- Kernel density estimation (KDE) and statistical hotspot analysis.
- Composite vulnerability or infrastructure-gap scores.
- Location-allocation recommendations.
- Backend, database, accounts, notifications, or features unrelated to the first map workflow.

The road network may be omitted from the initial map. Add it when its quality, usefulness, and performance cost have been checked.

## 5. Navigation and dashboard design

Use this single information architecture across the application:

- **Dashboard** — overview and entry point to the map.
- **City Explorer** — ward map, demographics, and facilities; the core v0.1 experience.
- **Data & Methods** — data sources, dates, definitions, processing, and limitations.
- **Spatial Analytics** — later-release analysis; show as “Coming Soon” until available.
- **About Koltrix** — project information.

The dashboard layout has five areas:

1. **Top bar:** Koltrix branding, search when functional, and useful actions. Avoid controls that imply a feature exists when it does not.
2. **Navigation rail:** Primary application sections with clear active states and accessible labels.
3. **Layer and filter panel:** Demographic indicator selection and facility category toggles. Ward selection and facility filters should reflect actual data capabilities.
4. **Central map:** The largest area, with ward geometry, facilities, legend, scale, attribution, and essential controls.
5. **Analytics panel and bottom status:** Overview, Demographics, Infrastructure, and selected Ward Details; compact status for selected ward, active layer, visible facility count, and data state.

Use the reference image for its dark urban dashboard style, layout, and proportions. Replace its Los Angeles zoning content with Kolkata-specific information. Use a 2D map in v0.1; 3D building rendering is not part of the initial Leaflet implementation.

### Visual tokens

| Element | Starting value |
|---|---|
| Main background | `#0D0E16` |
| Sidebar | `#171925` |
| Panels | `#202230` |
| Borders | `#303241` |
| Lime accent | `#B4EB42` |
| Secondary accent | `#36B9E9` |
| Primary text | `#F5F5F5` |
| Secondary text | `#A1A3B2` |
| Typeface | Inter or a suitable available sans-serif |

Use the lime accent selectively for active navigation, selected layers, key values, and primary actions. Maintain readable contrast over the basemap and panels.

## 6. Technology and architecture

| Area | Technology | Initial responsibility |
|---|---|---|
| Frontend | React + Vite | UI and application structure |
| Styling | Tailwind CSS | Layout and visual design |
| Mapping | Leaflet + React-Leaflet | Interactive 2D map |
| Charts | Recharts | Verified demographic and facility summaries |
| Icons | Lucide React | Interface icons |
| GIS preparation | Python, GeoPandas, Shapely | Validation, processing, and export |
| Desktop GIS | Suitable GIS software | Visual inspection and spatial QA |
| Later backend | FastAPI | Server-side API if required |
| Later database | PostgreSQL + PostGIS | Persistent spatial data if required |
| Later network analysis | OSMnx, NetworkX, and/or pgRouting | Routing and service areas |

For v0.1, serve preprocessed GeoJSON as static files. Introduce a backend or spatial database when file size, query patterns, update frequency, or analytical workflows make static delivery inadequate.

Organize map layers, data loading, and calculations into focused modules. Start with local React state and lift state only where components need to share it. Use Context and `useReducer` if the dashboard's shared interactions become cumbersome to coordinate locally.

## 7. Data preparation and quality

### Ward data

The ward dataset reportedly includes population density, sex ratio, literacy, female literacy, main and marginal worker percentages, and Scheduled Caste and Scheduled Tribe percentages. Verify each field, definition, unit, year, and null value before using it. Do not assume a total population field is available.

### Facility data

Potential categories include hospitals, police stations, schools, colleges or institutes, bus stands, markets, and other public or community facilities. Use only categories confirmed in the inventory. Standardize category and subtype values without discarding source attributes needed for traceability.

### Road data

Road data is reserved for later analysis. Check its format, CRS, extent, topology, connectivity, directionality, and routing suitability before using it. A clipped line layer is not automatically a routable network.

### Processing and exports

- Preserve original source files unchanged.
- Record processing steps and exceptions.
- Keep source CRS information; use an appropriate projected CRS for measurements and processing.
- Reproject web map exports to EPSG:4326 as appropriate.
- Validate geometries and document any repairs.
- Check ward identifiers for duplicates, omissions, and consistent types.
- Check facility points against the confirmed study boundary.
- Keep web exports lightweight; simplify geometry carefully and retain required properties.
- Use GeoJSON for the initial exchange format unless dataset size makes it unsuitable.

Suggested data layout:

```text
data/
├── raw/                 # Original data; do not edit in place
├── processed/           # Validated and transformed working data
└── exports/             # Web-ready layers
    ├── wards.geojson
    └── facilities/      # Files determined by the data inventory
```

Do not commit large raw datasets, credentials, local environment files, or generated temporary files. Decide how large data should be distributed if needed.

## 8. Milestones and acceptance criteria

### Milestone 1 — Repository and application foundation

- Inspect existing files and configuration.
- Confirm Node.js, npm, and Python availability.
- Initialize or configure React + Vite without overwriting useful existing work.
- Add the initial dependencies and design tokens.
- Establish a minimal folder structure.

**Complete when:** the application starts locally and renders its base page.

### Milestone 2 — Visual dashboard shell

- Build the top bar, navigation rail, layer panel, analytics panel, and status bar.
- Add a map placeholder with the intended dimensions and styling.
- Add the core responsive layout.
- Label any demo values visibly as sample content.

**Complete when:** the main layout matches the design direction and works at desktop, tablet, and mobile widths.

### Milestone 3 — Data audit and web exports

- Resolve the study boundary and dataset inventory.
- Validate ward fields, identifiers, geometry, CRS, and missing values.
- Standardize the facility categories that actually exist.
- Check facility coverage and export web-ready layers.
- Document sources, dates, licenses, processing, and limitations.

**Complete when:** exported layers load in a GIS viewer and their key properties and exceptions are documented.

### Milestone 4 — Ward map and demographic layers

- Integrate Leaflet and a suitable dark basemap.
- Render wards and implement hover, selection, and reset view.
- Add choropleths for validated indicators.
- Document class breaks and render missing data distinctly.
- Connect Ward Details to actual ward attributes.

**Complete when:** users can identify wards, select each available thematic layer, and read its matching legend and selected-ward values.

### Milestone 5 — Facilities and verified summaries

- Add available facility layers with distinguishable symbols.
- Implement category toggles, supported filters, popups, and selection.
- Calculate ward facility counts using a documented spatial join or equivalent.
- Add charts and overview figures only when derived from verified data.

**Complete when:** visible features and displayed summaries correspond to the validated datasets and documented calculations.

### Milestone 6 — v0.1 release readiness

- Check desktop, tablet, and mobile behavior.
- Review GeoJSON size and map responsiveness.
- Add attribution, data dates, methodology, and limitations.
- Check loading, empty, and error states.
- Verify the production build and update README and project documentation.

**Complete when:** the app builds for production, core interactions work, and the user can identify the source and status of displayed data.

## 9. Later releases

### v0.2 — Accessibility

Prepare and validate a routable road network. Before analysis, define travel mode, impedance, road restrictions, destinations, and origin data. Candidate outputs include 5-, 10-, and 15-minute service areas and nearest-facility measures where assumptions and network quality support them.

A ward intersecting a service area does not mean every resident in that ward is served. Population coverage needs finer-grained population data or a clearly labelled ward-level approximation.

### v0.3 — Facility density and hotspots

Use KDE to estimate point intensity and document bandwidth, cell size, and weighting. Consider Getis-Ord Gi* only when the data and statistical assumptions are appropriate. Explain that density and statistically significant hotspots are different results.

### v0.4 — Infrastructure gap analysis

Define demand and supply indicators before scoring. Document indicator direction, normalization, weights, missing-data handling, and limitations. Consider vulnerability indices or location-allocation only when data supports them. Present modeled sites as analytical candidates, not definitive planning decisions.

### Later backend and database

Adopt PostgreSQL/PostGIS and FastAPI if static data no longer meets performance, query, update, or workflow needs. Design endpoints around demonstrated application requirements rather than fixing an API prematurely.

## 10. Responsive behavior

- **Desktop:** Full navigation rail, layer panel, central map, and analytics panel.
- **Tablet:** Collapsible navigation and layer panel; narrower analytics area.
- **Mobile:** Full-screen map with layer controls in a drawer and analytics in a bottom sheet or separate panel.

Keep map controls usable and avoid letting panels hide essential map information on small screens.

## 11. Repository structure

Create directories as milestones require them; this is the intended direction, not a requirement to create every folder at initialization.

```text
koltrix/
├── frontend/
│   ├── public/data/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── maps/
│       ├── layers/
│       ├── panels/
│       ├── charts/
│       ├── hooks/
│       ├── services/
│       └── utils/
├── gis/
│   ├── preprocessing/
│   ├── accessibility/
│   ├── density/
│   ├── hotspot/
│   └── indicators/
├── data/
│   ├── raw/
│   ├── processed/
│   └── exports/
├── docs/
│   ├── methodology/
│   ├── architecture/
│   └── data-dictionary/
├── backend/             # Add only if and when required
├── database/            # Add only if and when required
└── README.md
```

## 12. Timeline and working method

Treat timing as a planning range, not a deadline. A clean dataset may allow a short audit; inconsistent fields, invalid geometry, or road-network problems can extend later work. Estimate each milestone after inspecting the repository and data rather than relying on a fixed total duration.

For each milestone:

1. State the objective and expected output.
2. Inspect the relevant code or data before changing it.
3. Implement the smallest complete increment.
4. Check the result against that milestone's acceptance criteria.
5. Summarize files changed, how to run the result, and known limitations.
6. Update this plan and project documentation when decisions or scope change.

## 13. Current project status and next actions

**Status:** Milestone 1 (repository and application foundation) is complete. React + Vite is initialized under `frontend/`, planned frontend dependencies are installed, and the app starts locally. The source archives currently found are ward boundaries and roads; no facility dataset was found. The study boundary and GIS data audit remain open.

Recommended next sequence:

1. Confirm whether the study boundary is KMC or Kolkata district.
2. Inspect the ward and road shapefile schemas and validate their extent, CRS, geometry, and coverage using a suitable GIS environment.
3. Locate or source the facility datasets and record their provenance and license.
4. Build Milestone 2 with clearly labelled sample content.
5. Validate and export real data before connecting it to the map.

**First visible product goal:** Display a map of the confirmed Kolkata study area inside the application, then complete the dashboard around it.

**Project tagline:** Koltrix — Understanding Kolkata Through Spatial Intelligence.
