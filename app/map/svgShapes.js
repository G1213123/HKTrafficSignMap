// SVG shapes registry for traffic light symbols.
// Each key is a REFNAME and value is an array of SVG shape strings (without outer <svg> wrapper).
export const trafficLightShapes = {
    // Example: S01 shapes (extracted from public/data/svgs/S01.svg)
    P01: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia" fill-opacity="0.5" stroke="fuchsia" stroke-width="0.05" />'
    ],
    P02: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
    ],
    P03L: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia" fill-opacity="0.5" stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-1,-0.125 -1,0.125 -1.5,0" fill="#222" />',
        // long line
        '<line x1="0" y1="-1.5" x2="-0.8" y2="-1.5" stroke="black" stroke-width="0.05" />',
    ],
    P04R: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia" fill-opacity="0.5" stroke="fuchsia" stroke-width="0.05" />'
    ],
    S01: [
        // slahses
        '<line x1="-0.2" y1="-1" x2="-0.075" y2="-1.5" stroke="blue" stroke-width="0.05" />',
        '<line x1="0.2" y1="-1" x2="0.075" y2="-1.5" stroke="blue" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia" fill-opacity="0.5" stroke="fuchsia" stroke-width="0.05" />'
    ],
};

// Build a full SVG string for a refname by wrapping shapes, computing viewBox from rendered bounds.
export const buildSvgForRefname = (refname) => {
    const shapes = trafficLightShapes[refname];
    if (!shapes || shapes.length === 0) return null;

    const svgText = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">` +
        `<g>${shapes.join('')}</g></svg>`;

    // Parse into SVG DOM so we can measure bbox
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.documentElement;
    const group = svgEl.querySelector('g');

    document.body.appendChild(svgEl);

    let bbox;
    try {
        bbox = group.getBBox();
    } catch (err) {
        bbox = { x: 0, y: 0, width: 24, height: 24 };
    }

    // Ensure non-zero dimensions
    const vbX = bbox.x || 0;
    const vbY = bbox.y || 0;
    const vbW = bbox.width || 24;
    const vbH = bbox.height || 24;
    svgEl.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);
    svgEl.setAttribute('style', "width: 100%; height: 100%; display: block; overflow: visible;");


    const out = svgEl.outerHTML;
    document.body.removeChild(svgEl);
    return out;
};

export default { trafficLightShapes, buildSvgForRefname };
