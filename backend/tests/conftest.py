import os
import sys
import tempfile
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.database import init_db, seed_db

@pytest.fixture
def app():
    # Create a temporary file to isolate the database for each test session
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    
    app = create_app({
        'TESTING': True,
        'DATABASE_URL': db_path,
        'JWT_SECRET_KEY': 'test-secret-key-for-pytest-super-secure-32-chars-long'
    })

    with app.app_context():
        init_db(db_path)
        seed_db(db_path)

    yield app

    os.close(db_fd)
    if os.path.exists(db_path):
        os.unlink(db_path)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

def login_as(client, email, password):
    res = client.post('/api/login', json={'email': email, 'password': password})
    assert res.status_code == 200
    data = res.get_json()
    return data['token']

@pytest.fixture
def patient_token(client):
    return login_as(client, 'patient.hung@gmail.com', 'Patient@123')

@pytest.fixture
def patient2_token(client):
    return login_as(client, 'patient.lan@gmail.com', 'Patient@123')

@pytest.fixture
def doctor_token(client):
    return login_as(client, 'doctor.an@clinic.com', 'Doctor@123')

@pytest.fixture
def doctor2_token(client):
    return login_as(client, 'doctor.mai@clinic.com', 'Doctor@123')

@pytest.fixture
def admin_token(client):
    return login_as(client, 'admin@clinic.com', 'Admin@123')
