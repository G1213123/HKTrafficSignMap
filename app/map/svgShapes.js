// SVG shapes registry for traffic light symbols.
// Each key is a REFNAME and value is an array of SVG shape strings (without outer <svg> wrapper).
export const trafficLightShapes = {
    // Example: S01 shapes (extracted from public/data/svgs/S01.svg)
    P01: [
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />'
    ],
    P02: [
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
    ],
    P03L: [
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.4,-1.925 -0.4,-1.675 -0.9,-1.8" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="-0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
    ],
    P04R: [
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.4,-1.925 0.4,-1.675 0.9,-1.8" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
    ],
    P05L: [
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.4,-1.725 -0.4,-1.475 -0.9,-1.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="-0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
    ],
    P06R: [
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.4,-1.725 0.4,-1.475 0.9,-1.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
    ],
    P07L: [
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.525,-1.4 -0.275,-1.4 -0.4,-0.9" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="-0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1.8" x2="-0.4" y2="-1.4" stroke="black" stroke-width="0.05" />',
    ],
    P08R: [
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.525,-1.4 0.275,-1.4 0.4,-0.9" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.8" x2="0.4" y2="-1.4" stroke="black" stroke-width="0.05" />',
    ],
    PAO: [
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.525,-1.4 0.275,-1.4 0.4,-0.9" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.8" x2="0.4" y2="-1.4" stroke="black" stroke-width="0.05" />',
    ],
    P09L: [
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.525,-1.4 -0.275,-1.4 -0.4,-0.9" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="-0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1.6" x2="-0.4" y2="-1.2" stroke="black" stroke-width="0.05" />',
    ],
    P10R: [
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.525,-1.4 0.275,-1.4 0.4,-0.9" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.6" x2="0.4" y2="-1.2" stroke="black" stroke-width="0.05" />',
    ],
    P11: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
    ],
    P12L: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',

        // triangle
        '<polygon points="0.925,-1.7 0.675,-1.7 0.8,-1.2" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-2.1" x2="0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.8" y1="-2.1" x2="0.8" y2="-1.7" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.8,-2.225 -0.8,-1.975 -1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-2.1" x2="-0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',

    ],
    P13R: [
        // circle (same center)
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line (horizontal)
        '<line x1="0.4" y1="-1" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored other side)
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',

        // triangle (mirrored)
        '<polygon points="-0.925,-1.7 -0.675,-1.7 -0.8,-1.2" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-2.1" x2="-0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.8" y1="-2.1" x2="-0.8" y2="-1.7" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="0.8,-2.225 0.8,-1.975 1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-2.1" x2="0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',

    ],
    P14: [
        // circle (same center)
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="-0.75,-1.5 -0.45,-1.5 -0.6,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.6" y1="-1.5" x2="-0.6" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line (horizontal)
        '<line x1="0.4" y1="-1" x2="-0.6" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored other side)
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',

        // triangle
        '<polygon points="-0.8,-2.225 -0.8,-1.975 -1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.6" y1="-2.1" x2="-1.0" y2="-2.1" stroke="black" stroke-width="0.05" />',

        // triangle (mirrored)
        '<polygon points="0.8,-2.225 0.8,-1.975 1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-2.1" x2="0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',

        // triangle (mirrored)
        '<polygon points="-0.325,-1.7 -0.075,-1.7 -0.2,-1.2" fill="#222" />',
        // short line
        '<line x1="-0.6" y1="-2.1" x2="-0.2" y2="-2.1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.2" y1="-2.1" x2="-0.2" y2="-1.7" stroke="black" stroke-width="0.05" />',

    ],
    P15: [
        // circle (same center)
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line (horizontal)
        '<line x1="0.4" y1="-1" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored other side)
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',

        // triangle
        '<polygon points="-0.8,-2.225 -0.8,-1.975 -1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-2.1" x2="-0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="0.8,-2.225 0.8,-1.975 1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-2.1" x2="0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',

    ],
    P21: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // bell
        '<path d="M -0.39 -1.5 A 0.4 0.4 90 1 0 0.39 -1.5 Z" fill="none" stroke="black" stroke-width="0.05" />'
    ],
    P22: [
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // bell
        '<path d="M -0.39 -1.3 A 0.4 0.4 90 1 0 0.39 -1.3 Z" fill="none" stroke="black" stroke-width="0.05" />'
    ],
    P23: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // bell
        '<path d="M -0.39 -1.5 A 0.4 0.4 90 1 0 0.39 -1.5 Z" fill="none" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.3,0.72 0.3,0.72 0,0.2" fill="none" stroke="black" stroke-width="0.05" />',
    ],
    P24: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // bell
        '<path d="M -0.39 -1.5 A 0.4 0.4 90 1 0 0.39 -1.5 Z" fill="none" stroke="black" stroke-width="0.05" />',
        // wave
        '<path d="M -0.125 0.3165 A 0.25 0.25 90 0 0 0.125 0.3165" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.25 0.4665 A 0.4 0.4 90 0 0 0.25 0.4665" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.375 0.6165 A 0.6 0.6 90 0 0 0.375 0.6165" fill="none" stroke="fuchsia" stroke-width="0.05"/>'
    ],
    P25: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // wave
        '<path d="M -0.125 -0.3165 A 0.25 0.25 90 0 1 0.125 -0.3165" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.25 -0.4665 A 0.4 0.4 90 0 1 0.25 -0.4665" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.375 -0.6165 A 0.6 0.6 90 0 1 0.375 -0.6165" fill="none" stroke="fuchsia" stroke-width="0.05"/>'
    ],
    P26: [
        // wave
        '<path d="M -0.125 -0.3165 A 0.25 0.25 90 0 1 0.125 -0.3165" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.25 -0.4665 A 0.4 0.4 90 0 1 0.25 -0.4665" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.375 -0.6165 A 0.6 0.6 90 0 1 0.375 -0.6165" fill="none" stroke="fuchsia" stroke-width="0.05"/>'
    ],
    PBUTT: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.3,-0.72 0.3,-0.72 0,-0.2" fill="none" stroke="black" stroke-width="0.05" />',
        // wave
        '<path d="M -0.125 -0.8365 A 0.25 0.25 90 0 1 0.125 -0.8365" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.25 -0.9865 A 0.4 0.4 90 0 1 0.25 -0.9865" fill="none" stroke="fuchsia" stroke-width="0.05"/>',
        '<path d="M -0.375 -1.1365 A 0.6 0.6 90 0 1 0.375 -1.1365" fill="none" stroke="fuchsia" stroke-width="0.05"/>'
    ],
    PWBUTT: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.3,-0.72 0.3,-0.72 0,-0.2" fill="none" stroke="black" stroke-width="0.05" />',
    ],
    PTR01: [
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // text T
        '<circle cx="0" cy="-2" r="0.2" fill="none"  stroke="#222" stroke-width="0.02" />',
        '<text x="0" y="-1.85" text-anchor="middle" font-size="0.4" fill="#222">T</text>',
    ],
    PTR02: [
        // long line
        '<line x1="0" y1="-0.125" x2="0.4" y2="-0.125" stroke="black" stroke-width="0.05" />',
        // text T
        '<circle cx="0.6" cy="-0.125" r="0.2" fill="none"  stroke="#222" stroke-width="0.02" />',
        '<text x="0.125" y="0.75" text-anchor="middle" font-size="0.4" transform="rotate(-90)" fill="#222">T</text>',
    ],
    S01: [
        // slahses
        '<line x1="-0.3" y1="-1.1" x2="-0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-1.1" x2="0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />'
    ],
    S02: [
        // slahses
        '<line x1="-0.3" y1="-0.9" x2="-0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-0.9" x2="0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
    ],
    S03L: [
        // slahses
        '<line x1="-0.3" y1="-1.1" x2="-0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-1.1" x2="0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.4,-1.925 -0.4,-1.675 -0.9,-1.8" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="-0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
    ],
    S04R: [
        // slahses
        '<line x1="-0.3" y1="-1.1" x2="-0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-1.1" x2="0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.4,-1.925 0.4,-1.675 0.9,-1.8" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
    ],
    S05L: [
        // slahses
        '<line x1="-0.3" y1="-0.9" x2="-0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-0.9" x2="0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.4,-1.725 -0.4,-1.475 -0.9,-1.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="-0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
    ],
    S06R: [
        // slahses
        '<line x1="-0.3" y1="-0.9" x2="-0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-0.9" x2="0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.4,-1.725 0.4,-1.475 0.9,-1.6" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
    ],
    S07L: [
        // slahses
        '<line x1="-0.3" y1="-1.1" x2="-0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-1.1" x2="0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.525,-1.4 -0.275,-1.4 -0.4,-0.9" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="-0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1.8" x2="-0.4" y2="-1.4" stroke="black" stroke-width="0.05" />',
    ],
    S08R: [
        // slahses
        '<line x1="-0.3" y1="-1.1" x2="-0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-1.1" x2="0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.525,-1.4 0.275,-1.4 0.4,-0.9" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.8" x2="0.4" y2="-1.8" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.8" x2="0.4" y2="-1.4" stroke="black" stroke-width="0.05" />',
    ],
    S09L: [
        // slahses
        '<line x1="-0.3" y1="-0.9" x2="-0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-0.9" x2="0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.525,-1.2 -0.275,-1.2 -0.4,-0.7" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="-0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1.6" x2="-0.4" y2="-1.2" stroke="black" stroke-width="0.05" />',
    ],
    S10R: [
        // slahses
        '<line x1="-0.3" y1="-0.9" x2="-0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-0.9" x2="0.125" y2="-1.5" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="0" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.525,-1.2 0.275,-1.2 0.4,-0.7" fill="#222" />',
        // short line
        '<line x1="0" y1="-1.6" x2="0.4" y2="-1.6" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.4" y1="-1.6" x2="0.4" y2="-1.2" stroke="black" stroke-width="0.05" />',
    ],
    S11: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="0.2" y1="-1.575" x2="0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.6" y1="-1.575" x2="0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="-0.2" y1="-1.575" x2="-0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="-0.6" y1="-1.575" x2="-0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
    ],
    S12L: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="0.2" y1="-1.575" x2="0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.6" y1="-1.575" x2="0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.4" y1="-1" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="-0.2" y1="-1.575" x2="-0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="-0.6" y1="-1.575" x2="-0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',

        // triangle
        '<polygon points="0.925,-1.7 0.675,-1.7 0.8,-1.2" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-2.1" x2="0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="0.8" y1="-2.1" x2="0.8" y2="-1.7" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.8,-2.225 -0.8,-1.975 -1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-2.1" x2="-0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',

    ],
    S13R: [
        // circle (same center)
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="0.2" y1="-1.575" x2="0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.6" y1="-1.575" x2="0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line (horizontal)
        '<line x1="0.4" y1="-1" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="-0.2" y1="-1.575" x2="-0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="-0.6" y1="-1.575" x2="-0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle (mirrored other side)
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',

        // triangle (mirrored)
        '<polygon points="-0.925,-1.7 -0.675,-1.7 -0.8,-1.2" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-2.1" x2="-0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',
        // short line
        '<line x1="-0.8" y1="-2.1" x2="-0.8" y2="-1.7" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="0.8,-2.225 0.8,-1.975 1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-2.1" x2="0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',

    ],
    S15: [
        // circle (same center)
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="0.2" y1="-1.575" x2="0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.6" y1="-1.575" x2="0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // short line (horizontal)
        '<line x1="0.4" y1="-1" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // slahses
        '<line x1="-0.2" y1="-1.575" x2="-0.325" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        '<line x1="-0.6" y1="-1.575" x2="-0.475" y2="-2.025" stroke="#222" stroke-width="0.05" />',
        // triangle (mirrored other side)
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',

        // triangle
        '<polygon points="-0.8,-2.225 -0.8,-1.975 -1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-2.1" x2="-0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',
        // triangle (mirrored)
        '<polygon points="0.8,-2.225 0.8,-1.975 1.3,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-2.1" x2="0.8" y2="-2.1" stroke="black" stroke-width="0.05" />',

    ],
    STR01: [
        // slahses
        '<line x1="-0.3" y1="-1.1" x2="-0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-1.1" x2="0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.225,-1 0.225,-1 0,-1.8" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-1" stroke="black" stroke-width="0.05" />',
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // text T
        '<circle cx="0" cy="-2" r="0.2" fill="none"  stroke="#222" stroke-width="0.02" />',
        '<text x="0" y="-1.85" text-anchor="middle" font-size="0.4" fill="#222">T</text>',
    ],
    STR02: [
        // long line
        '<line x1="0" y1="-0.125" x2="0.4" y2="-0.125" stroke="black" stroke-width="0.05" />',
        // text T
        '<circle cx="0.6" cy="-0.125" r="0.2" fill="none"  stroke="#222" stroke-width="0.02" />',
        '<text x="0.125" y="0.75" text-anchor="middle" font-size="0.4" transform="rotate(-90)" fill="#222">T</text>',
    ],
    M56: [
        // box
        '<rect x="-0.3" y="-0.6" width="0.6" height="1.2" fill="none" stroke="#222" stroke-width="0.05" />',
        // text T
        '<text x="0" y="0.15" text-anchor="middle" font-size="0.4" transform="rotate(-90)" fill="#222">C</text>',
    ],
    M51: [
        // slahses
        '<line x1="-0.3" y1="-1.1" x2="-0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
        '<line x1="0.3" y1="-1.1" x2="0.125" y2="-1.7" stroke="#222" stroke-width="0.05" />',
    ],
    M52: [
        // triangle
        '<polygon points="-0.15,0.5 0.15,0.5 0,1.1" fill="#222" />',
        // short line
        '<line x1="0" y1="0" x2="0" y2="0.5" stroke="black" stroke-width="0.05" />',
    ],
    M53L: [
        // triangle
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',
    ],
    M54R: [
        // triangle
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
    ],
    KLBOLL: [
        // triangle
        '<polygon points="0,0 -0.866,-0.5 -0.866,0.5"  stroke="black" fill="none" stroke-width="0.05"/>',
    ],
    KRBOLL: [
        // triangle
        '<polygon points="0,0 -0.866,-0.5 -0.866,0.5"  stroke="black" fill="none" stroke-width="0.05"/>',
    ],
    PBOLL: [
        // triangle
        '<polygon points="0,0 -0.866,-0.5 -0.866,0.5"  stroke="black" fill="none" stroke-width="0.05"/>',
    ],

    TRAML: [
        // text T
        '<circle cx="0" cy="0.4" r="0.2" fill="none"  stroke="#222" stroke-width="0.02" />',
        '<text x="0.4" y="0.15" text-anchor="middle" font-size="0.4" transform="rotate(90)" fill="#222">T</text>',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="0.2" stroke="black" stroke-width="0.05" />',
    ],
    TRAMR: [
        // triangle
        '<polygon points="-0.225,-0.8 0.225,-0.8 0,-1.6" fill="#222" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="0.6" stroke="black" stroke-width="0.05" />',
    ],

    LRTS: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // lozenge
        '<path d="M 0 -0.8 -0.2 -1.2 0 -1.6 0.2 -1.2 Z" fill="none" stroke="black" stroke-width="0.05" />',


    ],
    WIGWAG: [
        // circle
        '<circle cx="0" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // long line
        '<line x1="0" y1="-0.2" x2="0" y2="-0.8" stroke="black" stroke-width="0.05" />',
        // lozenge
        '<path d="M 0 -0.8 -0.4 -1 0 -1.2 0.4 -1 Z" fill="none" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="0.55,-1.5 0.25,-1.5 0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="-1.5" x2="0.4" y2="-1" stroke="black" stroke-width="0.05" />',
        // triangle
        '<polygon points="-0.55,-1.5 -0.25,-1.5 -0.4,-2.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="-1.5" x2="-0.4" y2="-1" stroke="black" stroke-width="0.05" />',


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

    group.setAttribute('transform', `translate(${(vbW / 2 + vbX)}, ${vbH / 2 + vbY})`);


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
