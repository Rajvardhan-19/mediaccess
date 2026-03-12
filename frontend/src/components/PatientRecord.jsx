import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Edit, Activity, User, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        setRecord(res.data);
      } catch (err) {
        alert('Failed to load patient record');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id, navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;
  if (!record) return null;

  const p = record.patient;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
        </button>
        
        {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_DOCTOR' || user?.role === 'ROLE_NURSE') && (
          <button onClick={() => navigate(`/patient/edit/${p.id}`)} className="btn btn-primary">
            <Edit size={16} style={{ marginRight: '8px' }} /> Edit Record
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Sidebar Profile */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: '100px', height: '100px', background: '#e2e8f0', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={48} color="#94a3b8" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{p.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Patient ID: #{p.id}</p>
          
          <div style={{ textAlign: 'left', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}><strong>Age:</strong> {p.age}</div>
            <div style={{ marginBottom: '0.75rem' }}><strong>Gender:</strong> {p.gender}</div>
            <div style={{ marginBottom: '0.75rem' }}><strong>Blood Type:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{p.bloodGroup}</span></div>
            <div style={{ marginBottom: '0.75rem' }}><strong>Emergency:</strong> {p.emergencyContact}</div>
          </div>
        </div>

        {/* Main Medical Data */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <Activity size={20} style={{ marginRight: '8px', color: 'var(--primary)' }} /> Medical Information
          </h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Diagnosis</h4>
            <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {record.currentDiagnosis || 'None recorded'}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Medical History</h4>
            <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {record.medicalHistory || 'No significant history'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Medications</h4>
              <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px' }}>
                {record.medications || 'None'}
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={14} style={{ marginRight: '4px', color: '#ef4444' }} /> Allergies
              </h4>
              <p style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', border: '1px solid #fca5a5', minHeight: '100px' }}>
                {record.allergies || 'No known allergies'}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            Last updated: {new Date(record.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecord;
