// Library for Road Marking Line Styles and Icons
// Maps 'LINETYPE' attribute to both visual styles (dashes, colors) and icon definitions
// Format based on Leaflet Path options: https://leafletjs.com/reference.html#path
// Icon fields: iconType, iconInterval (ms), iconSize (pixels), iconSvg (embedded SVG)

const roadMarkingStylesByLayer = {
    'csdi:DTAD_RD_MARK_LINE_C': {

        // RM1107: Lane Line 
        "RM1107": [
            {
                dashMeters: [1, 1],
                weight: 2
            }
        ],
        "RM1108": [
            {
                dashMeters: [1, 3.5],
                weight: 2
            }
        ],

        // Example: Long Broken Line
        "RM1104": [
            {
                dashMeters: [4, 2], // Example: 4m line, 2m gap
                weight: 2
            }
        ],

        "RM1143": [
            {
                dashMeters: [1, 1], // Example: 4m line, 2m gap
                weight: 2
            }
        ],

        // RM1001: Double White Lines
        "RM1001": [
            // Left line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: -0.175 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: 0.175 // Offset 0.5m to the right
            }
        ],

        // (CONTINUOUS)
        "(CONTINUOUS)": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // AMT
        "AMT": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // AMT1
        "AMT1": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // AMT1.5_1.0
        "AMT1.5_1.0": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // AMT2_1.5
        "AMT2_1.5": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // CBARRIER
        "CBARRIER": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // CONTINUOUS
        "CONTINUOUS": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // CRAIL1
        "CRAIL1": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // CRAIL2
        "CRAIL2": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // CRASHGATE
        "CRASHGATE": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // EAG 3
        "EAG 3": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // HCAIL2
        "HCAIL2": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // Leader Line
        "Leader Line": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1002
        "RM1002": [
            // Left line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: -0.175 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: [1, 5], // Solid
                weight: 2,
                offset: 0.175 // Offset 0.5m to the right
            }
        ],

        // RM1003
        "RM1003": [
            // Left line
            {
                dashMeters: [1, 5], // Solid
                weight: 2,
                offset: -0.175 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: 0.175 // Offset 0.5m to the right
            }
        ],

        // RM1007
        "RM1007": [
            {
                dashMeters: [1, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1011
        "RM1011": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1012
        "RM1012": [
            // Left line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: -0.25 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: 0.25 // Offset 0.5m to the right
            }
        ],

        // RM1013
        "RM1013": [
            // Left line
            {
                dashMeters: [0.6, 0.3], // Solid
                weight: 2,
                offset: -0.2 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: [0.6, 0.3], // Solid
                weight: 2,
                offset: 0.2 // Offset 0.5m to the right
            }
        ],

        // RM1037
        "RM1037": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1040
        "RM1040": [
            // Left line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: -0.1, // Offset 0.5m to the left
                color: "#ffef00",
            },
            // Right line
            {
                dashMeters: null, // Solid
                weight: 2,
                color: "#ffef00",
                offset: 0.1 // Offset 0.5m to the right
            }
        ],

        // RM1041
        "RM1041": [
            {
                dashMeters: null,
                weight: 2,
                color: "#ffef00",
                opacity: 0.8
            }
        ],

        // RM1048
        "RM1048": [
            {
                dashMeters: [1, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1049
        "RM1049": [
            // Left line
            {
                dashMeters: [1, 1], // Solid
                weight: 2,
                offset: 0 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: [1, 1], // Solid
                weight: 2,
                offset: 0, // Offset 0.5m to the right
                shift: 1,
                color: "#ffef00",
            }
        ],

        // RM1101
        "RM1101": [
            {
                dashMeters: [1, 5],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1102
        "RM1102": [
            {
                dashMeters: [2, 7],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1103
        "RM1103": [
            {
                dashMeters: [3, 5],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1105
        "RM1105": [
            {
                dashMeters: [6, 3],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1106
        "RM1106": [
            {
                dashMeters: [0.6, 0.3],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1109
        "RM1109": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1134
        "RM1134": [
            {
                dashMeters: [4, 2],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1161
        "RM1161": [
            {
                dashMeters: [2, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1162
        "RM1162": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // RM1165
        "RM1165": [
            {
                dashMeters: [0.3, 0.15],
                weight: 2,
                color: "#000000",
                offset: 0.125,
                opacity: 0.8
            },
            {
                dashMeters: [0.3, 0.15],
                weight: 2,
                color: "#000000",
                offset: -0.125,
                opacity: 0.8
            },
        ],

        // SHORT-DASHED
        "SHORT-DASHED": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // SOLID
        "SOLID": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // Solid
        "Solid": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // ULSTUD12
        "ULSTUD12": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 12000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,14 106,100 14,100' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // ULSTUD18
        "ULSTUD18": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 18000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,14 106,100 14,100' fill='none' stroke='black' stroke-width='20'/></svg>"
            }
        ],

        // ULSTUD6
        "ULSTUD6": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 6000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,14 106,100 14,100' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // ULSTUD9
        "ULSTUD9": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 9000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,14 106,100 14,100' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // URSTUD18
        "URSTUD18": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 18000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 106,14 14,14' fill='none' stroke='black' stroke-width='20'/></svg>"
            }
        ],

        // URSTUD6
        "URSTUD6": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 6000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 106,14 14,14' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // URSTUD9
        "URSTUD9": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 9000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 106,14 14,14' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // ULSTUD4
        "ULSTUD4": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 4000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,14 106,100 14,100' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // ULSTUD8
        "ULSTUD8": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 8000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,14 106,100 14,100' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // ULSTUD15
        "ULSTUD15": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 15000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,14 106,100 14,100' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // URSTUD4
        "URSTUD4": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 4000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 106,14 14,14' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // URSTUD8
        "URSTUD8": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 8000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 106,14 14,14' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // URSTUD12
        "URSTUD12": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 12000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 106,14 14,14' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // URSTUD15
        "URSTUD15": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "triangle",
                iconInterval: 15000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 106,14 14,14' fill='none' stroke='black' stroke-width='2'/></svg>"
            }
        ],

        // BSTUD4
        "BSTUD4": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "diamond",
                iconInterval: 4000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 100,60 60,20 20,60' fill='none' stroke='black' stroke-width='20'/></svg>"
            }
        ],

        // BSTUD6
        "BSTUD6": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "diamond",
                iconInterval: 6000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 100,60 60,20 20,60' fill='none' stroke='black' stroke-width='20'/></svg>"
            }
        ],

        // BSTUD8
        "BSTUD8": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8,
                iconType: "diamond",
                iconInterval: 8000,
                iconSize: 10,
                iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,100 100,60 60,20 20,60' fill='none' stroke='black' stroke-width='20'/></svg>"
            }
        ],

        // ZEBRA1
        "ZEBRA1": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // ZEBRA3
        "ZEBRA3": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // ZEBRA4
        "ZEBRA4": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // ZEBRA5
        "ZEBRA5": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // ZEBRA9
        "ZEBRA9": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        // ZIGZAGL
        "ZIGZAGL": [
            {
                iconType: "zigzag",
                iconInterval: 4.5,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: 0, y1: 0, x2: -0.6, y2: 2, strokeWidth: 200 },
                        { type: 'line', x1: -0.6, y1: 2.15, x2: 0, y2: 4.15, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            //{
        ],

        // ZIGZAGR
        "ZIGZAGR": [
            {
                iconType: "zigzag",
                iconInterval: 4.5,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: 0, y1: 0, x2: 0.6, y2: 2, strokeWidth: 200 },
                        { type: 'line', x1: 0.6, y1: 2.15, x2: 0, y2: 4.15, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            //{
            //    dashMeters: null,
            //    weight: 2,
            //    color: "#000000",
            //    opacity: 0.8,
            //    iconType: "zigzag",
            //    iconInterval: 100,
            //    iconSize: 125,
            //    iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-500 0 1000 4500'><path d='M 0 0 L 300 2000 M 300 2300 L 0 4300' fill='none' stroke='black' stroke-width='50' stroke-linecap='round'/></svg>"
            //}
        ],

        // Default Fallback
        "DEFAULT": [
            {
                dashMeters: null, // solid line
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ]
    },
    'csdi:DTAD_RD_MARK_SYM_LINE': {
        // Symbol line styles use REFNAME numeric keys (e.g., "1048")
        // 1048 mirrors RM1048 from RD_MARK_LINE_C
        "1048": [
            {
                dashMeters: [1, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        // Default fallback for symbol-line layer
        "DEFAULT": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ]
    },
    'csdi:DTAD_LV22_LINE': {
        // Default Fallback for LV22 - references same styles as RD_MARK_LINE_C
        "DEFAULT": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "( DASHED )": [
            {
                dashMeters: [1, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "SHORT-DASHED": [
            {
                dashMeters: [0.25, 0.25],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "1013": [
            {
                dashMeters: [0.6, 0.3], // Solid
                weight: 2,
                offset: -0.2 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: [0.6, 0.3], // Solid
                weight: 2,
                offset: 0.2 // Offset 0.5m to the right
            }
        ],
        "1049": [
            // Left line
            {
                dashMeters: [1, 1], // Solid
                weight: 2,
                offset: 0 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: [1, 1], // Solid
                weight: 2,
                offset: 0, // Offset 0.5m to the right
                shift: 1,
                color: "#ffef00",
            }
        ],
        "1101": [
            {
                dashMeters: [1, 5],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "1102": [
            {
                dashMeters: [2, 7],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "1103": [
            {
                dashMeters: [3, 5],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "1104": [
            {
                dashMeters: [4, 2],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "1105": [
            {
                dashMeters: [6, 3],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "1106": [
            {
                dashMeters: [0.6, 0.3],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "1107": [
            {
                dashMeters: [1, 1],
                weight: 2
            }
        ],
        "1161": [
            {
                dashMeters: [2, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "RM1007": [
            {
                dashMeters: [1, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "RM1012": [
            // Left line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: -0.25 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: 0.25 // Offset 0.5m to the right
            }
        ],

        "RM1013": [
            // Left line
            {
                dashMeters: [0.6, 0.3], // Solid
                weight: 2,
                offset: -0.2 // Offset 0.5m to the left
            },
            // Right line
            {
                dashMeters: [0.6, 0.3], // Solid
                weight: 2,
                offset: 0.2 // Offset 0.5m to the right
            }
        ],

        "RM1048": [
            {
                dashMeters: [1, 1],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        "RM1104": [
            {
                dashMeters: [4, 2],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        "RM1107": [
            {
                dashMeters: [1, 1],
                weight: 2
            }
        ],

        "RM1133": [
            {
                dashMeters: [4, 2],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

        "RM1162": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],

    },
    'csdi:DTAD_TG_PATH_LINE': {
        // Default Fallback for TG_PATH - references same styles as RD_MARK_LINE_C
        "DEFAULT": [
            {
                iconType: "sequare",
                iconInterval: 1.25,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.1, y1: -0.1, x2: 0.1, y2: -0.1, strokeWidth: 200 },
                        { type: 'line', x1: 0.1, y1: -0.1, x2: 0.1, y2: 0.1, strokeWidth: 200 },
                        { type: 'line', x1: 0.1, y1: 0.1, x2: -0.1, y2: 0.1, strokeWidth: 200 },
                        { type: 'line', x1: -0.1, y1: 0.1, x2: -0.1, y2: -0.1, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [1.5, 0.2],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ]
    },
    'csdi:DTAD_RST_ZONE_LINE': {
        "DEFAULT": [
            {
                dashMeters: null,
                weight: 2,
                color: "#ffef00",
                opacity: 0.8
            }
        ],
    },
    'csdi:DTAD_YL_BOX_LINE': {
        "DEFAULT": [
            {
                dashMeters: null,
                weight: 2,
                color: "#ffef00",
                opacity: 0.8
            }
        ],
    },
    'csdi:DTAD_RAILING_LINE': {
        // Default Fallback for RAILING - references same styles as RD_MARK_LINE_C
        "DEFAULT": [
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "AMT": [
            {
                iconType: "rail",
                iconInterval: 2,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [2, 2],
                startDistance: 0,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "AMT1": [
            {
                iconType: "rail",
                iconInterval: 3,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                        { type: 'line', x1: -0.25, y1: 2, x2: 0.25, y2: 2, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [1.6, 1.4],
                startDistance: 0.2,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "AMT-1.5": [
            {
                iconType: "rail",
                iconInterval: 2,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                iconType: "rail",
                iconInterval: 3,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0.1, x2: 0.25, y2: 0.1, strokeWidth: 200 },
                        { type: 'line', x1: -0.25, y1: 1.4, x2: 0.25, y2: 1.4, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [0.9, 1.9],
                startDistance: 0.2,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "AMT1.5_1.0": [
            {
                iconType: "rail",
                iconInterval: 2.5,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                        { type: 'line', x1: -0.25, y1: 1.5, x2: 0.25, y2: 1.5, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [1.5, 1],
                startDistance: 0,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "AMT2_1.5": [
            {
                iconType: "rail",
                iconInterval: 3.5,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                        { type: 'line', x1: -0.25, y1: 2, x2: 0.25, y2: 2, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [1.5, 2],
                startDistance: 0.25,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "AMT-COM-1_7": [
            {
                iconType: "rail",
                iconInterval: 1.7,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [0.7, 1],
                startDistance: 0.5,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "bollard0": [
            {
                iconType: "circle",
                iconInterval: 3,
                iconGeometry: {
                    shapes: [
                        { type: 'circle', x: 0, y: 0, radius: 0.025, strokeWidth: 0.02 }
                    ],
                    stroke: '#000000'
                }
            }
        ],
        "bollard1": [
            {
                iconType: "circle",
                iconInterval: 3,
                iconGeometry: {
                    shapes: [
                        { type: 'circle', x: 0, y: 0, radius: 0.025, strokeWidth: 0.02 }
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "bollard2": [
            {
                iconType: "circle",
                iconInterval: 3,
                iconGeometry: {
                    shapes: [
                        { type: 'circle', x: 0, y: 0, radius: 0.025, strokeWidth: 0.02 }
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "bollard3": [
            {
                iconType: "circle",
                iconInterval: 3,
                iconGeometry: {
                    shapes: [
                        { type: 'circle', x: 0, y: 0, radius: 0.025, strokeWidth: 0.02 }
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "BOLLSTL3M": [
            {
                iconType: "circle",
                iconInterval: 3,
                iconGeometry: {
                    shapes: [
                        { type: 'circle', x: 0, y: 0, radius: 0.025, strokeWidth: 0.02 }
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [1.5, 1.5],
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "CBARRIER": [
            {
                iconType: "line",
                iconInterval: 5,
                iconGeometry: {
                    shapes: [
                        { type: 'line', x1: -0.25, y1: -0.25, x2: 0.25, y2: 0.25, strokeWidth: 200 },
                        { type: 'line', x1: -0.25, y1: 0.25, x2: 0.25, y2: -0.25, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [3, 2],
                startDistance: 1,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "CRAIL1": [
            {
                iconType: "rail",
                iconInterval: 2,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [1.5, 0.5],
                startDistance: 0.25,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "CRAIL2": [
            {
                iconType: "rail",
                iconInterval: 1.25,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.5m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [0.75, 0.5],
                startDistance: 0.25,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "CRASHGATE": [
            {
                iconType: "circle",
                iconInterval: 3.5,
                iconGeometry: {
                    shapes: [
                        { type: 'circle', x: 0, y: 0, radius: 0.025, strokeWidth: 0.02 }
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: [3, 0.5],
                startDistance: 0.5,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
        "HCAIL2": [
            {
                dashMeters: null, // Solid
                weight: 2,
                offset: -0.1, // Offset 0.5m to the left
                color: "#000000",
            },
            // Right line
            {
                dashMeters: null, // Solid
                weight: 2,
                color: "#000000",
                offset: 0.1 // Offset 0.5m to the right
            },
            {
                iconType: "rail",
                iconInterval: 1.25,
                // Geometry in meters. Renderer expects meters for iconGeometry.
                iconGeometry: {
                    shapes: [
                        // Horizontal tick at top (0.25m wide)
                        { type: 'line', x1: -0.25, y1: 0, x2: 0.25, y2: 0, strokeWidth: 200 },
                    ],
                    stroke: '#000000'
                }
            },
        ],
        "RCB 4": [
            {
                iconType: "circle",
                iconInterval: 3,
                iconGeometry: {
                    shapes: [
                        { type: 'circle', x: 0, y: 0, radius: 0.1, strokeWidth: 0.02 }
                    ],
                    stroke: '#000000'
                }
            },
            {
                dashMeters: null,
                weight: 2,
                color: "#000000",
                opacity: 0.8
            }
        ],
    }
};

/**
 * Calculates meters per pixel at a specific latitude and zoom level.
 * Based on Web Mercator projection.
 */
export function getMetersPerPixel(lat, zoom) {
    const earthCircumference = 40075016.686;
    return earthCircumference * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom + 8);
}

/**
 * Helper to offset lat/lngs by meters. 
 * Use a simple planar approximation suitable for high zoom visual adjustments.
 */
export function getOffsetLatLngs(latlngs, offsetMeters, map) {
    if (!offsetMeters || offsetMeters === 0) return latlngs;
    if (!map) return latlngs;

    // Convert meters to pixels at current zoom
    const zoom = map.getZoom();
    const centerLat = map.getCenter().lat;
    const metersPerPx = getMetersPerPixel(centerLat, zoom);
    const offsetPx = offsetMeters / metersPerPx;

    // We need to operate on Points (pixels)
    const points = latlngs.map(ll => map.latLngToLayerPoint(ll));
    const newPoints = [];

    // Basic offset calculation for lines
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        let pNext = points[i + 1];
        let pPrev = points[i - 1];

        // Determine vector direction
        let angle;
        if (pNext && pPrev) {
            // Interior point
            const angle1 = Math.atan2(p1.y - pPrev.y, p1.x - pPrev.x);
            // Simplification: Use angle from previous segment
            angle = angle1;
        } else if (pNext) {
            angle = Math.atan2(pNext.y - p1.y, pNext.x - p1.x);
        } else if (pPrev) {
            angle = Math.atan2(p1.y - pPrev.y, p1.x - pPrev.x);
        } else {
            newPoints.push(p1); continue;
        }

        // Add 90 degrees for normal
        const normal = angle + Math.PI / 2;

        newPoints.push(L.point(
            p1.x + Math.cos(normal) * offsetPx,
            p1.y + Math.sin(normal) * offsetPx
        ));
    }

    // Convert back to LatLng
    return newPoints.map(p => map.layerPointToLatLng(p));
}

/**
 * Retrieves the styles and icons for a line type on a specific layer.
 * Returns config with both visual styles (dashes, colors) and icon definitions.
 * Converts config format to Leaflet style options plus icon properties.
 * 
 * @param {string} layerName - The layer name (e.g., 'csdi:DTAD_RD_MARK_LINE_C')
 * @param {string} lineType - The line type code (e.g., 'ULSTUD12', 'ZIGZAGL')
 * @returns {Array} Array of style configs with icon definitions
 */
export function getLineDefinition(layerName, lineType) {
    // Get layer-specific styles, fallback to RD_MARK_LINE_C if layer not found
    const layerStyles = roadMarkingStylesByLayer[layerName] || roadMarkingStylesByLayer['csdi:DTAD_RD_MARK_LINE_C'];

    // Get config (array or single object fallback)
    let config = layerStyles[lineType] || layerStyles["DEFAULT"];

    // Ensure array
    if (!Array.isArray(config)) {
        config = [config];
    }

    // Process each component
    return config.map(styleDef => {
        // Enforce Black Color if not explicitly overridden
        let def = {
            color: "#000000",
            opacity: 0.8,
            weight: 2,
            ...styleDef
        };

        // Optionally capitalize key colors
        if (!styleDef.color && def.color !== "#000000") {
            def.color = def.color.toUpperCase();
        }

        return def;
    });
}

/**
 * Retrieves the styles array (legacy, for backward compatibility).
 * Converts config format to Leaflet style options.
 */
export function getLineStyles(layerName, lineType) {
    return getLineDefinition(layerName, lineType);
}
