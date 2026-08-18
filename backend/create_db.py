"""One-time script to create the millance_store database if it doesn't exist."""
import psycopg2

conn = psycopg2.connect(
    dbname="postgres", user="postgres",
    password="12345678", host="localhost", port=5432
)
conn.autocommit = True
cur = conn.cursor()
cur.execute("SELECT 1 FROM pg_database WHERE datname = 'millance_store'")
if cur.fetchone():
    print("Database 'millance_store' already exists.")
else:
    cur.execute("CREATE DATABASE millance_store")
    print("Database 'millance_store' created successfully.")
cur.close()
conn.close()
