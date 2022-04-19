#!/usr/bin/python3
import re
import glob
import sys
import os
import json

# Just find all strings starting with " or ' or `(and ending same) with valid trans key in the middle(lowercase with _ and . chars)
trans_key_pattern = re.compile(
    "([\"'`])([a-z0-9_]+\\.[a-z0-9_.]*)(\\1)"
)

PROJ_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), "..")
PROJ_DIR = os.path.realpath(PROJ_DIR)

GLOBS = [
    glob.glob(os.path.join(PROJ_DIR, "assets") + "/**/*.ts"),
    glob.glob(os.path.join(PROJ_DIR, "assets") + "/**/*.tsx"),
    glob.glob(os.path.join(PROJ_DIR, "assets") + "/**/*.js"),
    glob.glob(os.path.join(PROJ_DIR, "assets") + "/**/*.jsx"),
    glob.glob(os.path.join(PROJ_DIR, "src") + "/**/*.php"),
    glob.glob(os.path.join(PROJ_DIR, "templates") + "/**/*.twig"),
]

DIRS = ["src", "assets", "templates"]

EXTS = ["ts", "tsx", "js", "jsx", "php", "twig"]

keys = []

for dir in DIRS:
    for root, dirs, files in os.walk(dir):
        files = [f for f in files if any(f.endswith(x) for x in EXTS)]
        for file in files:
            with open(os.path.join(root, file), "rt")  as f:
                contents = f.read()
                matches = list(trans_key_pattern.findall(contents))
                if matches:
                    for m in matches:
                        keys += [m[1]]


keys = set(keys)
keys = list(keys)
keys = sorted(keys)

if "--json" in sys.argv:
    d = { k: k for k in keys }
    print(json.dumps(d, indent=4, sort_keys=True))
else:
    for k in keys:
        print(k)

print("Total", len(keys))
