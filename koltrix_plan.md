# KOLTRIX --- Project Development Plan

**Project:** KOLTRIX\
**Description:** A geospatial mapping and spatial-analysis platform
initially focused on Kolkata.\
**Initial study area:** Kolkata district, represented by the user's
existing joined Census 2011 shapefile.\
**Stack:** React, TypeScript, Leaflet, FastAPI, PostgreSQL 18, PostGIS
3.6.2.\
**Database:** `koltrix`.

------------------------------------------------------------------------

## 1. Product vision

KOLTRIX is a geospatial platform for mapping and analysing Kolkata. Its
first release will provide interactive thematic mapping of the existing
Census 2011 dataset. The architecture should support future modules such
as network analysis, accessibility analysis, spatial querying and
additional urban datasets.

This is a growing geospatial product, not merely a static census map.
Keep the first release focused, but make sound architectural choices so
future capabilities can be added without rebuilding the foundation.

### Initial objectives

-   Display the existing joined Census 2011 administrative-boundary
    shapefile for Kolkata.
-   Support the eight indicators listed in this plan.
-   Allow users to switch indicators and change thematic symbology.
-   Provide configurable classification, colour ramps and a dynamic
    legend.
-   Display feature popups and an attribute table.
-   Store and query spatial data in PostgreSQL/PostGIS.
-   Serve GeoJSON to the browser through FastAPI.

### Initial scope exclusions

The first release does not include Census 2001, year comparisons,
rejoining census Excel files, unnecessary recalculation of correct
existing indicators, or network analysis implementation. Network
analysis is a later module and must not delay the initial
thematic-mapping release.

The existing joined shapefile is the source of truth. Inspect its actual
field names, values, geometry type, CRS and extent before
implementation. Do not invent field names or silently change indicator
definitions.

**Study-area note:** use the geographic extent represented by the
supplied Kolkata district shapefile. Do not silently substitute Kolkata
city, Kolkata Metropolitan Area or another administrative boundary.

------------------------------------------------------------------------

## 2. Current environment and database status

  -----------------------------------------------------------------------
  Item                                Status
  ----------------------------------- -----------------------------------
  Operating system                    Windows

  PostgreSQL                          18.4 installed

  PostgreSQL CLI                      `psql` works

  Database                            `koltrix`

  PostGIS                             3.6.2 installed

  PostGIS extension                   Enabled and verified in
                                      `census_webgis` before database
                                      rename

  Current check                       Verify PostGIS in the renamed
                                      `koltrix` database

  Source data                         Existing joined Census 2011
                                      shapefile

  Frontend/backend                    To be scaffolded
  -----------------------------------------------------------------------

Connect to the database:

``` powershell
psql -U postgres -h localhost -d koltrix
```

Verify the current database:

``` sql
SELECT current_database();
```

Verify PostGIS:

``` sql
SELECT PostGIS_Full_Version();
```

PostgreSQL extensions are enabled per database. Renaming a database
normally preserves its extensions, but the verification query is
definitive. If PostGIS is not enabled in `koltrix`, run:

``` sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Do not reinstall PostGIS unless verification shows the software itself
is missing.

------------------------------------------------------------------------

## 3. Technology stack

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React + Vite +          UI and application
                          TypeScript              state

  Map                     Leaflet + React-Leaflet Map rendering and
                                                  interaction

  Styling                 CSS or Tailwind         Application appearance

  Backend                 Python + FastAPI        API and server-side
                                                  logic

  Database                PostgreSQL 18           Relational data storage

  Spatial extension       PostGIS 3.6.2           Geometry storage,
                                                  spatial indexing and
                                                  queries

  Python GIS              GeoPandas, Shapely as   Data inspection and
                          needed                  processing

  Data import/export      GDAL / `ogr2ogr`        Shapefile import and
                                                  GeoJSON conversion

  Database access         SQLAlchemy +            Backend database access
                          GeoAlchemy2 or          
                          parameterized SQL       

  API format              GeoJSON                 Spatial data delivery
                                                  to Leaflet
  -----------------------------------------------------------------------

### Architecture

``` text
React + TypeScript frontend
  - Map and layer controls
  - Indicator selector
  - Symbology editor
  - Dynamic legend
  - Feature popup
  - Attribute table
             |
          HTTP/JSON
             |
