// Centralized doctor images mapping
export const DOCTOR_IMAGES = {
  1: '/images/doctors/nguyen-van-an.png',
  2: '/images/doctors/dang-thi-mai.jpg',
  3: '/images/doctors/le-minh-cuong.jpg',
  4: '/images/doctors/pham-thu-ha.jpg',
  5: '/images/doctors/hoang-van-duc.jpg',
  6: '/images/doctors/vu-thi-lan.png'
};

export const getDoctorImage = (doctorId) => {
  return DOCTOR_IMAGES[doctorId] || null;
};
