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