FastAPI backend
  - Layer endpoints
  - Indicator metadata
  - Feature queries
  - GeoJSON responses
  - Future spatial-analysis endpoints
             |
          SQL queries
             |
PostgreSQL + PostGIS
  - Kolkata Census 2011 spatial table
  - Geometry and census attributes
  - Spatial indexes
  - Future road-network tables
```

**Design decision:** PostGIS is the authoritative spatial data store.
GeoJSON is the web-delivery format. The production frontend should
request GeoJSON from FastAPI rather than rely on a manually maintained
static file.

------------------------------------------------------------------------

## 4. Data strategy

### 4.1 Preserve the source

Keep the original shapefile and all sidecar files together:

-   `.shp` --- geometry
-   `.shx` --- geometry index
-   `.dbf` --- attributes
-   `.prj` --- CRS information, if supplied

Never overwrite the original. Keep source files separate from generated
and processed files.

### 4.2 Inspect before importing

Record:

1.  Exact source path and component files.
2.  Geometry type.
3.  Feature/record count.
4.  CRS and EPSG code, if known.
5.  Geographic extent and whether it matches the intended Kolkata
    district study area.
6.  Attribute field names and data types.
7.  The actual fields corresponding to the eight indicators.
8.  Missing, null, zero and unusual values.
9.  Geometry validity and empty geometries.
10. A stable unique feature identifier.

Create `docs/data-dictionary.md` with each indicator's actual field,
definition and unit. Do not infer a percentage denominator from a field
name alone.

### 4.3 Import into PostGIS

Import the existing joined shapefile into `koltrix`. Suggested table
name: `kolkata_census_2011`.

Use GDAL `ogr2ogr` or QGIS DB Manager. Confirm the source CRS before
selecting any target CRS. Preserve the source attributes and geometry.
Geometry can be transformed to EPSG:4326 when returning it to Leaflet;
do not unnecessarily discard the original CRS.

After import:

-   Compare database feature count with the source.
-   Confirm geometry type and SRID.
-   Compare representative attribute values.
-   Check null, empty and invalid geometries.
-   Confirm the feature ID.
-   Create a GiST spatial index.

Example SQL (adjust table and geometry column names to the actual
imported schema):

``` sql
SELECT COUNT(*) FROM kolkata_census_2011;

SELECT
    GeometryType(geom),
    ST_SRID(geom),
    COUNT(*)
FROM kolkata_census_2011
GROUP BY GeometryType(geom), ST_SRID(geom);

