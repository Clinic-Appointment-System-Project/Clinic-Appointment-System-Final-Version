import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import Loading from '../components/Loading';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [doctorsData, specialtiesData] = await Promise.all([
        api.getDoctors(),
        api.getSpecialties().catch(() => [])
      ]);
      setDoctors(doctorsData || []);
      setSpecialties(specialtiesData || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'ALL' ||
      String(doc.specialty_id) === String(selectedSpecialty) ||
      doc.specialty_name === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Đội Ngũ Bác Sĩ Chuyên Khoa</h2>
          <p>Lựa chọn bác sĩ uy tín để đặt lịch khám nhanh chóng</p>
        </div>
      </div>

      <div className="filter-bar card">
        <div className="filter-group">
          <label htmlFor="search">Tìm kiếm bác sĩ:</label>
          <input
            id="search"
            type="text"
            className="form-control"
            placeholder="Tìm theo tên bác sĩ hoặc chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="specialty">Chuyên khoa:</label>
          <select
            id="specialty"
            className="form-control"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="ALL">Tất cả chuyên khoa</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loading message="Đang tải danh sách bác sĩ..." />}

      {error && !loading && (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={loadData} style={{ marginTop: '0.5rem' }}>
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="empty-state card">
          <div className="empty-icon">🩺</div>
          <h3>Không tìm thấy bác sĩ phù hợp</h3>
          <p>Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc chuyên khoa.</p>
        </div>
      )}

      {!loading && !error && filteredDoctors.length > 0 && (
        <div className="doctors-grid">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
