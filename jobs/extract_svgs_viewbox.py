import os
import re
import copy
import glob
import json
from lxml import etree
import math
import fitz # PyMuPDF
try:
    from PIL import Image
    import pytesseract
    import io
    # Add Tesseract path
    tesseract_dir = r"C:\Program Files\Tesseract-OCR"
    if os.path.exists(tesseract_dir):
        os.environ['PATH'] += os.pathsep + tesseract_dir
        pytesseract.pytesseract.tesseract_cmd = os.path.join(tesseract_dir, "tesseract.exe")
except ImportError:
    print("Warning: PIL or pytesseract not installed. OCR will be skipped.")
    Image, pytesseract, io = None, None, None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Parameters
# input_svg_path is now determined dynamically in __main__
output_dir = os.path.join(BASE_DIR, "web", "public", "data", "svgs")
DEBUG = False
SCALE_FACTOR = 10.0 # Scaling 10x as requested ("1- times")

# --------------------------------------------------------------------------
# USER CONFIGURATION: Set SPECIFIC_FILES to process only specific files.
# If this list is empty, ALL .svg files will be processed.
SPECIFIC_FILES = [
     # Example: "(TS 601 - 700)_page1.svg",
     "(RM 1001 - 1080)_page1.svg",
     "(RM 1101 - 1180)_page1.svg",
]
# --------------------------------------------------------------------------

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Grid Parameters from original script
col_start_x = 111.171
row_start_y = 20.304
col_width = 56.7
row_height = 26.928

col_stride = 109.134
row_stride = 26.928

rows = 21
cols = 5
# start_id is now determined dynamically per file

# Special Grids Configuration
SPECIAL_GRIDS = {
    "(TS 601 - 700)_page1.svg": {
        "cols": 6,
        "col_start_x": 56.655,
        "col_width": 56.67,
        "col_stride": 109.11,
        "double_row_ids": {636, 639, 649, 651, 653, 659, 660, 691, 694}
    },
    "(TS 2601 - 2717)_page1.svg": {
        "cols": 6,
        "col_start_x": 56.655,
        "col_width": 56.67,
        "col_stride": 109.11,
        "double_row_ids": {2629, 2663, 2668, 2674, 2679, 2684, 2691},
        "triple_row_ids": {2701}
    },
    "(TS 3601 - 3705)_page1.svg": {
        "cols": 6,
        "col_start_x": 56.655,
        "col_width": 56.67,
        "col_stride": 109.11,
        "double_row_ids": {3643, 3649, 3650, 3651},
    },
    "(TS 3811 - 3936)_page1.svg": {
        "cols": 6,
        "col_start_x": 56.655,
        "col_width": 56.67,
        "col_stride": 109.11,
    },
    "(TS 3937 - 4062)_page1.svg": {
        "cols": 6,
        "col_start_x": 56.655,
        "col_width": 56.67,
        "col_stride": 109.11,
    },
    "(RM 1001 - 1080)_page1.svg": {
        "cols": 4,
        "rows": 20,
        "col_start_x": 43.185,
        "col_width": 39.66,
        "col_stride": 172.89,
        "row_start_y": 18.345,
        "row_height": 28.35,
        "row_stride": 28.35,
    },
    "(RM 1101 - 1180)_page1.svg": {
        "cols": 4,
        "rows": 20,
        "col_start_x": 43.185,
        "col_width": 39.66,
        "col_stride": 172.89,
        "row_start_y": 18.345,
        "row_height": 28.35,
        "row_stride": 28.35,
    },
}

NS = {
    'svg': 'http://www.w3.org/2000/svg',
    'xlink': 'http://www.w3.org/1999/xlink',
    'inkscape': 'http://www.inkscape.org/namespaces/inkscape'
}

def clean_tag(tag):
    if '}' in tag:
        return tag.split('}', 1)[1]
    return tag

