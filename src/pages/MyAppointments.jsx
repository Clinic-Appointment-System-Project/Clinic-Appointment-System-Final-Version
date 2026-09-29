import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import Loading from '../components/Loading';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      setError(err.message || 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch lá»‹ch háº¹n cá»§a báº¡n.');
    } finally {
      setLoading(false);
    }
  };

