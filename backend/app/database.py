import os
import sqlite3
from flask import g, current_app

DEFAULT_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'clinic.db'))

def get_db_path():
    if current_app:
        db_url = current_app.config.get('DATABASE_URL') or os.environ.get('DATABASE_URL', 'clinic.db')
        if db_url.startswith('sqlite:///'):
            return os.path.abspath(db_url.replace('sqlite:///', ''))
        if not os.path.isabs(db_url):
            return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', db_url))
        return os.path.abspath(db_url)
    return DEFAULT_DB_PATH

def get_connection(db_path=None):
    path = db_path or get_db_path()
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def get_db():
    if 'db' not in g:
        g.db = get_connection()
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (dict(rv[0]) if rv else None) if one else [dict(r) for r in rv]

def execute_db(query, args=(), commit=True):
    db = get_db()
    cur = db.execute(query, args)
    if commit:
        db.commit()
    last_id = cur.lastrowid
    row_count = cur.rowcount
    cur.close()
    return last_id, row_count

def init_db(db_path=None):
    schema_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'schema.sql'))
    conn = get_connection(db_path)
    with open(schema_path, 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def seed_db(db_path=None):
    seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'seed.sql'))
    conn = get_connection(db_path)
    with open(seed_path, 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
