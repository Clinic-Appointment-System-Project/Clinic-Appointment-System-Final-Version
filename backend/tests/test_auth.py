# Test Suite: Authentication & Authorization (test_auth.py)
# Covers Function 1 (Register) and Function 2 (Login)

def test_register_success(client):
    res = client.post('/api/register', json={
        'full_name': 'Lê Hoàng Nam',
        'email': 'nam.le@example.com',
        'password': 'SecurePassword123'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert 'user' in data
    assert data['user']['email'] == 'nam.le@example.com'
    assert data['user']['role'] == 'PATIENT'
    assert 'password_hash' not in data['user']

def test_register_duplicate_email(client):
    # patient.hung@gmail.com is seeded
    res = client.post('/api/register', json={
        'full_name': 'Nguyễn Văn Hùng Bản Sao',
        'email': 'patient.hung@gmail.com',
        'password': 'Password123'
    })
    assert res.status_code == 409
    data = res.get_json()
    assert 'error' in data
    assert data['error']['code'] == 'email_exists'

def test_register_missing_password(client):
    res = client.post('/api/register', json={
        'full_name': 'Lê Hoàng Nam',
        'email': 'nam.missing.pass@example.com'
    })
    assert res.status_code == 422
    data = res.get_json()
    assert 'error' in data
    assert data['error']['code'] == 'validation_failed'
    assert 'password' in data['error']['details']

def test_register_invalid_email(client):
    res = client.post('/api/register', json={
        'full_name': 'Lê Hoàng Nam',
        'email': 'invalid-email-string',
        'password': 'Password123'
    })
    assert res.status_code == 422
    data = res.get_json()
    assert 'error' in data
    assert data['error']['code'] == 'validation_failed'
    assert 'email' in data['error']['details']

def test_register_bad_json(client):
    res = client.post('/api/register', data='plain string not json', content_type='text/plain')
    assert res.status_code == 400
    data = res.get_json()
    assert data['error']['code'] == 'bad_request'

def test_login_success_patient(client):
    res = client.post('/api/login', json={
        'email': 'patient.hung@gmail.com',
        'password': 'Patient@123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert 'token' in data
    assert data['user']['role'] == 'PATIENT'
    assert data['user']['email'] == 'patient.hung@gmail.com'

def test_login_success_doctor(client):
    res = client.post('/api/login', json={
        'email': 'doctor.an@clinic.com',
        'password': 'Doctor@123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert 'token' in data
    assert data['user']['role'] == 'DOCTOR'

def test_login_success_admin(client):
    res = client.post('/api/login', json={
        'email': 'admin@clinic.com',
        'password': 'Admin@123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert 'token' in data
    assert data['user']['role'] == 'ADMIN'

def test_login_wrong_password(client):
    res = client.post('/api/login', json={
        'email': 'patient.hung@gmail.com',
        'password': 'WrongPassword123'
    })
    assert res.status_code == 401
    data = res.get_json()
    assert data['error']['code'] == 'invalid_credentials'

def test_login_unknown_user(client):
    res = client.post('/api/login', json={
        'email': 'nonexistent.user@clinic.com',
        'password': 'AnyPassword123'
    })
    assert res.status_code == 401
    data = res.get_json()
    assert data['error']['code'] == 'invalid_credentials'

def test_login_validation_failed(client):
    res = client.post('/api/login', json={
        'email': '',
        'password': ''
    })
    assert res.status_code == 422
    data = res.get_json()
    assert data['error']['code'] == 'validation_failed'
    assert 'email' in data['error']['details']
