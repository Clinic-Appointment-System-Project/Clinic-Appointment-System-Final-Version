import React from 'react';
import { Link } from 'react-router-dom';
import { getDoctorImage } from '../utils/doctorImages';

const statusConfig = {
  PENDING: {
    label: 'Chá» xÃ¡c nháº­n',
    className: 'badge-pending',
    icon: 'â³',
    note: 'Lá»‹ch háº¹n Ä‘ang Ä‘Æ°á»£c nhÃ¢n viÃªn vÃ  bÃ¡c sÄ© tiáº¿p nháº­n xá»­ lÃ½.'
  },
  CONFIRMED: {
    label: 'ÄÃ£ xÃ¡c nháº­n',
    className: 'badge-confirmed',
    icon: 'âœ…',
    note: 'Lá»‹ch háº¹n Ä‘Ã£ Ä‘Æ°á»£c bÃ¡c sÄ© xÃ¡c nháº­n. Vui lÃ²ng Ä‘áº¿n trÆ°á»›c giá» háº¹n 10-15 phÃºt.'
  },
  COMPLETED: {
    label: 'ÄÃ£ khÃ¡m',
    className: 'badge-completed',
    icon: 'ðŸ©º',
    note: 'Buá»•i khÃ¡m Ä‘Ã£ hoÃ n thÃ nh. ChÃºc báº¡n luÃ´n máº¡nh khá»e vÃ  bÃ¬nh an!'
  },
  CANCELLED: {
    label: 'ÄÃ£ há»§y',
    className: 'badge-cancelled',
    icon: 'âœ•',
    note: 'Lá»‹ch háº¹n nÃ y Ä‘Ã£ Ä‘Æ°á»£c há»§y thÃ nh cÃ´ng.'
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
};

