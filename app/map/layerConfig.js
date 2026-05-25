import rmDimensions from '../../public/data/rm_dimension.json';

// Build lookup dictionary for road marking physical dimensions
export const rmDimensionDict = {};
if (Array.isArray(rmDimensions)) {
    rmDimensions.forEach(item => {
        rmDimensionDict[item.signNumber] = item;
    });
}

export const layersConfig = {
    "Traffic Signs": [
        "csdi:DTAD_TS_POLE_PT", "csdi:DTAD_TS_PLATE_LINE", "csdi:DTAD_TS_MISC_LINE", 
        "csdi:DTAD_TS_ABV_LINE", "csdi:DTAD_TS_POLE_LINE", "csdi:DTAD_TS_FILLED", 
        "csdi:DTAD_TS_ABV_PT", "csdi:DTAD_TS_ABV_ANNO"
    ],
    "Directional Signs": [
        "csdi:DTAD_DS_POLE_PT", "csdi:DTAD_DS_POLE_LINE", "csdi:DTAD_DS_PLATE_LINE", 
        "csdi:DTAD_DS_MISC_LINE", "csdi:DTAD_DS_POLE_LINE_C", "csdi:DTAD_DS_FILLED"
    ],
    "Pedestrian Signs": [
        "csdi:DTAD_PS_POLE_PT", "csdi:DTAD_PS_POLE_LINE", "csdi:DTAD_PS_PLATE_LINE", 
        "csdi:DTAD_PS_MISC_LINE", "csdi:DTAD_PS_FILLED", "csdi:DTAD_PS_ANNO"
    ],
    "Traffic Lights": [
        "csdi:DTAD_TRAFFIC_LIGHT_PT", "csdi:DTAD_TRAFFIC_LIGHT_LINE", "csdi:DTAD_TRAFFIC_LIGHT_FILLED"
    ],
    "Road Markings": [
        "csdi:DTAD_RD_MARK_ANNO", "csdi:DTAD_RD_MARK_SYM_PT", "csdi:DTAD_RD_MARK_SYM_LINE",
        "csdi:DTAD_RD_MARK_LINE_C", "csdi:DTAD_RD_MARK_LINE", "csdi:DTAD_CROSSING_LINE",
        "csdi:DTAD_YL_BOX_LINE", "csdi:DTAD_YL_BOX_POLY", "csdi:DTAD_TW_STRIP_LINE",
        "csdi:DTAD_TY_BAR_LINE", "csdi:DTAD_RD_AL_LINE", "csdi:DTAD_RST_ZONE_LINE",
        "csdi:DTAD_LV38_LINE", "csdi:DTAD_LV30_LINE", "csdi:DTAD_LV24_LINE",
        "csdi:DTAD_LV23_LINE", "csdi:DTAD_LV22_LINE", "csdi:DTAD_LV21_LINE",
        "csdi:DTAD_LV22_FILLED"
    ],
    "Railings": [ "csdi:DTAD_RAILING_LINE" ],
    "Miscellaneous": [
        "csdi:DTAD_GIPOLE_PT", "csdi:DTAD_MISC_PT", "csdi:DTAD_CYC_PT",
        "csdi:UNKNOWN_LINE", "csdi:DTAD_TG_PATH_LINE", "csdi:DTAD_PED_REFUGE_LINE",
        "csdi:DTAD_RUN_IN_OUT_LINE", "csdi:DTAD_DROP_KERB_LINE"
    ]
};

const legendTrafficSignSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -2.5 1 5" style="width: 100%; height: 100%; display: block; overflow: visible;">
    <circle cx="0" cy="0" r="0.2" fill="none" stroke="#222" stroke-width="0.05" />
    <line x1="0" y1="-0.2" x2="0" y2="-1" stroke="#222" stroke-width="0.05" />
    <polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />
</svg>`;

const legendDirectionalSignSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M13 18h30l8 14-8 14H13z' fill='white' stroke='black' stroke-width='3' stroke-linejoin='round'/><path d='M31 22l10 10-10 10' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><path d='M25 32h16' fill='none' stroke='black' stroke-width='3' stroke-linecap='round'/><path d='M31 46v8' stroke='black' stroke-width='4' stroke-linecap='round'/></svg>`;
const legendTrafficLightSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect x='22' y='8' width='20' height='38' rx='8' fill='white' stroke='black' stroke-width='3'/><circle cx='32' cy='17' r='4.5' fill='#d13438'/><circle cx='32' cy='27' r='4.5' fill='#f5b700'/><circle cx='32' cy='37' r='4.5' fill='#2f8f46'/><path d='M32 46v10' stroke='black' stroke-width='4' stroke-linecap='round'/></svg>`;

export const layerLegendDict = {
    "csdi:DTAD_TS_POLE_PT": {
        label: "Traffic Signs",
        kind: "icon",
        showInLegend: true,
        previewSvg: legendTrafficSignSvg,
    },
    "csdi:DTAD_DS_POLE_PT": {
        label: "Directional Signs",
        kind: "icon",
        showInLegend: true,
        previewSvg: legendDirectionalSignSvg,
    },
    "csdi:DTAD_TRAFFIC_LIGHT_PT": {
        label: "Traffic Lights",
        kind: "icon",
        showInLegend: true,
        previewSvg: legendTrafficLightSvg,
    },
    "csdi:DTAD_RD_MARK_LINE_C": {
        label: "Road Marking Line",
        kind: "line",
        showInLegend: true,
        color: "#111111",
        width: 3,
        dashArray: "10 6",
    },
    "csdi:DTAD_RAILING_LINE": {
        label: "Railings",
        kind: "line",
        showInLegend: true,
        color: "#666666",
        width: 4,
        dashArray: "4 4",
    },
    "csdi:DTAD_TG_PATH_LINE": {
        label: "Pedestrian Path",
        kind: "line",
        showInLegend: true,
        color: "#d97706",
        width: 4,
        dashArray: "12 6",
    },
};
