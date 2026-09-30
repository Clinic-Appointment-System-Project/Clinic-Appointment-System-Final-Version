import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';

const MORNING_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'];
const AFTERNOON_SLOTS = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('09:00');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    setLoadingDoctor(true);
    setError('');
    try {
      const data = await api.getDoctor(doctorId);
      setDoctor(data);
    } catch (err) {
      setError(err.message || 'KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin bÃ¡c sÄ©.');
    } finally {
      setLoadingDoctor(false);
    }
  };

