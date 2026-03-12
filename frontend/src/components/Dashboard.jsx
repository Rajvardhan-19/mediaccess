import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, ScanLine, LogOut, Eye, Edit, Trash2, Download, QrCode, X } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/patients/delete/${id}`);
        fetchPatients();
      } catch (err) {
        alert('Failed to delete patient');
      }
    }
  };

  const handleViewQR = async (patient) => {
    try {
      const res = await api.get(`/patients/qr/${patient.id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setSelectedQR({ url, name: patient.name, id: patient.id });
      setQrModalOpen(true);
    } catch (err) {
      alert('Failed to load QR code');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>MediAccess Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.username} ({user?.role?.replace('ROLE_','')})</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/scan')} className="btn btn-secondary">
            <ScanLine size={18} style={{ marginRight: '8px' }} /> Scan QR
          </button>
          
          {user?.role === 'ROLE_ADMIN' && (
            <button onClick={() => navigate('/patient/add')} className="btn btn-primary">
              <Plus size={18} style={{ marginRight: '8px' }} /> Add Patient
            </button>
          )}
          
          <button onClick={logout} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2' }}>
            <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
          </button>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          <Users size={20} style={{ marginRight: '8px', color: 'var(--primary)' }} /> Patient Directory
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Age/Gender</th>
                <th style={{ padding: '1rem' }}>Blood Group</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? patients.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>#{p.id}</td>
                  <td style={{ padding: '1rem' }}>{p.name}</td>
                  <td style={{ padding: '1rem' }}>{p.age} / {p.gender}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: '#fee2e2', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                      {p.bloodGroup}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleViewQR(p)} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="View QR">
                        <QrCode size={16} />
                      </button>
                      
                      <button onClick={() => navigate(`/patient/edit/${p.id}`)} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Edit">
                        <Edit size={16} />
                      </button>
                      
                      {user?.role === 'ROLE_ADMIN' && (
                        <button onClick={() => handleDelete(p.id)} className="btn btn-secondary" style={{ padding: '0.5rem', color: '#ef4444', borderColor: '#fee2e2' }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {qrModalOpen && selectedQR && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '400px', textAlign: 'center', position: 'relative', background: '#ffffff' }}>
            <button 
              onClick={() => setQrModalOpen(false)} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '1rem' }}>Patient QR Code</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{selectedQR.name} (#{selectedQR.id})</p>
            <img src={selectedQR.url} alt="QR Code" style={{ width: '250px', height: '250px', margin: '0 auto 1.5rem', display: 'block', border: '1px solid #e2e8f0', borderRadius: '8px', objectFit: 'contain' }} />
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedQR.url;
                link.setAttribute('download', `qr_${selectedQR.id}.png`);
                document.body.appendChild(link);
                link.click();
              }} 
              className="btn btn-primary" style={{ width: '100%' }}
            >
              <Download size={16} style={{ marginRight: '8px' }} /> Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