SELECT COUNT(*)
FROM kolkata_census_2011
WHERE geom IS NULL OR ST_IsEmpty(geom);
```

Example spatial index:

``` sql
CREATE INDEX IF NOT EXISTS kolkata_census_2011_geom_gix
ON kolkata_census_2011
USING GIST (geom);
```

Do not run examples until the real table and geometry column names are
confirmed.

### 4.4 GeoJSON strategy

FastAPI will query PostGIS and return GeoJSON containing feature
geometry and the required properties. Transform geometry to EPSG:4326
for normal Leaflet use.

For initial validation, export a test GeoJSON and open it in QGIS or
another GIS viewer. The production frontend should normally request
GeoJSON from the API.

For larger datasets, add bounding-box filtering and pagination or
another suitable delivery strategy instead of returning every feature
repeatedly.

------------------------------------------------------------------------

## 5. Thematic indicators

Use the exact corresponding fields found in the supplied shapefile for:

1.  Population Density
2.  Sex Ratio
3.  Percentage of Literate Population
4.  Percentage of Literate Female Population
5.  Percentage of Main Workers
6.  Percentage of Marginal Workers
7.  Percentage of Scheduled Caste (SC) Population
8.  Percentage of Scheduled Tribe (ST) Population

Record the actual mappings in `frontend/src/config/indicators.ts`.

For each indicator, define its display label, actual database field,
unit, number formatting, default classification, default class count,
default colour ramp and no-data behaviour.

Use the definitions and denominators specified by the source data and
assignment. Do not reinterpret the literate-female percentage or any
other percentage without checking its documented definition.

------------------------------------------------------------------------

## 6. Development phases

### Phase 1 --- Inspect and prepare Kolkata's spatial data

**Tasks**

1.  Locate the complete source shapefile.
2.  Inspect geometry, CRS, extent, feature count and attribute schema.
3.  Confirm coverage matches the intended Kolkata district study area.
4.  Identify the eight indicator fields.
5.  Check missing values, numeric types, geometry validity and unique
    IDs.
6.  Create `docs/data-dictionary.md`.
7.  Verify PostGIS is enabled in `koltrix`.
8.  Import the shapefile into PostGIS.
9.  Compare imported records and attributes with the source.
10. Create a GiST spatial index.
11. Export a test GeoJSON and validate it in QGIS or another GIS viewer.

**Deliverable:** Verified Kolkata Census 2011 spatial table in PostGIS
and documented field mappings.

**Completion criteria:** Expected polygons and attributes are present,
with known CRS, feature ID and spatial index.

### Phase 2 --- Scaffold the application and display the map

**Tasks**

1.  Create React + Vite + TypeScript frontend.
2.  Create FastAPI backend.
3.  Configure development URLs and CORS.
4.  Add a backend health-check endpoint.
5.  Add an API endpoint returning the Kolkata layer as GeoJSON.
6.  Load the API response in React-Leaflet.
7.  Fit the map to dataset bounds.
8.  Add zoom and pan controls.
9.  Add polygon hover highlighting.
10. Add click popups showing feature attributes.
11. Add a simple basemap switcher.

**Deliverable:** Working web map displaying real Kolkata polygons from
PostGIS through FastAPI.

**Completion criteria:** Map loads from the API, displays the correct
boundaries and supports feature inspection.

### Phase 3 --- Implement the thematic mapping engine

**Tasks**

1.  Create central indicator configuration.
2.  Add selector for the eight indicators.
3.  Read selected values from feature properties.
4.  Calculate class breaks for the selected field.
5.  Implement Equal Interval.
6.  Implement Quantile.
7.  Implement Natural Breaks (Jenks) using a suitable tested library.
8.  Apply the selected colour ramp.
9.  Handle null/non-numeric values as a separate no-data category.
10. Update map and legend when indicator or classification changes.

**Deliverable:** Reusable thematic mapping engine for all eight
indicators.

**Completion criteria:** Switching indicators updates polygon styling
and legend without reloading the application. Class boundaries and
no-data handling are correct.

### Phase 4 --- Build the symbology editor

**Tasks**

1.  Select classification method.
2.  Change number of classes.
3.  Provide sequential colour ramps and suitable diverging ramps where
    appropriate.
4.  Edit class boundaries manually.
5.  Change polygon fill opacity.
6.  Change outline colour and width.
7.  Generate a dynamic legend showing class ranges and colours.
8.  Add reset-to-default-style action.
9.  Keep settings in shared React state so map and legend remain
    synchronized.

**Deliverable:** Interactive symbology panel comparable to the
graduated-colour workflow in desktop GIS software.

**Completion criteria:** Style controls update map and legend correctly.
Manual breaks are respected and invalid break configurations are
rejected.

### Phase 5 --- Build GIS information tools

**Tasks**

1.  Improve feature popups to show useful census attributes.
2.  Add an attribute table.
3.  Select a table row and highlight its map feature.
4.  Select a map feature and identify its table row.
5.  Add basic attribute search/filtering if useful.
6.  Add layer visibility controls if multiple layers are introduced.
7.  Add coordinate display or measurement tools only when useful.

**Deliverable:** GIS workspace for exploring Kolkata's census layer.

**Completion criteria:** Map selection and attribute information stay
synchronized and users can inspect the underlying data.

### Phase 6 --- Harden API and database integration

**Tasks**

1.  Organize FastAPI routes, schemas and services.
2.  Keep database access out of route handlers where practical.
3.  Use parameterized queries.
4.  Return appropriate HTTP errors for invalid fields and missing
    features.
5.  Add loading, empty-data and error states in frontend.
6.  Avoid returning unnecessary columns or excessive geometry.
7.  Add bounding-box filtering or pagination if required.
8.  Store credentials in environment variables, not source code.
9.  Create a restricted database role for normal FastAPI access instead
    of using the PostgreSQL superuser.

**Suggested initial API**

  -----------------------------------------------------------------------------------
  Method                  Endpoint                            Purpose
  ----------------------- ----------------------------------- -----------------------
  GET                     `/api/health`                       Backend health

  GET                     `/api/layers`                       List available layers

  GET                     `/api/layers/kolkata-census-2011`   Return census polygons
                                                              as GeoJSON

  GET                     `/api/indicators`                   Return indicator
                                                              metadata

  GET                     `/api/features/{feature_id}`        Return one feature and
                                                              its attributes
  -----------------------------------------------------------------------------------

The API can evolve. Do not build endpoints the application does not
need.

**Deliverable:** Maintainable backend retrieving spatial data from
PostGIS and serving it to the frontend.

### Phase 7 --- Testing, validation and documentation

**Tasks**

1.  Compare feature counts with source shapefile.
2.  Compare representative attributes with QGIS/ArcGIS.
3.  Verify CRS and geographic extent.
4.  Test all eight indicators.
5.  Test classification methods and class counts.
6.  Check class breaks, legend labels and polygon colours.
7.  Test null values, invalid inputs and missing features.
8.  Test map and attribute-table selection.
9.  Test application startup and database connection.
10. Document data source, database design, processing workflow, API and
    screenshots.
11. Prepare a demonstration of the platform's current capabilities.

**Deliverable:** Tested KOLTRIX thematic-mapping release and supporting
documentation.

**Completion criteria:** Correct Kolkata Census 2011 data is displayed
with reliable thematic mapping and symbology controls.

------------------------------------------------------------------------

## 7. Proposed repository structure

``` text
koltrix/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── MapView.tsx
│       │   ├── LayerPanel.tsx
│       │   ├── IndicatorSelector.tsx
│       │   ├── SymbologyEditor.tsx
│       │   ├── Legend.tsx
│       │   ├── FeaturePopup.tsx
│       │   └── AttributeTable.tsx
│       ├── config/
│       │   └── indicators.ts
│       ├── hooks/
│       │   └── useThematicStyle.ts
│       ├── services/
│       │   └── koltrixApi.ts
│       ├── types/
│       │   └── gis.ts
│       ├── App.tsx
│       └── main.tsx
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── layers.py
│   │   │   ├── indicators.py
│   │   │   └── features.py
│   │   ├── services/
│   │   │   └── spatial_data.py
│   │   ├── db/
│   │   │   └── connection.py
│   │   └── schemas/
│   └── requirements.txt
├── data/
│   ├── source/
│   │   └── kolkata_census_2011/
│   └── processed/
├── scripts/
│   └── inspect_shapefile.py
├── docs/
│   └── data-dictionary.md
├── .gitignore
├── .env.example
├── plan.md
└── README.md
```

Keep the original shapefile unchanged under `data/source/`. Store
generated files under `data/processed/`. Do not commit database
passwords, `.env` files, large generated datasets or unnecessary
intermediate files to Git.

------------------------------------------------------------------------

## 8. Database design and operating practices

The initial spatial table can be named `kolkata_census_2011`, with a
geometry column such as `geom` if supported by the import process.

Before finalizing the schema, inspect actual imported fields. Do not
rename or recast fields blindly.

Recommended practices:

-   Use a primary key or stable unique feature ID.
-   Preserve original census attributes.
-   Preserve correct geometry and SRID.
-   Create a GiST geometry index.
-   Use a restricted database role for FastAPI.
-   Keep credentials in backend environment variables.
-   Use transactions and parameterized queries.
-   Document schema changes.

PostGIS remains the spatial foundation for future KOLTRIX modules.

------------------------------------------------------------------------

## 9. Future module --- Network analysis

Network analysis is a planned expansion, not part of the first
thematic-mapping release.

Potential features:

1.  Import a road-network dataset for the intended study area.
2.  Inspect and prepare road connectivity and topology.
3.  Create network edges/nodes or use a suitable network model.
4.  Assign edge lengths and, where available, travel costs or speeds.
5.  Select origin and destination on the map.
6.  Snap selected points to the network.
7.  Calculate shortest paths.
8.  Display routes and route statistics.
9.  Later consider service areas, accessibility and other network
    analyses.

Possible technologies:

-   NetworkX for initial graph algorithms and prototypes.
-   PostGIS for spatial storage and preprocessing.
-   pgRouting for database-backed routing when appropriate.
-   Leaflet for route visualization.

A genuine shortest-path route must follow connected network edges. A
straight line between two points is not network analysis.

Ensure future road-network coverage matches the intended KOLTRIX study
area. If the platform later expands beyond Kolkata district, document
the scope change and update data coverage deliberately.

------------------------------------------------------------------------

## 10. Milestones and working method

  -----------------------------------------------------------------------
  Milestone                           Result
  ----------------------------------- -----------------------------------
  M1                                  Shapefile inspected; study-area
                                      extent and field dictionary
                                      confirmed

  M2                                  Kolkata Census 2011 layer imported
                                      and verified in PostGIS

  M3                                  GeoJSON successfully returned by
                                      FastAPI

  M4                                  Real Kolkata polygons displayed in
                                      React-Leaflet

  M5                                  Eight indicator configurations
                                      implemented

  M6                                  Classification engine and dynamic
                                      legend working

  M7                                  Symbology editor working

  M8                                  Feature popup and attribute table
                                      working

  M9                                  Validation and initial
                                      documentation completed
  -----------------------------------------------------------------------

### Development rules

1.  Work on one small task at a time.
2.  Use the real shapefile and actual field names; avoid sample data
    after Phase 1.
3.  Do not add unrelated features before core thematic mapping works.
4.  Keep frontend components and backend services modular.
5.  Test each milestone before moving to the next.
6.  Record field mappings, CRS decisions and database changes.
7.  Prefer understandable implementations over unnecessary abstractions.
8.  Keep network analysis as a separate future module.
9.  Never expose database credentials in frontend code or Git.
10. Keep the product name `KOLTRIX` distinct from the lowercase database
    identifier `koltrix`.

------------------------------------------------------------------------

## 11. Immediate next task

**Begin Phase 1, Task 1: inspect the existing joined Census 2011
shapefile for Kolkata.**

Establish:

-   Exact shapefile path and component files.
-   Geometry type and CRS.
-   Feature count and geographic extent.
-   Actual attribute field names and data types.
-   The eight indicator-to-field mappings.
-   Whether a stable unique feature ID exists.
-   Whether the layer's extent matches the intended Kolkata district
    study area.

Then verify PostGIS in the renamed `koltrix` database, import the
shapefile, validate imported records and create the spatial index.

**Current project status:** PostgreSQL 18.4 is installed; database
`koltrix` has been created; PostGIS 3.6.2 was installed and verified
before the database rename. The next action is to verify PostGIS in
`koltrix` and inspect the source shapefile---not to reinstall PostgreSQL
or PostGIS.
