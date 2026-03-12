import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ScanRedirect = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientByToken = async () => {
      try {
        const res = await api.get(`/patients/token/${token}`);
        navigate(`/patient/${res.data.patient.id}`);
      } catch (err) {
        alert('Invalid or expired QR code.');
        navigate('/');
      }
    };
    
    if (token) {
        fetchPatientByToken();
    }
  }, [token, navigate]);

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading patient record...</div>;
};

export default ScanRedirect;
