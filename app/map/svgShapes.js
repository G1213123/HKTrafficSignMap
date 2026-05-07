// SVG shapes registry for traffic light symbols.
// Each key is a REFNAME and value is an array of SVG shape strings (without outer <svg> wrapper).
export const trafficLightShapes = {
    // Example: S01 shapes (extracted from public/data/svgs/S01.svg)
    S01: [
        // slahses
        '<line x1="650" y1="225" x2="1008.7" y2="75" stroke="blue" stroke-width="20" />',
        '<line x1="650" y1="-225" x2="1008.57" y2="-75" stroke="blue" stroke-width="20" />',
        // triangle
        '<line x1="600" y1="-150" x2="1000" y2="0" stroke="fuchsia" stroke-width="20" />',
        '<line x1="1000" y1="0" x2="600" y2="150" stroke="fuchsia" stroke-width="20" />',
        '<line x1="600" y1="-150" x2="600" y2="150" stroke="green" stroke-width="20" />',
        // long line
        '<line x1="150" y1="0" x2="600" y2="0" stroke="black" stroke-width="20" />',
        // circle
        '<circle cx="0" cy="0" r="150" fill="fuchsia" fill-opacity="0.5" stroke="fuchsia" stroke-width="20" />'
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

    // Append offscreen to compute bbox
    svgEl.style.position = 'absolute';
    svgEl.style.left = '-9999px';
    svgEl.style.top = '-9999px';
    svgEl.style.width = '0';
    svgEl.style.height = '0';
    svgEl.style.overflow = 'visible';
    svgEl.style.visibility = 'hidden';
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
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid');

    const out = svgEl.outerHTML;
    document.body.removeChild(svgEl);
    return out;
};

export default { trafficLightShapes, buildSvgForRefname };
