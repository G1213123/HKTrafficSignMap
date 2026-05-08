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
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />'
    ],
    P02: [
        // triangle
        '<polygon points="-0.0625,-0.4 0.0625,-0.4 0,-0.75" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.4" stroke="black" stroke-width="0.05" />',
    ],
    P03L: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.4,-1.625 -0.4,-1.375 -0.9,-1.5" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="-0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
    ],
    P04R: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.4,-1.625 0.4,-1.375 0.9,-1.5" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
    ],
    P05L: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.4,-1.625 -0.4,-1.375 -0.9,-1.5" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="-0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
    ],
    P06R: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.4,-1.625 0.4,-1.375 0.9,-1.5" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
    ],
    P07L: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.525,-1.1 -0.275,-1.1 -0.4,-0.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="-0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1.1" stroke="black" stroke-width="0.05" />',
    ],
    P08R: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.525,-1.1 0.275,-1.1 0.4,-0.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1.1" stroke="black" stroke-width="0.05" />',
    ],
    P09L: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.525,-1.1 -0.275,-1.1 -0.4,-0.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="-0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1.1" stroke="black" stroke-width="0.05" />',
    ],
    P10R: [
        // triangle
        '<polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.525,-1.1 0.275,-1.1 0.4,-0.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.5" x2="0.4" y2="-1.5" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1.1" stroke="black" stroke-width="0.05" />',
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
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />'
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

    group.setAttribute('transform', `translate(0, ${vbY / 2 + 0.1})`);


    const fixWidth = 0.4
    const fixHeight = 1.7;
    const widthScale = vbW / fixWidth;
    const heightScale = vbH / fixHeight;
    svgEl.setAttribute('style', `width: ${widthScale * 100}%; height: ${heightScale * 100}%; display: block; overflow: visible;`);


    const out = svgEl.outerHTML;
    document.body.removeChild(svgEl);
    return out;
};

export default { trafficLightShapes, buildSvgForRefname };
