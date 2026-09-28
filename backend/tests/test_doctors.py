# Test Suite: Doctors (test_doctors.py)
# Covers Function 3 (Doctor List) and Function 4 (Doctor Detail)

def test_get_doctors_list_success(client):
    res = client.get('/api/doctors')
    assert res.status_code == 200
    doctors = res.get_json()
    assert isinstance(doctors, list)
    assert len(doctors) >= 3
    # Check fields joined from users and specialties
    first_doc = doctors[0]
    assert 'id' in first_doc
    assert 'full_name' in first_doc
    assert 'specialty_name' in first_doc
    assert 'experience' in first_doc

def test_get_doctor_detail_success(client):
    res = client.get('/api/doctors/1')
    assert res.status_code == 200
    doc = res.get_json()
    assert doc['id'] == 1
    assert 'full_name' in doc
    assert 'specialty_name' in doc
    assert doc['specialty_name'] == 'Nội khoa'

def test_get_doctor_detail_not_found(client):
    res = client.get('/api/doctors/99999')
    assert res.status_code == 404
    data = res.get_json()
    assert 'error' in data
    assert data['error']['code'] == 'not_found'