def has_renderable_content(node):
    tag = clean_tag(node.tag)
    # Direct renderable elements
    if tag in ['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'image', 'use']:
        return True
    # Containers that might hold renderable elements
    if tag in ['g', 'a', 'switch', 'svg']: 
        for child in node:
            if has_renderable_content(child):
                return True
    return False

class Matrix:
    def __init__(self, a=1, b=0, c=0, d=1, e=0, f=0):
        # SVG Matrix: [a c e]
        #             [b d f]
        self.a, self.b, self.c, self.d, self.e, self.f = a, b, c, d, e, f

    def multiply(self, other):
        # Result = Self * Other (transform composition)
        # Verify: If transform="A B", point p becomes A(B(p)).
        # It means B is applied first, then A.
        # But in SVG: transform="translate(..) scale(..)"
        # This is effectively T * S * p.
        # So we accumulate: Current * Next.
        return Matrix(
            self.a * other.a + self.c * other.b,
            self.b * other.a + self.d * other.b,
            self.a * other.c + self.c * other.d,
            self.b * other.c + self.d * other.d,
            self.a * other.e + self.c * other.f + self.e,
            self.b * other.e + self.d * other.f + self.f
        )
    
    def transform_point(self, x, y):
        return (
            self.a * x + self.c * y + self.e,
            self.b * x + self.d * y + self.f
        )
    
    def __repr__(self):
        return f"Matrix({self.a},{self.b},{self.c},{self.d},{self.e},{self.f})"

def parse_transform(transform_str):
    m = Matrix()
    if not transform_str:
        return m
    
    # Simple parser for "matrix(a,b,c,d,e,f)"
    # Handles multiple matrix(...) occurrences
    pattern = r'matrix\s*\(([^)]+)\)'
    matches = re.finditer(pattern, transform_str)
    
    for match in matches:
        args = match.group(1).replace(',', ' ')
        nums = [float(x) for x in args.split() if x]
        if len(nums) == 6:
            # Create matrix
            next_m = Matrix(*nums)
            m = m.multiply(next_m)
            
    # Note: Does not support translate, scale, rotate, skewX/Y yet.
    # If the input SVG uses them, the transform calculation will be incomplete (identity used).
    # Since the sample only showed 'matrix', this is acceptable for now.
    
    return m

def solve_cubic_extrema(p0, p1, p2, p3):
    # Solves for t where B'(t) = 0 for 1D cubic Bezier:
    # B(t) = (1-t)^3*p0 + 3(1-t)^2*t*p1 + 3(1-t)t^2*p2 + t^3*p3
    # B'(t) = 3(1-t)^2(p1-p0) + 6(1-t)t(p2-p1) + 3t^2(p3-p2)
    # This is a quadratic equation at^2 + bt + c = 0
    # a = 3(-p0 + 3p1 - 3p2 + p3)
    # b = 6(p0 - 2p1 + p2)
    # c = 3(p1 - p0)
    
    a = 3 * (-p0 + 3*p1 - 3*p2 + p3)
    b = 6 * (p0 - 2*p1 + p2)
    c = 3 * (p1 - p0)
    
    vals = [p0, p3] # Endpoints
    
    if abs(a) < 1e-9:
        if abs(b) > 1e-9:
            t = -c / b
            if 0 < t < 1:
                vals.append((1-t)**3*p0 + 3*(1-t)**2*t*p1 + 3*(1-t)*t**2*p2 + t**3*p3)
    else:
        disc = b*b - 4*a*c
        if disc >= 0:
            sqrt_disc = math.sqrt(disc)
            t1 = (-b + sqrt_disc) / (2*a)
            t2 = (-b - sqrt_disc) / (2*a)
            for t in [t1, t2]:
                if 0 < t < 1:
                    vals.append((1-t)**3*p0 + 3*(1-t)**2*t*p1 + 3*(1-t)*t**2*p2 + t**3*p3)
    return min(vals), max(vals)

def get_path_bbox(d):
    if not d:
        return None
    
    # Path parser
    # Split into tokens: commands and numbers
    # Command letters: M, m, L, l, H, h, V, v, C, c, S, s, Q, q, T, t, A, a, Z, z
    # Numbers: float format
    tokens = re.findall(r'[a-zA-Z]|[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?', d)
    
    curr_x, curr_y = 0.0, 0.0
    start_x, start_y = 0.0, 0.0
    
    # We use lists to easily update via nonlocal in helper
    bounds = {'min_x': float('inf'), 'min_y': float('inf'), 'max_x': float('-inf'), 'max_y': float('-inf')}
    
    def update(x, y):
        bounds['min_x'] = min(bounds['min_x'], x)
        bounds['max_x'] = max(bounds['max_x'], x)
        bounds['min_y'] = min(bounds['min_y'], y)
        bounds['max_y'] = max(bounds['max_y'], y)

    idx_ptr = [0]
    count = len(tokens)
    
    last_ctrl_x, last_ctrl_y = 0.0, 0.0 # For S/T commands
    
    current_cmd = 'M' # Default start
    last_cmd_code = None
    
    def get_nums(n):
        res = []
        for _ in range(n):
            if idx_ptr[0] < count:
                val = tokens[idx_ptr[0]]
                # Verify it is a number
                if val[0].isalpha():
                    return None
                idx_ptr[0] += 1
                res.append(float(val))
            else:
                return None
        return res

    while idx_ptr[0] < count:
        token = tokens[idx_ptr[0]]
        
        if token[0].isalpha():
            current_cmd = token
            idx_ptr[0] += 1
            # Reset implicitly repeated command logic
            # (handled by checking current_cmd later)
        else:
            # Repeated command logic
            if current_cmd == 'M': current_cmd = 'L'
            elif current_cmd == 'm': current_cmd = 'l'
            # else keep current_cmd
            
        c = current_cmd
        
        if c == 'M': # Move Abs
            nums = get_nums(2)
            if nums:
                curr_x, curr_y = nums[0], nums[1]
                start_x, start_y = curr_x, curr_y
                update(curr_x, curr_y)
                last_cmd_code = 'M'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y

        elif c == 'm': # Move Rel
            nums = get_nums(2)
            if nums:
                curr_x += nums[0]
                curr_y += nums[1]
                start_x, start_y = curr_x, curr_y
                update(curr_x, curr_y)
                last_cmd_code = 'm'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y

        elif c == 'L': # Line Abs
            nums = get_nums(2)
            if nums:
                curr_x, curr_y = nums[0], nums[1]
                update(curr_x, curr_y)
                last_cmd_code = 'L'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y

        elif c == 'l': # Line Rel
            nums = get_nums(2)
            if nums:
                curr_x += nums[0]
                curr_y += nums[1]
                update(curr_x, curr_y)
                last_cmd_code = 'l'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y

        elif c == 'H': # Horiz Abs
            nums = get_nums(1)
            if nums:
                curr_x = nums[0]
                update(curr_x, curr_y)
                last_cmd_code = 'H'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y

        elif c == 'h': # Horiz Rel
            nums = get_nums(1)
            if nums:
                curr_x += nums[0]
                update(curr_x, curr_y)
                last_cmd_code = 'h'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y

        elif c == 'V': # Vert Abs
            nums = get_nums(1)
            if nums:
                curr_y = nums[0]
                update(curr_x, curr_y)
                last_cmd_code = 'V'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y

        elif c == 'v': # Vert Rel
            nums = get_nums(1)
            if nums:
                curr_y += nums[0]
                update(curr_x, curr_y)
                last_cmd_code = 'v'
                last_ctrl_x, last_ctrl_y = curr_x, curr_y
                
        elif c == 'C': # Cubic Abs (x1 y1 x2 y2 x y)
            nums = get_nums(6)
            if nums:
                p0x, p0y = curr_x, curr_y
                p1x, p1y = nums[0], nums[1]
                p2x, p2y = nums[2], nums[3]
                p3x, p3y = nums[4], nums[5]
                
                # Calculate bounds for curve segment
                x_min, x_max = solve_cubic_extrema(p0x, p1x, p2x, p3x)
                y_min, y_max = solve_cubic_extrema(p0y, p1y, p2y, p3y)
                
                update(x_min, y_min)
                update(x_max, y_max)
                
                curr_x, curr_y = p3x, p3y
                last_ctrl_x, last_ctrl_y = p2x, p2y
                last_cmd_code = 'C'

        elif c == 'c': # Cubic Rel
            nums = get_nums(6)
            if nums:
                # Relative points: absolute coords are curr + relative
                p1x, p1y = curr_x + nums[0], curr_y + nums[1]
                p2x, p2y = curr_x + nums[2], curr_y + nums[3]
                p3x, p3y = curr_x + nums[4], curr_y + nums[5]
                
                x_min, x_max = solve_cubic_extrema(curr_x, p1x, p2x, p3x)
                y_min, y_max = solve_cubic_extrema(curr_y, p1y, p2y, p3y)
                
                update(x_min, y_min)
                update(x_max, y_max)
                
                curr_x, curr_y = p3x, p3y
                last_ctrl_x, last_ctrl_y = p2x, p2y
                last_cmd_code = 'c'
        
        elif c == 'S': # Smooth Cubic Abs
            nums = get_nums(4)
            if nums:
                p1x, p1y = curr_x, curr_y
                if last_cmd_code in ['C', 'c', 'S', 's']:
                    p1x = 2*curr_x - last_ctrl_x
                    p1y = 2*curr_y - last_ctrl_y
                
                p2x, p2y = nums[0], nums[1]
                p3x, p3y = nums[2], nums[3]
                
                x_min, x_max = solve_cubic_extrema(curr_x, p1x, p2x, p3x)
                y_min, y_max = solve_cubic_extrema(curr_y, p1y, p2y, p3y)
                update(x_min, y_min)
                update(x_max, y_max)
                
                curr_x, curr_y = p3x, p3y
                last_ctrl_x, last_ctrl_y = p2x, p2y
                last_cmd_code = 'S'
                
        elif c == 's': # Smooth Cubic Rel
            nums = get_nums(4)
            if nums:
                p1x, p1y = curr_x, curr_y
                if last_cmd_code in ['C', 'c', 'S', 's']:
                    p1x = 2*curr_x - last_ctrl_x
                    p1y = 2*curr_y - last_ctrl_y
                
                p2x, p2y = curr_x + nums[0], curr_y + nums[1]
                p3x, p3y = curr_x + nums[2], curr_y + nums[3]
                
                x_min, x_max = solve_cubic_extrema(curr_x, p1x, p2x, p3x)
                y_min, y_max = solve_cubic_extrema(curr_y, p1y, p2y, p3y)
                update(x_min, y_min)
                update(x_max, y_max)
                
                curr_x, curr_y = p3x, p3y
                last_ctrl_x, last_ctrl_y = p2x, p2y
                last_cmd_code = 's'
                
        elif c == 'Z' or c == 'z':
            curr_x, curr_y = start_x, start_y
            last_cmd_code = 'Z'
            
        else:
            # Skip unknown commands? 
            # If we don't handle it, we might misinterpret subsequent numbers.
            # Fallback: Just consume one token unless we know better.
             pass

    if bounds['min_x'] == float('inf'):
        # Fallback to simple parser if something failed or empty
         nums = re.findall(r'[+\-]?\d*\.?\d+(?:[eE][+\-]?\d+)?', d)
         if not nums: return None
         values = [float(x) for x in nums]
         return (min(values), min(values), max(values), max(values))
         
    return (bounds['min_x'], bounds['min_y'], bounds['max_x'], bounds['max_y'])

def get_element_bbox(elem, matrix):
    tag = clean_tag(elem.tag)
    local_bbox = None
    
    if tag == 'path':
        d = elem.get('d')
        local_bbox = get_path_bbox(d)
        
    elif tag in ['rect', 'image']:
        try:
            x = float(elem.get('x', '0'))
            y = float(elem.get('y', '0'))
            w = float(elem.get('width', '0'))
            h = float(elem.get('height', '0'))
            local_bbox = (x, y, x+w, y+h)
        except ValueError:
            pass
        
    elif tag == 'use':
        try:
            x = float(elem.get('x', '0'))
            y = float(elem.get('y', '0'))
            w = elem.get('width')
            h = elem.get('height')
            if w and h:
                 local_bbox = (x, y, x+float(w), y+float(h))
            else:
                 # Unknown size
                 return None
        except ValueError:
            pass
             
    elif tag == 'circle':
        try:
            cx = float(elem.get('cx', '0'))
            cy = float(elem.get('cy', '0'))
            r = float(elem.get('r', '0'))
            local_bbox = (cx-r, cy-r, cx+r, cy+r)
        except ValueError:
            pass
    
    elif tag == 'text':
        # Text bbox is hard without font metrics.
        # Fallback: Assume it is at (x,y) with size 0?
        # Better: Return None to keep it.
        return None

    if local_bbox:
        minx, miny, maxx, maxy = local_bbox
        pts = [
            matrix.transform_point(minx, miny),
            matrix.transform_point(maxx, miny),
            matrix.transform_point(minx, maxy),
            matrix.transform_point(maxx, maxy)
        ]
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        return (min(xs), min(ys), max(xs), max(ys))
        
    return None

def is_mostly_contained(elem_bbox, tile_bbox, threshold=0.9):
    # Returns True if intersection area is > threshold * elem_bbox area
    # Or strict containment if element has zero area
    
    # Unpack
    ex1, ey1, ex2, ey2 = elem_bbox
    tx1, ty1, tx2, ty2 = tile_bbox
    
    # Element Area
    e_width = ex2 - ex1
    e_height = ey2 - ey1
    e_area = e_width * e_height
    
    # Check for zero area
    if e_area <= 1e-9:
        # Fallback to strict containment check (with epsilon)
        epsilon = 1e-4
        return (ex1 >= tx1 - epsilon and 
                ex2 <= tx2 + epsilon and 
                ey1 >= ty1 - epsilon and 
                ey2 <= ty2 + epsilon)

    # Intersection
    ix1 = max(ex1, tx1)
    iy1 = max(ey1, ty1)
    ix2 = min(ex2, tx2)
    iy2 = min(ey2, ty2)
    
    if ix1 >= ix2 or iy1 >= iy2:
        return False
        
    i_area = (ix2 - ix1) * (iy2 - iy1)
    
    return (i_area / e_area) > threshold

def assign_elements_to_tiles(tree, parent_matrix=None, current_node_id=0):
    # This traverses the tree once and assigns elements to tiles
    # Also tags the tree nodes with unique IDs for later retrieval
    
    # We need a shared dict for assignments: { tile_bg_id: set(node_ids) }
    # Since we can't easily pass it recursively if we start fresh, let's make a class or closure
    pass

class TileAssigner:
    def __init__(self, tiles_list):
        self.tiles = tiles_list # List of dicts with 'box', 'id'
        # Map: tile_index -> set of node IDs to keep
        self.assignments = {i: set() for i in range(len(tiles_list))}
        self.node_id_counter = 0

    def process(self, node, parent_matrix):
        # 1. Tag Node
        my_id = str(self.node_id_counter)
        node.set('__temp_id', my_id)
        self.node_id_counter += 1
        
        # 2. Calculate Matrix
        tag = clean_tag(node.tag)
        transform_attr = node.get('transform')
        local_matrix = parse_transform(transform_attr)
        current_matrix = parent_matrix.multiply(local_matrix)
        
        # 3. Check Leaf Logic
        is_leaf = tag in ['path', 'rect', 'image', 'use', 'circle', 'text', 'line', 'polyline', 'polygon']
        is_defs = tag == 'defs'
        
        keep_for_tiles = set() # Set of tile indices
        
        if is_defs:
            # Mark defs for all tiles
            keep_for_tiles = set(self.assignments.keys())
            
        elif is_leaf:
            bbox = get_element_bbox(node, current_matrix)
            if bbox:
                for i, tile in enumerate(self.tiles):
                    if is_mostly_contained(bbox, tile['box']):
                        keep_for_tiles.add(i)
        
        # 4. Recurse Children
        children = list(node)
        for child in children:
            child_keep_set = self.process(child, current_matrix)
            keep_for_tiles.update(child_keep_set)
            
        # 5. Store Assignments
        # Add this node to the sets of the calculated tiles
        for t_idx in keep_for_tiles:
            self.assignments[t_idx].add(my_id)
            
        return keep_for_tiles

def prune_by_id(node, allowed_ids):
    # Returns True if node should be kept
    my_id = node.get('__temp_id')
    
    # Always keep defs or if ID matches
    tag = clean_tag(node.tag)
    if tag == 'defs':
        # Even if defs is kept, we might want to prune its children?
        # But our logic marked defs children too if we recursed?
        # Let's check `is_defs` logic above.
        # It marked `defs` itself for all tiles.
        # It recursed children.
        # If children were leaves inside defs (like symbols), get_element_bbox would check them?
        # BBox of symbol/path in defs is usually near 0,0 unless used.
        # This is tricky. Objects in defs don't have a "position" on the canvas until used.
        # Simplification: Keep everything in DEFS.
        return True
        
    if my_id in allowed_ids:
        # If I am allowed, I keep myself.
        # But I must prune my children too!
        children = list(node)
        has_visible_children = False
        
        if len(children) == 0:
            # If leaf and allowed, keep
            return True
            
        for child in children:
            if prune_by_id(child, allowed_ids):
                has_visible_children = True
            else:
                node.remove(child)
        
        # optimized: if group became empty, should we remove it?
        # If it was a leaf (like text) it might have no children.
        # If it was a group 'g', and now empty, remove?
        if tag == 'g' and not has_visible_children:
            return False
            
        return True
    
    return False

def process_svg_file(input_svg_path, output_dir_path, start_id, prefix="TS"):
    print(f"Reading {input_svg_path} (Start ID: {start_id}, Prefix: {prefix})...")
    parser = etree.XMLParser(remove_blank_text=True)
    try:
        tree = etree.parse(input_svg_path, parser)
    except OSError:
        print(f"Error: Could not open {input_svg_path}")
        return

    # Open PDF for OCR (or just the SVG if we can rasterize it, but better to use the SVG with fitz)
    # Actually, fitz can open SVG files directly as vector graphics and render to pixmap.
    doc_ocr = None
    if pytesseract and os.path.exists(input_svg_path):
        try:
            doc_ocr = fitz.open(input_svg_path)
        except Exception as e:
            print(f"OCR Init Failed for {input_svg_path}: {e}")

    if not os.path.exists(output_dir_path):
        os.makedirs(output_dir_path)

    # Determine Grid Parameters
    basename = os.path.basename(input_svg_path)
    
    current_cols = cols
    current_rows = rows
    current_col_start_x = col_start_x
    current_col_width = col_width
    current_col_stride = col_stride
    current_row_start_y = row_start_y
    current_row_height = row_height
    current_row_stride = row_stride

    
    if basename in SPECIAL_GRIDS:
        print(f"Using separate grid configuration for {basename}")
        config = SPECIAL_GRIDS[basename]
        current_cols = config.get("cols", current_cols)
        current_rows = config.get("rows", current_rows)
        current_col_start_x = config.get("col_start_x", current_col_start_x)
        current_col_width = config.get("col_width", current_col_width)
        current_col_stride = config.get("col_stride", current_col_stride)
        current_row_start_y = config.get("row_start_y", current_row_start_y)
        current_row_height = config.get("row_height", current_row_height)
        current_row_stride = config.get("row_stride", current_row_stride)
        current_double_rows = config.get("double_row_ids", set())
        current_triple_rows = config.get("triple_row_ids", set())
    else:
        current_double_rows = set()
        current_triple_rows = set()

    # 1. Setup Tiles
    tiles = []
    current_id = start_id
    
    # Logic for multi-row signs:
    # If a sign spans multiple rows, we queue up suffixes for subsequent iterations.
    pending_base_id = None
    pending_suffixes = [] 
    
    # NEW: Store batch description to reuse for multi-row signs
    batch_description = None
    batch_desc_rect = None
    batch_base_key = None
    batch_needs_capture = False

    # Store description texts
    descriptions_data = {} # { "101": "Description Text", ... }

    for c in range(current_cols):
        for r in range(current_rows):
            x = current_col_start_x + (c * current_col_stride)
            y = current_row_start_y + (r * current_row_stride)
            w = current_col_width
            h = current_row_height
            
            # Description Column Logic
            # User says description is "half the image box width".
            # Image box width is w.
            desc_x = x + w # Start immediately to the right of the sign
            if "RM" in basename:
                # RM files description text is from 82.845 to 125.385 -> width = 42.54
                desc_rect_width = 42.54
            else:
                desc_rect_width = w * 0.5 # Half of the sign width
            
            # Determine capture height and OCR flag
            desc_h = h   # Default single row height
            do_ocr = True 

            if pending_suffixes:
                # We are processing the subsequent parts of a multi-row sign
                suffix = pending_suffixes.pop(0)
                tile_id_str = f"{pending_base_id}{suffix}"
                
                # Reuse the description captured from the first part
                do_ocr = False
                # Ensure we always create an entry for suffix tiles.
                # If we captured text in the first part, reuse it; otherwise store empty string (but we'll try to OCR the combined rect below).
                descriptions_data[tile_id_str] = batch_description if batch_description else ""
                if batch_description:
                    print(f"PROPAGATE: copied description to {tile_id_str}")
                else:
                    print(f"PROPAGATE: created empty description for {tile_id_str} (will retry combined OCR if available)")

                # If we exhausted the suffixes, reset pending base
                if not pending_suffixes:
                    pending_base_id = None
                    batch_description = None

            elif current_id in current_triple_rows:
                # Triple row logic: URBAN, NT, LANTAU
                base = current_id
                tile_id_str = f"{base}-U"
                pending_base_id = base
                pending_suffixes = ["-N", "-L"]
                current_id += 1
                
                # Capture 3 rows for description
                desc_h = h * 3 
                # Mark that we need to capture the combined rect for this batch once desc_rect is computed
                batch_needs_capture = True
                batch_base_key = tile_id_str

            elif current_id in current_double_rows:
                # Double row logic: R, L
                base = current_id
                tile_id_str = f"{base}R"
                pending_base_id = base
                pending_suffixes = ["L"]
                current_id += 1
                
                # Capture 2 rows for description
                desc_h = h * 2 
                # Mark that we need to capture the combined rect for this batch once desc_rect is computed
                batch_needs_capture = True
                batch_base_key = tile_id_str
            else:
                tile_id_str = str(current_id)
                current_id += 1
            
            # Refined Description Rect
            desc_rect = fitz.Rect(desc_x, y, desc_x + desc_rect_width, y + desc_h)
            # If this iteration just started a multi-row batch, remember the combined rect
            if batch_needs_capture:
                batch_desc_rect = desc_rect
                batch_needs_capture = False
            
            # --- Perform OCR code block ---
            if doc_ocr and do_ocr:
                try:
                    # Render the description area
                    # Page 0 of the SVG
                    page = doc_ocr[0]
                    # Render at high DPI for OCR
                    pix = page.get_pixmap(clip=desc_rect, dpi=600)
                    if pix.width > 10 and pix.height > 10: # Ensure valid image
                        img_data = pix.tobytes("png")
                        pil_img = Image.open(io.BytesIO(img_data))
                        # OCR with Chinese/English if possible
                        try:
                           langs = pytesseract.get_languages()
                           lang = 'eng+chi_tra' if 'chi_tra' in langs else 'eng'
                        except:
                           lang = 'eng'

                        text = pytesseract.image_to_string(pil_img, lang=lang)
                        clean_text = text.strip()
                        if clean_text:
                            descriptions_data[tile_id_str] = clean_text
                            # Cache description if we are starting a multi-row batch
                            if pending_suffixes:
                                batch_description = clean_text
                            print(f"OCR: saved desc for {tile_id_str} (len={len(clean_text)}) rect={desc_rect} pix={pix.width}x{pix.height}")
                        else:
                            print(f"OCR: no text for {tile_id_str} rect={desc_rect} pix={pix.width}x{pix.height}")
                except Exception as e:
                    # Ignore OCR errors efficiently
                    pass
            else:
                # No OCR performed for this tile (e.g., pending suffix). Log for debug.
                if pending_suffixes:
                    print(f"OCR: skipped OCR for suffix tile {tile_id_str} (pending) rect={desc_rect})")
                    # If base OCR previously failed and we have the combined rect, try OCR now on that combined rect
                    if batch_description is None and batch_desc_rect and doc_ocr:
                        try:
                            page = doc_ocr[0]
                            pix2 = page.get_pixmap(clip=batch_desc_rect, dpi=600)
                            if pix2.width > 10 and pix2.height > 10:
                                img_data2 = pix2.tobytes("png")
                                pil_img2 = Image.open(io.BytesIO(img_data2))
                                try:
                                    langs = pytesseract.get_languages()
                                    lang2 = 'eng+chi_tra' if 'chi_tra' in langs else 'eng'
                                except:
                                    lang2 = 'eng'
                                text2 = pytesseract.image_to_string(pil_img2, lang=lang2)
                                clean2 = text2.strip()
                                if clean2:
                                    batch_description = clean2
                                    # assign to base and this suffix
                                    if batch_base_key:
                                        descriptions_data[batch_base_key] = clean2
                                    descriptions_data[tile_id_str] = clean2
                                    print(f"OCR-RETRY: captured combined desc for batch {batch_base_key} -> {clean2[:40]!r}")
                        except Exception:
                            pass
            
            tiles.append({
                'id': tile_id_str,
                'box': (x, y, x+w, y+h),
                'viewBox': f"{x:.3f} {y:.3f} {w:.3f} {h:.3f}",
                'w': w,
                'h': h
            })
            
    # Save descriptions to separate JSON
    desc_json_path = os.path.join(BASE_DIR, "web", "public", "data", "descriptions.json")
    
    current_descriptions = {}
    if os.path.exists(desc_json_path):
        try:
            with open(desc_json_path, 'r', encoding='utf-8') as f:
                current_descriptions = json.load(f)
        except:
             current_descriptions = {}
    
    # Update with new data
    for tid, desc in descriptions_data.items():
         current_descriptions[tid] = desc

    with open(desc_json_path, 'w', encoding='utf-8') as f:
        json.dump(current_descriptions, f, indent=2, ensure_ascii=False)

    doc_ocr = None # Clean up

    # 2. Assign Elements (One Pass)
    print("Assigning elements to tiles...")
    assigner = TileAssigner(tiles)
    root = tree.getroot()
    initial_matrix = Matrix()
    
    # We need to process root
    assigner.process(root, initial_matrix)
    
    # 3. Generate Files
    # Convert tree to string to allow fast parsing for copies
    # We need to be careful: the tree now has __temp_id attributes.
    # We want these in the string so we can prune based on them.
    xml_str = etree.tostring(tree, encoding='utf-8')
    
    print(f"Generating {len(tiles)} tiles...")
    
    for i, tile in enumerate(tiles):
        # Parse from string (fast copy)
        tile_root = etree.fromstring(xml_str)
        tile_tree = etree.ElementTree(tile_root)
        
        # Prune
        allowed = assigner.assignments[i]
        
        # Special case: root is always allowed (it contains everything)
        # But prune_by_id checks ID. Root has ID '0'.
        # Ensure root ID is in allowed (it should be if any child is allowed)
        # If tile is empty, root might not be in allowed?
        # Let's force root match or handle empty tiles gracefully.
        
        children = list(tile_root)
        for child in children:
             if not prune_by_id(child, allowed):
                 tile_root.remove(child)

        # Cleanup IDs
        for elem in tile_root.iter():
            if '__temp_id' in elem.attrib:
                del elem.attrib['__temp_id']
                
        # Set ViewBox
        tile_root.set('viewBox', tile['viewBox'])
        tile_root.set('width', f"{tile['w']:.3f}")
        tile_root.set('height', f"{tile['h']:.3f}")

        # Add debug
        if DEBUG:
            rect = etree.Element(f"{{{NS['svg']}}}rect", 
                x=f"{tile['box'][0]:.3f}", 
                y=f"{tile['box'][1]:.3f}", 
                width=f"{tile['w']:.3f}", 
                height=f"{tile['h']:.3f}", 
                fill="#FFFF00",
                fill_opacity="0.2"
            )
            tile_root.insert(0, rect)
        
        # Apply Global Transform (Rebase to 0,0 and Scale)
        # Create a container group for the transform
        transform_group = etree.Element(f"{{{NS['svg']}}}g", 
            transform=f"scale({SCALE_FACTOR}) translate(-{tile['box'][0]:.3f}, -{tile['box'][1]:.3f})"
        )
        
        # Move all current children of root (pruned content + debug rect) into the group
        # Note: We must iterate a copy of list because we modify it
        for child in list(tile_root):
            tile_root.remove(child)
            transform_group.append(child)
            
        # Add the group to root
        tile_root.append(transform_group)
        
        # Check if the tile has any renderable content
        if not has_renderable_content(transform_group):
            # If the group only contains defs/clipPath, or invisible elements, skip
            # Also ensure output file is removed if it existed (from previous run)
            filename = f"{prefix}_{tile['id']}.svg"
            out_path = os.path.join(output_dir_path, filename)
            
            if os.path.exists(out_path):
                print(f"Removing empty/invisible Tile {tile['id']} from output")
                try:
                    os.remove(out_path)
                except OSError as e:
                    print(f"Error removing {out_path}: {e}")

            if i % 20 == 0:
                print(f"Skipping empty/invisible Tile {tile['id']} ({i+1}/{len(tiles)})")
            continue

        # Set ViewBox and Dimensions scaled
        # New viewBox starts at 0 0, width/height multiplied by scale
        scaled_w = tile['w'] * SCALE_FACTOR
        scaled_h = tile['h'] * SCALE_FACTOR
        tile_root.set('viewBox', f"0 0 {scaled_w:.3f} {scaled_h:.3f}")
        tile_root.set('width', f"{scaled_w:.3f}")
        tile_root.set('height', f"{scaled_h:.3f}")
            
        # Save
        filename = f"{prefix}_{tile['id']}.svg"
        out_path = os.path.join(output_dir_path, filename)
        tile_tree.write(out_path, encoding='utf-8', xml_declaration=True)
        
        if i % 20 == 0:
            print(f"Processed Tile {i+1}/{len(tiles)}")

    print(f"Done processing {input_svg_path}.")


def generate_sign_list(svg_dir, output_file, prefix_filter=None):
    print(f"Generating sign list for {prefix_filter or 'all'}...")
    print(f"Reading from: {svg_dir}")
    
    if not os.path.exists(svg_dir):
        print(f"SVG directory not found: {svg_dir}")
        return

    output_dir = os.path.dirname(output_file)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    # Need to preserve existing descriptions!
    existing_signs_map = {}
    if os.path.exists(output_file):
        try:
            with open(output_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
                for item in existing_data:
                    existing_signs_map[item['filename']] = item
        except:
             pass

    svg_files = [f for f in os.listdir(svg_dir) if f.endswith(".svg")]
    signs = []
    
    for filename in svg_files:
        if prefix_filter and not filename.startswith(prefix_filter + "_"):
            continue

        # Extract number from TS_XXXX.svg or RM_XXXX.svg
        match = re.search(r"^(TS|RM)_(\d+[A-Za-z]*)", filename)
        if match:
             sign_number = match.group(2)
        else:
             sign_number = filename.replace(".svg", "")
        
        filepath = os.path.join(svg_dir, filename)
        try:
             # Get file modification time for cache busting (ms)
             mtime = int(os.path.getmtime(filepath) * 1000)
             
             # Create entry
             entry = {
                 "filename": filename,
                 "signNumber": sign_number,
                 "mtime": mtime
             }
             
             # Restore description if exists
             if filename in existing_signs_map and 'description' in existing_signs_map[filename]:
                 entry['description'] = existing_signs_map[filename]['description']
                 
             signs.append(entry)
        except OSError as e:
             print(f"Error accessing {filepath}: {e}")

    # Sort numerically if possible
    def sort_key(item):
        num = item["signNumber"]
        match_num = re.match(r"^(\d+)", num)
        if match_num:
            return (int(match_num.group(1)), num)
        return (float('inf'), num)
        
    signs.sort(key=sort_key)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(signs, f, indent=2)
        
    print(f"Generated sign list with {len(signs)} signs.")
    print(f"Saved to: {output_file}")


def process_all_svgs():
    search_pattern = os.path.join(BASE_DIR, "data", "whole_pdf_svg", "*.svg")
    files = glob.glob(search_pattern)
    files.sort()
    
    if not files:
        print(f"No files found for pattern: {search_pattern}")
        return
    
    for f in files:
        basename = os.path.basename(f)
        # Extract ID from filename like "(TS 123 - ...) or (RM 1001 - ...)"
        match = re.search(r"\((TS|RM)\s*(\d+)", basename)
        if match:
            sign_prefix = match.group(1)
            start_seq_id = int(match.group(2))
            process_svg_file(f, output_dir, start_seq_id, prefix=sign_prefix)
        else:
            print(f"Skipping {f}: Could not determine Start ID from filename.")
            
    # Generate sign list after processing
    # output_dir is "data/svgs"
    # Target output: web/public/data/signs.json and web/public/data/roadmarkings.json
    output_json_path = os.path.join(BASE_DIR, "web", "public", "data", "signs.json")
    rm_output_json_path = os.path.join(BASE_DIR, "web", "public", "data", "roadmarkings.json")
    
    if os.path.exists(os.path.dirname(output_json_path)):
         generate_sign_list(output_dir, output_json_path, prefix_filter="TS")
         generate_sign_list(output_dir, rm_output_json_path, prefix_filter="RM")
    else:
         print(f"Warning: Web public directory not found at {os.path.dirname(output_json_path)}. Skipping JSON generation.")

if __name__ == "__main__":
    search_dir = os.path.join(BASE_DIR, "data", "whole_pdf_svg")
    
    files_to_process = []
    
    if SPECIFIC_FILES and len(SPECIFIC_FILES) > 0:
        print(f"Processing ONLY {len(SPECIFIC_FILES)} specific files from configuration.")
        for name in SPECIFIC_FILES:
            full_path = os.path.join(search_dir, name)
            if os.path.exists(full_path):
                files_to_process.append(full_path)
    else:
        print(f"Processing ALL svg files in {search_dir}...")
        search_pattern = os.path.join(search_dir, "*.svg")
        files_to_process = glob.glob(search_pattern)
        files_to_process.sort()

    if not files_to_process:
        print("No files to process.")
    
    for f in files_to_process:
        basename = os.path.basename(f)
        # Extract ID from filename like "(TS 123 - ...) or (RM 1001 - ...)"
        match = re.search(r"\((TS|RM)\s*(\d+)", basename)
        if match:
            sign_prefix = match.group(1)
            start_seq_id = int(match.group(2))
            process_svg_file(f, output_dir, start_seq_id, prefix=sign_prefix)
        else:
            print(f"Skipping {f}: Could not determine Start ID from filename.")
            
    # Generate sign list after processing
    # output_dir is "data/svgs", but specifically web/public/data/svgs
    output_json_path = os.path.join(BASE_DIR, "web", "public", "data", "signs.json")
    rm_output_json_path = os.path.join(BASE_DIR, "web", "public", "data", "roadmarkings.json")
    
    if os.path.exists(os.path.dirname(output_json_path)):
         generate_sign_list(output_dir, output_json_path, prefix_filter="TS")
         generate_sign_list(output_dir, rm_output_json_path, prefix_filter="RM")
    else:
         print(f"Warning: Web public directory not found at {os.path.dirname(output_json_path)}. Skipping JSON generation.")

