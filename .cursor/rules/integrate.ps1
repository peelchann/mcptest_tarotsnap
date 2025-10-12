# --- Configuration ---
# The source file containing the generated React code with markers.
$SRC_FILE = "generated.tsx"

# Destination files in your Next.js project.
$PAGE_DEST = "src/app/page.tsx"
$LAYOUT_DEST = "src/app/layout.tsx"
$GLOBALS_CSS_DEST = "src/app/globals.css"

# --- Helper Functions a---
# Extracts a block of code from the source file using start and end markers.
# Param: $markerName - The name of the marker (e.g., "HomePage")
function Extract-Block {
    param (
        [string]$markerName
    )
    # Get the raw content of the source file.
    $fileContent = Get-Content -Path $SRC_FILE -Raw
    # Define the regex pattern to find content between markers.
    # (?s) allows '.' to match newline characters.
    $pattern = "(?s)// SCRIPT-MARKER:START:${markerName}(.*?)// SCRIPT-MARKER:END:${markerName}"
    
    # Perform the match.
    if ($fileContent -match $pattern) {
        # Return the captured content, trimming leading/trailing whitespace.
        return $Matches[1].Trim()
    }
    # Return an empty string if no match is found.
    return ""
}

# --- Main Script Logic ---

# Check if the source file exists.
if (-not (Test-Path -Path $SRC_FILE)) {
    Write-Error "Error: Source file '$SRC_FILE' not found. Please save the generated React code first."
    exit 1
}

Write-Host "🚀 Starting integration process..." -ForegroundColor Cyan

# --- 1. Create the src/app/page.tsx file ---
Write-Host "Updating '$PAGE_DEST'..." -ForegroundColor Green

# Extract all necessary parts for the page.
$imports_block = Extract-Block "IMPORTS"
$handicon_component = Extract-Block "HandIcon"
$homepage_component = Extract-Block "HomePage"

# Assemble the final page.tsx file content.
$pageContent = @"
$imports_block

// --- Components ---
$handicon_component

// --- Main Page ---
$homepage_component
"@

# Overwrite the destination file with the new content.
Set-Content -Path $PAGE_DEST -Value $pageContent
Write-Host "✅ '$PAGE_DEST' has been successfully updated." -ForegroundColor Green


# --- 2. Update src/app/layout.tsx to include Google Fonts ---
Write-Host "Updating '$LAYOUT_DEST' to add Google Fonts..." -ForegroundColor Yellow

# Read the layout file content.
$layoutContent = Get-Content -Path $LAYOUT_DEST -Raw

# Check if the font link already exists to avoid duplicates.
if ($layoutContent -notlike "*fonts.googleapis.com*") {
    # Define the font links to be inserted.
    $fontLinks = @"
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
"@
    # Insert the links right before the closing </head> tag.
    $newLayoutContent = $layoutContent -replace '</head>', "$fontLinks`n  </head>"
    Set-Content -Path $LAYOUT_DEST -Value $newLayoutContent
    Write-Host "✅ Google Fonts link added to '$LAYOUT_DEST'." -ForegroundColor Green
}
else {
    Write-Host "👍 Google Fonts link already exists in '$LAYOUT_DEST'. Skipping." -ForegroundColor Gray
}


# --- 3. Ensure globals.css has Tailwind directives ---
Write-Host "Verifying '$GLOBALS_CSS_DEST'..." -ForegroundColor Yellow

$cssContent = Get-Content -Path $GLOBALS_CSS_DEST -Raw
# Check if the @tailwind base directive is missing.
if ($cssContent -notlike "*@tailwind base;*") {
    # Define the necessary Tailwind directives.
    $tailwindDirectives = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@
    # Prepend the directives to the existing content.
    $newCssContent = "$tailwindDirectives`n`n$cssContent"
    Set-Content -Path $GLOBALS_CSS_DEST -Value $newCssContent
    Write-Host "✅ Added Tailwind directives to '$GLOBALS_CSS_DEST'." -ForegroundColor Green
}
else {
    Write-Host "👍 Tailwind directives already present in '$GLOBALS_CSS_DEST'." -ForegroundColor Gray
}

Write-Host "🎉 Integration complete! Your project is ready." -ForegroundColor Magenta

