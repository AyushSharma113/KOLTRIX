$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$source = Join-Path $repoRoot 'data/raw/utm_road/road_utm.shp'
$output = Join-Path $repoRoot 'frontend/public/data/roads.geojson'

if (-not (Test-Path -LiteralPath $source)) {
  throw "Road shapefile not found at '$source'. Extract data/utm_road.zip into data/raw/utm_road first."
}

$outputDirectory = Split-Path -Parent $output
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

& ogr2ogr -f GeoJSON -t_srs EPSG:4326 -lco RFC7946=YES -lco COORDINATE_PRECISION=6 $output $source
if ($LASTEXITCODE -ne 0) {
  throw "ogr2ogr failed with exit code $LASTEXITCODE."
}

Write-Output "Converted road features to $output (EPSG:4326)."
