import rmDimensions from '../../public/data/rm_dimension.json';
import { trafficLightShapes } from './svgShapes';

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
    "Railings": ["csdi:DTAD_RAILING_LINE"],
    "Miscellaneous": [
        "csdi:DTAD_GIPOLE_PT", "csdi:DTAD_MISC_PT", "csdi:DTAD_CYC_PT",
        "csdi:UNKNOWN_LINE", "csdi:DTAD_TG_PATH_LINE", "csdi:DTAD_PED_REFUGE_LINE",
        "csdi:DTAD_RUN_IN_OUT_LINE", "csdi:DTAD_DROP_KERB_LINE"
    ]
};

const legendTrafficSignSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -2 0.5 2.5" style="width: 100%; height: 100%; display: block; overflow: visible;">
    <circle cx="0" cy="0" r="0.2" fill="none" stroke="#222" stroke-width="0.05" />
    <line x1="0" y1="-0.2" x2="0" y2="-1" stroke="#222" stroke-width="0.05" />
    <polygon points="-0.2,-1 0.2,-1 0,-2" fill="black" />
</svg>`;

const legendDirectionalSignSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -1 1 2" style="width: 100%; height: 100%; display: block; overflow: visible;">
    <circle cx="-0.35" cy="0.2" r="0.2" fill="none" stroke="#222" stroke-width="0.05" />
    <circle cx="0.35" cy="0.2" r="0.2" fill="none" stroke="#222" stroke-width="0.05" />
    <line x1="-1" y1="-0.2" x2="1" y2="-0.2" stroke="#222" stroke-width="0.05" />
</svg>`;

const buildTrafficLightLegendSvg = (refname) => {
    const shapes = trafficLightShapes[refname];
    if (!Array.isArray(shapes) || shapes.length === 0) return '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -2.5 3 3" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; display: block; overflow: visible;">
        <g>${shapes.join('')}</g>
    </svg>`;
};

const trafficLightLegendVariants = Object.keys(trafficLightShapes)
    .sort((left, right) => left.localeCompare(right))
    .map(refname => ({
        key: refname,
        label: refname,
        kind: 'icon',
        previewSvg: buildTrafficLightLegendSvg(refname),
    }));

const legendTrafficLightSvg = buildTrafficLightLegendSvg('P01');

const legendRailingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -1.5 0.5 3" style="width: 100%; height: 100%; display: block; overflow: visible;">
    <line x1="-1" y1="0" x2="1" y2="0" stroke="#222" stroke-width="0.1" />
    <line x1="-1.25" y1="-0.5" x2="-1.25" y2="0.5" stroke="#222" stroke-width="0.1" />
    <line x1="1.25" y1="-0.5" x2="1.25" y2="0.5" stroke="#222" stroke-width="0.1" />
</svg>`;

const legendTactilePedPathSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -1.5 0.5 3" style="width: 100%; height: 100%; display: block; overflow: visible;">
    <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#222" stroke-width="0.1" />
        <polygon points="-0.225,-0.225 0.225,-0.225 0.225,0.225 -0.225,0.225" fill="none" stroke="#222" stroke-width="0.1" />
</svg>`;

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
        subLegendLabel: "Traffic light variants",
        subLegend: trafficLightLegendVariants,
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
        kind: "icon",
        showInLegend: true,
        previewSvg: legendRailingSvg,
    },
    "csdi:DTAD_TG_PATH_LINE": {
        label: "Tactile Pedestrian Path",
        kind: "icon",
        showInLegend: true,
        previewSvg: legendTactilePedPathSvg,
    },
};
