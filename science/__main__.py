"""Local worker entry point used by the Vite development server."""

import json
import sys

from science.gcov import run


status, body = run(json.load(sys.stdin))
print(json.dumps({"status": status, "body": body}, allow_nan=False))
