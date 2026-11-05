"""
Read-only schema inspection utility for DAWARE OPTICIANS.
This script ONLY reads table metadata (columns, data types, primary keys, foreign keys)
using SQLAlchemy inspector. It DOES NOT create, drop, alter, or modify any tables.
"""
import os
import json
from sqlalchemy import inspect
from database import engine, test_connection

def inspect_database():
    success, msg = test_connection()
    if not success:
        print(f"FAILED_CONNECTION: {msg}")
        return False

    print("SUCCESS_CONNECTION")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Found tables: {tables}")

    schema_info = {}
    for table_name in tables:
        columns = inspector.get_columns(table_name)
        pk_constraint = inspector.get_pk_constraint(table_name)
        fks = inspector.get_foreign_keys(table_name)

        col_details = []
        for col in columns:
            col_details.append({
                "name": col["name"],
                "type": str(col["type"]),
                "nullable": col.get("nullable", True),
                "default": str(col.get("default", "")) if col.get("default") is not None else None,
                "autoincrement": col.get("autoincrement", False)
            })

        schema_info[table_name] = {
            "columns": col_details,
            "primary_key": pk_constraint.get("constrained_columns", []),
            "foreign_keys": [
                {
                    "referred_table": fk.get("referred_table"),
                    "constrained_columns": fk.get("constrained_columns"),
                    "referred_columns": fk.get("referred_columns")
                }
                for fk in fks
            ]
        }

    with open("schema_dump.json", "w", encoding="utf-8") as f:
        json.dump(schema_info, f, indent=2)

    print("Schema inspection complete. Dump saved to schema_dump.json.")
    return True

if __name__ == "__main__":
    inspect_database()

