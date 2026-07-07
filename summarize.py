import os
import re

migrations_dir = 'supabase/migrations'
files = sorted(os.listdir(migrations_dir))

for f in files:
    if f.endswith('.sql'):
        with open(os.path.join(migrations_dir, f), 'r') as file:
            content = file.read()
            # print only CREATE TABLE and CREATE POLICY statements
            # simplified parsing
            statements = content.split(';')
            for stmt in statements:
                stmt = stmt.strip()
                if stmt.upper().startswith('CREATE TABLE') or stmt.upper().startswith('CREATE POLICY'):
                    print(f"-- From {f}:\n{stmt};\n")
