import urllib.request
import json

base_url = "http://127.0.0.1:8000"
endpoints = [
    "/api/health",
    "/api/dashboard/metrics",
    "/api/customers",
    "/api/categories",
    "/api/products",
    "/api/prescriptions",
    "/api/sales",
    "/api/payments",
    "/api/suppliers",
    "/api/purchase-orders",
    "/api/repairs"
]

print("Testing all FastAPI Endpoints:")
for ep in endpoints:
    url = base_url + ep
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            count = len(data) if isinstance(data, list) else "object"
            print(f"  [OK 200] {ep:25} -> {count}")
    except Exception as e:
        print(f"  [FAILED] {ep:25} -> {e}")
