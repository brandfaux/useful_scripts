// Function to create a rectangular selection based on provided coordinates
function makeSelectionAndCopy(x1, y1, x2, y2) {
    var doc = app.activeDocument; // Get the active document
    
    // Make sure Layer 1 is the active layer
    var layer = doc.artLayers.getByName("Layer 1"); 
    doc.activeLayer = layer;
    
    // Deselect any active selections
    doc.selection.deselect();
    
    // Define selection coordinates
    var selectionRegion = [
        [x1, y1], // Top-left corner
        [x2, y1], // Top-right corner
        [x2, y2], // Bottom-right corner
        [x1, y2]  // Bottom-left corner
    ];
    
    // Make the selection
    doc.selection.select(selectionRegion);
    
    // Copy the selection
    doc.selection.copy();
    
    // Create a new layer and paste the copied selection
    var newLayer = doc.artLayers.add();
    doc.paste();
    
    // Deselect the current selection
    doc.selection.deselect();
    
    // Log the message instead of showing an alert box
    $.writeln("Selected and copied area from (" + x1 + ", " + y1 + ") to (" + x2 + ", " + y2 + ")");
}

// List of coordinates for multiple selections
var selectionCoordinates = [
    [105, 2139, 325, 2408],
    [66, 2124, 95, 2464],
    [342, 2133, 866, 2281],
    [337, 2563, 728, 2616],
    [1132, 2108, 1768, 2459],
    [1375, 2513, 1967, 2615],
    [1776, 2131, 2151, 2507]
    
];

// Loop through the coordinates and make each selection, then copy and paste to new layers
for (var i = 0; i < selectionCoordinates.length; i++) {
    var coords = selectionCoordinates[i];
    makeSelectionAndCopy(coords[0], coords[1], coords[2], coords[3]);
}

function copyLayersToNewPSD() {
    // Ensure there's an active document
    if (app.documents.length > 0) {
        // Reference the active document
        var doc = app.activeDocument;

        // Define the transformation data for each layer (Layer 2 to Layer 8)
        var transformData = {
            "Layer 2": { width: 100, height: 100, x: 282, y: 208 },
            "Layer 3": { width: 100, height: 100, x: 229, y: 191 },
            "Layer 4": { width: 100, height: 100, x: 526, y: 208 },
            "Layer 5": { width: 100, height: 100, x: 561, y: 477 },
            "Layer 6": { width: 89.62, height: 81.77, x: 1316, y: 190 },
            "Layer 7": { width: 100, height: 100, x: 1435, y: 453 },
            "Layer 8": { width: 74.69, height: 76.33, x: 1886, y: 190 }
        };

        // Open the new PSD file from the specified path
        var newFile = new File("D:/new/adr_mockup.psd");
        if (!newFile.exists) {
            alert("The file 'adr_mockup.psd' doesn't exist at the specified path.");
            return;
        }
        
        // Store the current document reference
        var originalDoc = app.activeDocument;
        var newDoc = app.open(newFile);  // Open the new PSD

        // Loop through Layers 2 to 8 and apply unique transformations
        for (var i = 2; i <= 8; i++) {
            try {
                // Switch back to the original document
                app.activeDocument = originalDoc;
                
                // Get the layer by its name (Layer 2, Layer 3, ..., Layer 8)
                var layerName = "Layer " + i;
                var layer = doc.layers.getByName(layerName);

                // Select the layer and copy it
                doc.activeLayer = layer;
                layer.copy(); // Copy the layer

                // Switch to the new PSD and paste the copied layer
                app.activeDocument = newDoc;
                var pastedLayer = newDoc.paste(); // Paste into new PSD

                // Transform the pasted layer based on the defined data for each layer
                var data = transformData[layerName];
                if (data) {
                    // Resize based on specific width and height
                    pastedLayer.resize(data.width, data.height);

                    // Move the pasted layer to specific coordinates
                    pastedLayer.translate(data.x - pastedLayer.bounds[0].as("px"), data.y - pastedLayer.bounds[1].as("px"));
                }

                // Bring the pasted layer to the front (top of the layer stack)
                pastedLayer.move(newDoc.layers[0], ElementPlacement.PLACEBEFORE);

            } catch (e) {
                alert("Error: " + e.message + " for " + layerName);
            }
        }

        // Switch back to the original document when done
        app.activeDocument = originalDoc;
    }
}

// Run the function
copyLayersToNewPSD();
