import os
import json

from sty import Style, RgbFg, fg, rs

json_file = os.path.join(os.path.dirname(__file__), "mapColor.json")

def get_map_color():
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        color_list = []
        for layer in data.get("layers", []):
            paint = layer.get("paint")
            for key, value in paint.items():
                if key.endswith("-color"):
                    if value not in color_list:
                        color_list.append(value)
    return color_list

if __name__ == "__main__":
    color_data = get_map_color()
    for color in color_data:
        r, g, b = int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)
        fg.orange = Style(RgbFg(r,g,b))
        style_str = fg.orange + color +  ' ■■■■■■■■■■■■■■■■■■■' + fg.rs
        print(style_str)
