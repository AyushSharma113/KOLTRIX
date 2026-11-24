# Step 1 — Inspect the new master layout

import arcpy

aprx = arcpy.mp.ArcGISProject("CURRENT")

# Find the master layout
layout = aprx.listLayouts("Thematic_Master_Layout")[0]

print("\n========== LAYOUT ==========")
print("Name:", layout.name)
print("Page:", layout.pageWidth, "x", layout.pageHeight)

print("\n========== LAYOUT ELEMENTS ==========")

for el in layout.listElements():
    print(
        "Name:", el.name,
        "| Type:", el.type,
        "| Position:", round(el.elementPositionX, 2),
        round(el.elementPositionY, 2)
    )

    if el.type == "TEXT_ELEMENT":
        print("   Text:", el.text)

    elif el.type == "MAPFRAME_ELEMENT":
        print("   Map:", el.map.name)

        for lyr in el.map.listLayers():
            if lyr.isFeatureLayer:
                print("   Layer:", lyr.name)

                try:
                    print("   Features:", arcpy.management.GetCount(lyr)[0])
                except:
                    print("   Feature count unavailable")

print("\n========== ALL MAPS ==========")
for m in aprx.listMaps():
    print(m.name)

print("\n========== ALL LAYOUTS ==========")
for l in aprx.listLayouts():
    print(l.name)





# Step 2 — Verify all eight map renderers
import arcpy

aprx = arcpy.mp.ArcGISProject("CURRENT")

map_names = [
    "Map",
    "Map_Sex_Ratio_Map",
    "Map_Literate_Population_Map",
    "Map_Female_Literacy_Map",
    "Map_Main_Workers_Map",
    "Map_Marginal_Workers_Map",
    "Map_SC_Population_Map",
    "Map_ST_Population_Map"
]

for map_name in map_names:

    maps = aprx.listMaps(map_name)

    if not maps:
        print("\nMAP NOT FOUND:", map_name)
        continue

    m = maps[0]

    print("\n" + "=" * 55)
    print("MAP:", m.name)

    for layer in m.listLayers():

        if not layer.isFeatureLayer:
            continue

        print("LAYER:", layer.name)

        try:
            print("FEATURE COUNT:",
                  arcpy.management.GetCount(layer)[0])

            renderer = layer.symbology.renderer

            print("RENDERER:", renderer.type)

            if renderer.type == "GraduatedColorsRenderer":

                print("FIELD:", renderer.classificationField)
                print("METHOD:", renderer.classificationMethod)
                print("CLASS COUNT:", renderer.breakCount)

                for i, cb in enumerate(renderer.classBreaks, 1):
                    print(
                        f"CLASS {i}:",
                        cb.lowerBound,
                        "-",
                        cb.upperBound
                    )

        except Exception as e:
            print("ERROR:", e)

print("\nRENDERER INSPECTION COMPLETE")






# Create the vault
$Vault = "$HOME\Documents\Second-Brain"

New-Item -ItemType Directory -Force -Path $Vault

# Create main folders
$Folders = @(
    "00 - Dashboard",
    "01 - Inbox",
    "02 - Learning",
    "03 - Projects",
    "04 - Research",
    "05 - Resources",
    "06 - Journal",
    "99 - Attachments"
)

foreach ($Folder in $Folders) {
    New-Item -ItemType Directory -Force -Path "$Vault\$Folder"
}

# Create your home note
@'
# My Second Brain

> My personal engineering knowledge base.

## Learning
- [[02 - Learning/DevOps]]
- [[02 - Learning/DSA]]
- [[02 - Learning/Backend Development]]
- [[02 - Learning/Artificial Intelligence]]
- [[02 - Learning/GIS]]

## Projects
- [[03 - Projects/KOLTRIX]]
- [[03 - Projects/Xcoder]]
- [[03 - Projects/Forensix]]

## Workspace
- [[01 - Inbox/Inbox]]
- [[06 - Journal/Learning Log]]

## Research
- [[04 - Research/Research Index]]

## Quick Navigation
- Learning
- Projects
- Research
- Resources
'@ | Set-Content -Path "$Vault\00 - Dashboard\Home.md" -Encoding UTF8

Write-Host "Second Brain created at: $Vault" -ForegroundColor Green
