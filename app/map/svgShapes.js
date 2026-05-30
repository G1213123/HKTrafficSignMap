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
        '<line x1="-0.75" y1="0" x2="-0.2" y2="0" stroke="black" stroke-width="0.05" />',
        // text T
        '<circle cx="0" cy="0" r="0.2" fill="none"  stroke="#222" stroke-width="0.02" />',
        '<text x="0" y="0.15" text-anchor="middle" font-size="0.4" transform="rotate(-90)" fill="#222">T</text>',
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
        '<polygon points="-0.15,-0.5 0.15,-0.5 0,-1.1" fill="#222" />',
        // short line
        '<line x1="0" y1="0" x2="0" y2="-0.5" stroke="black" stroke-width="0.05" />',
    ],
    M53L: [
        // triangle
        '<polygon points="-0.55,0.5 -0.25,0.5 -0.4,1.1" fill="#222" />',
        // short line
        '<line x1="-0.4" y1="0.5" x2="-0.4" y2="0" stroke="black" stroke-width="0.05" />',
        '<line x1="0" y1="0" x2="-0.4" y2="0" stroke="black" stroke-width="0.05" />',
    ],
    M54R: [
        // triangle
        '<polygon points="0.55,0.5 0.25,0.5 0.4,1.1" fill="#222" />',
        // short line
        '<line x1="0.4" y1="0.5" x2="0.4" y2="0" stroke="black" stroke-width="0.05" />',
        '<line x1="0" y1="0" x2="0.4" y2="0" stroke="black" stroke-width="0.05" />',
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
    TSPO: [
        // rectangle
        '<polygon points="-0.125,0 0.125,0 0.125,-0.8 -0.125,-0.8" fill="none" stroke="black" stroke-width="0.05" />',
    ],
    TSPOB: [
        // circle
        '<circle cx="0.2" cy="0" r="0.2" fill="fuchsia"  stroke="fuchsia" stroke-width="0.05" />',
        // rectangle
        '<polygon points="-0.25,-0.4 0,-0.4 0,0.4 -0.25,0.4" fill="none" stroke="black" stroke-width="0.05" />',
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

// Dedicated icon registry for tooltip previews (separate from map symbol geometry).
// Each key is a REFNAME and value is an array of SVG shape strings.
export const trafficLightIcon = {
    P01: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom green (bright)
        '<circle cx="30" cy="74" r="8" fill="#22c55e" stroke="#16a34a" stroke-width="1.5" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P03L: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="29.5,82.25 34,82.25 38.5,74 34,65.75 29.5,65.75 34,74" fill="#22c55e" />',
        '<rect x="21.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P04R: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="30.5,65.75 26,65.75 21.5,74 26,82.25 30.5,82.25 26,74" fill="#22c55e" />',
        '<rect x="29.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P05L: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="29.5,82.25 34,82.25 38.5,74 34,65.75 29.5,65.75 34,74" fill="#22c55e" />',
        '<rect x="21.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P06R: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="30.5,65.75 26,65.75 21.5,74 26,82.25 30.5,82.25 26,74" fill="#22c55e" />',
        '<rect x="29.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P07L: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="38.25,74.5 38.25,70 30,65.5 21.75,70 21.75,74.5 30,70" fill="#22c55e" />',
        '<rect x="28" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P08R: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="38.25,74.5 38.25,70 30,65.5 21.75,70 21.75,74.5 30,70" fill="#22c55e" />',
        '<rect x="28" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P09L: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="38.25,74.5 38.25,70 30,65.5 21.75,70 21.75,74.5 30,70" fill="#22c55e" />',
        '<rect x="28" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P10R: [
        // pole
        '<rect x="28" y="90" width="4" height="18" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="30" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="30" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="38.25,74.5 38.25,70 30,65.5 21.75,70 21.75,74.5 30,70" fill="#22c55e" />',
        '<rect x="28" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P11: [
        // pole
        '<rect x="28" y="8" width="4" height="90" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="-6" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="10" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="10" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="18.25,74.5 18.25,70 10,65.5 1.75,70 1.75,74.5 10,70" fill="#22c55e" />',
        '<rect x="8" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="10" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        // signal box
        '<rect x="34" y="8" width="32" height="84" rx="7" fill="none" stroke="#374151" stroke-dasharray="5,5" stroke-width="2" />',
        // top red (dim)
        '<circle cx="50" cy="26" r="8" fill="none" stroke="#374151" stroke-dasharray="5,5" stroke-width="2" />',
        // middle amber (dim)
        '<circle cx="50" cy="50" r="8" fill="none" stroke="#374151" stroke-dasharray="5,5" stroke-width="2" />',
        // green glow
        '<circle cx="50" cy="74" r="12" fill="none" stroke="#374151" stroke-dasharray="5,5" stroke-width="2" />'
    ],
    P12L: [
        // pole
        '<rect x="28" y="8" width="4" height="90" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="-6" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="10" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="10" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="18.25,74.5 18.25,70 10,65.5 1.75,70 1.75,74.5 10,70" fill="#22c55e" />',
        '<rect x="8" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="10" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        // signal box
        '<rect x="34" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="50" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="50" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="49.5,82.25 54,82.25 58.5,74 54,65.75 49.5,65.75 54,74" fill="#22c55e" />',
        '<rect x="41.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="50" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P13R: [
        // pole
        '<rect x="28" y="8" width="4" height="90" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="34" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="50" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="50" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="58.25,74.5 58.25,70 50,65.5 41.75,70 41.75,74.5 50,70" fill="#22c55e" />',
        '<rect x="48" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="50" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        // signal box
        '<rect x="-6" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="10" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="10" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="10" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="10.5,65.75 6,65.75 1.5,74 6,82.25 10.5,82.25 6,74" fill="#22c55e" />',
        '<rect x="9.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="10" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P14: [
        // pole
        '<rect x="28" y="8" width="4" height="90" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="34" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="50" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="50" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="58.25,74.5 58.25,70 50,65.5 41.75,70 41.75,74.5 50,70" fill="#22c55e" />',
        '<rect x="48" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="50" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        // signal box
        '<rect x="-6" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="10" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="10" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="10" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="10.5,65.75 6,65.75 1.5,74 6,82.25 10.5,82.25 6,74" fill="#22c55e" />',
        '<rect x="9.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="10" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        // signal box
        '<rect x="70" y="56" width="32" height="36" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // bottom black lens envelope
        '<circle cx="86" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="84.5,82.25 89,82.25 93.5,74 89,65.75 84.5,65.75 89,74" fill="#22c55e" />',
        '<rect x="76.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="86" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    P15: [
        // pole
        '<rect x="28" y="8" width="4" height="90" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="-6" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="10" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="10" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bright green left arrow inside lens
        '<polygon points="18.25,74.5 18.25,70 10,65.5 1.75,70 1.75,74.5 10,70" fill="#22c55e" />',
        '<rect x="8" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="10" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        // signal box
        '<rect x="-6" y="8" width="32" height="84" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="10" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // middle amber (dim)
        '<circle cx="10" cy="50" r="8" fill="#7c5b12" stroke="#854d0e" stroke-width="1.5" />',
        // bottom black lens envelope
        '<circle cx="10" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="10.5,65.75 6,65.75 1.5,74 6,82.25 10.5,82.25 6,74" fill="#22c55e" />',
        '<rect x="9.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="10" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    M52: [

        // signal box
        '<rect x="-40" y="56" width="32" height="36" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // bottom black lens envelope
        '<circle cx="-24" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="-23.5,65.75 -28,65.75 -32.5,74 -28,82.25 -23.5,82.25 -28,74" fill="#22c55e" />',
        '<rect x="-24.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="-24" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',

        // slash
        '<line x1="-4" y1="56" x2="8" y2="92" stroke="#374151" stroke-width="3" />',

        // signal box
        '<rect x="14" y="56" width="32" height="36" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // bright green left arrow inside lens
        '<polygon points="38.25,74.5 38.25,70 30,65.5 21.75,70 21.75,74.5 30,70" fill="#22c55e" />',
        '<rect x="28" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',

        // slash
        '<line x1="50" y1="56" x2="62" y2="92" stroke="#374151" stroke-width="3" />',

        // signal box
        '<rect x="68" y="56" width="32" height="36" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // bottom black lens envelope
        '<circle cx="82" cy="74" r="8" fill="#0b0f14" stroke="#1f2937" stroke-width="1.5" />',
        // bright green right arrow inside lens
        '<polygon points="82.5,82.25 87,82.25 91.5,74 87,65.75 82.5,65.75 87,74" fill="#22c55e" />',
        '<rect x="74.5" y="72" width="10" height="4" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="84" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />'
    ],
    M53L: [
        // signal box
        '<rect x="14" y="56" width="32" height="36" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // bright green left arrow inside lens
        '<polygon points="38.25,74.5 38.25,70 30,65.5 21.75,70 21.75,74.5 30,70" fill="#22c55e" />',
        '<rect x="28" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
    ],
    M54R: [
        // signal box
        '<rect x="14" y="56" width="32" height="36" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // bright green left arrow inside lens
        '<polygon points="38.25,74.5 38.25,70 30,65.5 21.75,70 21.75,74.5 30,70" fill="#22c55e" />',
        '<rect x="28" y="73.5" width="4" height="10" rx="1.2" fill="#22c55e" />',
        // green glow
        '<circle cx="30" cy="74" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
    ],
    P21: [
        // pole
        '<rect x="28" y="66" width="4" height="42" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="60" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // bottom green pedestrian light
        '<circle cx="30" cy="50" r="8" fill="#22c55e" stroke="#16a34a" stroke-width="1.5" />',
        '<circle cx="30" cy="50" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        '<circle cx="30" cy="47" r="1.9" fill="#ffffff" />',
        '<path d="M 30 49.5 L 30 55 M 30 52 L 26.8 50.5 M 30 52 L 33.2 50.5 M 30 55 L 27.3 59 M 30 55 L 32.7 59" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />'
    ],
    P23: [
        // pole
        '<rect x="28" y="66" width="4" height="42" rx="1.5" fill="#4b5563" />',
        // signal box
        '<rect x="14" y="8" width="32" height="60" rx="7" fill="#111827" stroke="#374151" stroke-width="2" />',
        // top red (dim)
        '<circle cx="30" cy="26" r="8" fill="#6b1b1b" stroke="#7f1d1d" stroke-width="1.5" />',
        // bottom green pedestrian light
        '<circle cx="30" cy="50" r="8" fill="#22c55e" stroke="#16a34a" stroke-width="1.5" />',
        '<circle cx="30" cy="50" r="12" fill="none" stroke="#22c55e" stroke-opacity="0.45" stroke-width="2" />',
        '<circle cx="30" cy="47" r="1.9" fill="#ffffff" />',
        '<path d="M 30 49.5 L 30 55 M 30 52 L 26.8 50.5 M 30 52 L 33.2 50.5 M 30 55 L 27.3 59 M 30 55 L 32.7 59" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />'
    ],
};

// Build a full SVG string for a refname by wrapping shapes, computing viewBox from rendered bounds.
export const buildSvgForRefname = (refname) => {
    const normalizedRefname = String(refname || '').trim().toUpperCase();
    const shapes = trafficLightShapes[normalizedRefname];
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

// Build a tooltip-friendly inline SVG for traffic lights keyed by REFNAME.
// Uses a dedicated icon dictionary so tooltip visuals can differ from map symbols.
export const buildTrafficLightTooltipSvgForRefname = (refname, options = {}) => {
    const normalizedRefname = String(refname || '').trim().toUpperCase();
    const shapes = trafficLightIcon[normalizedRefname];
    if (!shapes || shapes.length === 0) return null;

    const renderedShapes = shapes.join('');
    const width = Number(options.width || 60);
    const height = Number(options.height || 110);

    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; display: block; overflow: visible;">
            <g>${renderedShapes}</g>
        </svg>
    `;
};

export default { trafficLightShapes, trafficLightIcon, buildSvgForRefname, buildTrafficLightTooltipSvgForRefname };
