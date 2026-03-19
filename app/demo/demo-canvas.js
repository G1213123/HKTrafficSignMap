/**
 * Demo Canvas - Simplified version of main app canvas for homepage demonstration
 * Uses the same codebase patterns as canvas.js but simplified for demo purposes
 */

import { createDemoSymbol } from './demo-symbols.js';
import { createDemoText } from './demo-text.js';
import { simulateDemoSnap, executeAutomatedSnap } from './demo-snap.js';
import { createDemoBorder } from './demo-border.js';

// Demo Canvas Setup - Mirror main app canvas initialization
let demoCanvas = null;
let demoActiveObject = null;
let demoCanvasObject = [];

// Demo CanvasGlobals - Mirror the structure from canvas.js for SymbolObject compatibility
let DemoCanvasGlobals = null;

// Settings for demo (simplified version of GeneralSettings)
const DemoSettings = {
    showGrid: true,
    gridColor: '#ffffff',
    gridSize: 20
};

function initDemoCanvas() {
    // Check if canvas element exists
    const canvasElement = document.getElementById('demo-canvas');
    if (!canvasElement) {
        console.error('Demo canvas element not found');
        return null;
    }

    // Check if Fabric.js is loaded
    if (typeof window !== 'undefined' && !window.fabric) {
        console.error('Fabric.js is not loaded');
        return null;
    }
    const fabric = window.fabric;
    
    try {
        // Initialize the demo canvas with same settings as main app
        if (demoCanvas) {
            demoCanvas.dispose();
        }
        
        demoCanvas = new fabric.Canvas('demo-canvas', {
            fireMiddleClick: true,
            fireRightClick: true,
            preserveObjectStacking: true,
            enableRetinaScaling: true,
            backgroundColor: '#2f2f2f'  // Same background as main app
        });

        // Create demo CanvasGlobals for SymbolObject compatibility
        DemoCanvasGlobals = {
            canvas: demoCanvas,
            ctx: demoCanvas.getContext("2d"),
            activeObject: demoActiveObject,
            activeVertex: null,
            canvasObject: demoCanvasObject,
            CenterCoord: function () { return { x: 0, y: 0 }; } // Simplified center coordinate function
        };

        // Temporarily set global CanvasGlobals for SymbolObject creation (if needed)
        // const originalCanvasGlobals = window.CanvasGlobals;
        window.CanvasGlobals = DemoCanvasGlobals;

        // Set up responsive canvas sizing
        resizeDemoCanvas();

        // Add debounced resize listener for better performance
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeDemoCanvas, 150);
        };
        window.addEventListener('resize', debouncedResize);

        // Set initial zoom similar to main app
        demoCanvas.setZoom(0.4);

        // Center the canvas view
        demoCanvas.absolutePan({ x: -demoCanvas.width / 2, y: -demoCanvas.height / 2 });

        // Add grid to match main app
        drawDemoGrid();

        // Set canvas to render all changes
        demoCanvas.renderAll();
        
        // Hide the placeholder overlay since we now have a real canvas
        const placeholderOverlay = document.getElementById('demo-placeholder-overlay');
        if (placeholderOverlay) {
            placeholderOverlay.style.display = 'none';
        }        
        
        console.log('Demo canvas initialized successfully');
        return demoCanvas;
    } catch (error) {
        console.error('Error initializing demo canvas:', error);
        return null;
    }
}

function drawDemoGrid() {
    if (!demoCanvas) return;

    // Simplified grid drawing based on main app's DrawGrid function
    const corners = demoCanvas.calcViewportBoundaries();
    const xmin = corners.tl.x;
    const xmax = corners.br.x;
    const ymin = corners.tl.y;
    const ymax = corners.br.y;
    const zoom = demoCanvas.getZoom();

    const gridDistance = 50; // Fixed grid distance for demo
    const gridColor = DemoSettings.gridColor;

    const gridSet = [];

    // Create grid lines
    const options = {
        stroke: gridColor,
        strokeWidth: 0.1 / zoom,
        selectable: false,
        evented: false
    };

    // Vertical lines
    for (let x = Math.floor(xmin / gridDistance) * gridDistance; x <= xmax; x += gridDistance) {
        const vertical = new fabric.Line([x, ymin, x, ymax], options);
        gridSet.push(vertical);
    }

    // Horizontal lines
    for (let y = Math.floor(ymin / gridDistance) * gridDistance; y <= ymax; y += gridDistance) {
        const horizontal = new fabric.Line([xmin, y, xmax, y], options);
        gridSet.push(horizontal);
    }

    // Origin lines (0, 0)
    const originLineX = new fabric.Line([0, ymin, 0, ymax], {
        stroke: '#ffffff',
        strokeWidth: 0.5 / zoom,
        selectable: false,
        evented: false
    });
    const originLineY = new fabric.Line([xmin, 0, xmax, 0], {
        stroke: '#ffffff',
        strokeWidth: 0.5 / zoom,
        selectable: false,
        evented: false
    });
    gridSet.push(originLineX);
    gridSet.push(originLineY);

    // Remove existing grid
    const existingGrid = demoCanvas.getObjects().find(obj => obj.id === 'demo-grid');
    if (existingGrid) demoCanvas.remove(existingGrid);

    // Add new grid
    const gridGroup = new fabric.Group(gridSet, {
        id: 'demo-grid',
        selectable: false,
        evented: false
    });
    demoCanvas.add(gridGroup);
    demoCanvas.sendObjectToBack(gridGroup);
}

function resetDemoCanvas() {
    if (!demoCanvas) return;

    // Clear all demo objects except grid
    demoCanvasObject.forEach(obj => {
        demoCanvas.remove(obj);
    });
    // Clear array while maintaining reference
    demoCanvasObject.length = 0;

    // Clear active selection
    demoCanvas.discardActiveObject();
    
    // Redraw grid to ensure it's still there
    drawDemoGrid();
    
    demoCanvas.renderAll();
}

function resizeDemoCanvas() {
    if (!demoCanvas) return;

    try {
        const canvasContainer = document.querySelector('.demo-sign-canvas');
        if (!canvasContainer) return;

        const containerWidth = canvasContainer.clientWidth;
        const containerHeight = canvasContainer.clientHeight;

        // Set canvas dimensions to match container
        demoCanvas.setDimensions({
            width: containerWidth,
            height: containerHeight
        });

        // Re-center the view
        demoCanvas.absolutePan({ x: -demoCanvas.width / 2, y: -demoCanvas.height / 2 });

        // Redraw grid with new dimensions
        drawDemoGrid();

        // Re-render canvas
        demoCanvas.renderAll();

        console.log(`Demo canvas resized to: ${containerWidth}x${containerHeight}`);
    } catch (error) {
        console.error('Error resizing demo canvas:', error);
    }
}

// Export demo canvas functions for use in homepage.js
export const DemoCanvas = {
    init: initDemoCanvas,
    createSymbol: () => createDemoSymbol(demoCanvas, demoCanvasObject),
    createText: () => createDemoText(demoCanvas, demoCanvasObject),
    createBorder: () => createDemoBorder(demoCanvas, demoCanvasObject),
    simulateSnap: () => simulateDemoSnap(demoCanvas, demoCanvasObject),
    executeAutomatedSnap: (callback) => executeAutomatedSnap(demoCanvasObject, callback),
    reset: resetDemoCanvas,
    resize: resizeDemoCanvas,
    canvas: () => demoCanvas,
    objects: () => demoCanvasObject
};