import glob, json
for d in ['csdi_DTAD_TRAFFIC_LIGHT_LINE', 'csdi_DTAD_TRAFFIC_LIGHT_FILLED', 'csdi_DTAD_RD_MARK_SYM_LINE', 'csdi_DTAD_RD_MARK_SYM_PT', 'csdi_DTAD_TS_PLATE_LINE', 'csdi_DTAD_TS_POLE_LINE']:
    files = glob.glob(f'public/data/wfs/{d}/*.json')
    if not files:
        print(f"{d} has no files")
        continue
    with open(files[0], 'r') as f:
        data = json.load(f)
        if data.get('features'):
            feat = data['features'][0]
            print(f"{d}: {feat.get('geometry', {}).get('type')}")
            print(f"  keys: {list(feat.get('properties', {}).keys())}")
            if 'REFNAME' in feat.get('properties', {}):
                print(f"  REFNAME: {feat['properties']['REFNAME']}")
        else:
            print(f"{d}: no features")


