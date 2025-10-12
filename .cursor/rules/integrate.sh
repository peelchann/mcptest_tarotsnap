#!/bin/bash

# --- Configuration ---
# The source file containing the generated React code with markers.
SRC_FILE="generated.tsx"

# Destination files in your Next.js project.
PAGE_DEST="src/app/page.tsx"
LAYOUT_DEST="src/app/layout.tsx"
GLOBALS_CSS_DEST="src/app/globals.css"

# --- Helper Functions ---
# Extracts a block of code from the source file using start and end markers.
# $1: The marker name (e.g., "HomePage")
extract_block() {
    local marker_name=$1
    # Use sed to find the block between the start and end markers.
    # -n: suppress automatic printing
    # "/START.../,/END.../p": print lines between the two patterns
    sed -n "/\/\/ SCRIPT-MARKER:START:${marker_name}/,/\/\/ SCRIPT-MARKER:END:${marker_name}/p" "$SRC_FILE" |
    # Exclude the marker lines themselves from the output.
    sed '1d;$d'
}

# --- Main Script Logic ---

# Check if the source file exists.
if [ ! -f "$SRC_FILE" ]; then
    echo "Error: Source file '$SRC_FILE' not found. Please save the generated React code first."
    exit 1
fi

echo "🚀 Starting integration process..."

# --- 1. Create the src/app/page.tsx file ---
echo "Updating '$PAGE_DEST'..."

# Extract all necessary parts for the page.
imports_block=$(extract_block "IMPORTS")
handicon_component=$(extract_block "HandIcon")
homepage_component=$(extract_block "HomePage")

# Assemble the final page.tsx file.
# Using a temporary file to build the content before overwriting.
TMP_PAGE_FILE=$(mktemp)
{
    echo "$imports_block"
    echo ""
    echo "// --- Components ---"
    echo "$handicon_component"
    echo ""
    echo "// --- Main Page ---"
    echo "$homepage_component"
} > "$TMP_PAGE_FILE"

# Overwrite the destination file.
mv "$TMP_PAGE_FILE" "$PAGE_DEST"
echo "✅ '$PAGE_DEST' has been successfully updated."


# --- 2. Update src/app/layout.tsx to include Google Fonts ---
echo "Updating '$LAYOUT_DEST' to add Google Fonts..."

# Check if the font link already exists to avoid duplicates.
if ! grep -q "fonts.googleapis.com" "$LAYOUT_DEST"; then
    # Use sed to add the font links inside the <head> tag.
    # This is a robust way to find the closing </head> tag and insert before it.
    sed -i.bak '/<\/head>/i \
    <link rel="preconnect" href="https://fonts.googleapis.com" />\
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />\
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
' "$LAYOUT_DEST"
    rm "${LAYOUT_DEST}.bak" # Clean up the backup file created by sed -i
    echo "✅ Google Fonts link added to '$LAYOUT_DEST'."
else
    echo "👍 Google Fonts link already exists in '$LAYOUT_DEST'. Skipping."
fi


# --- 3. Ensure globals.css has Tailwind directives ---
echo "Verifying '$GLOBALS_CSS_DEST'..."

# Check for each Tailwind directive and add it if it's missing.
if ! grep -q "@tailwind base;" "$GLOBALS_CSS_DEST"; then
    # Prepend the directives to the file to ensure they are loaded first.
    echo -e "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n$(cat $GLOBALS_CSS_DEST)" > "$GLOBALS_CSS_DEST"
    echo "✅ Added Tailwind directives to '$GLOBALS_CSS_DEST'."
else
    echo "👍 Tailwind directives already present in '$GLOBALS_CSS_DEST'."
fi

echo "🎉 Integration complete! Your project is ready."

