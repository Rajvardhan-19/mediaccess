import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const PatientForm = ({ isEditing }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    patient: { name: '', age: '', gender: 'Male', bloodGroup: '', emergencyContact: '' },
    medicalHistory: '', currentDiagnosis: '', medications: '', allergies: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchPatient();
    }
  }, [isEditing, id]);

  const fetchPatient = async () => {
    try {
      const res = await api.get(`/patients/${id}`);
      setFormData(res.data);
    } catch (err) {
      alert('Failed to fetch patient data');
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/patients/update/${id}`, formData);
      } else {
        await api.post('/patients/add', formData);
      }
      navigate('/');
    } catch (err) {
      alert('Error saving patient record');
    }
  };

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'patient') {
      setFormData(prev => ({ ...prev, patient: { ...prev.patient, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Dashboard
      </button>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
          {isEditing ? 'Edit Patient Record' : 'Add New Patient'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="input-field" required
                     value={formData.patient.name} onChange={(e) => handleChange(e, 'patient')} />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" className="input-field" required
                     value={formData.patient.age} onChange={(e) => handleChange(e, 'patient')} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="input-field" value={formData.patient.gender} onChange={(e) => handleChange(e, 'patient')}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <input type="text" name="bloodGroup" className="input-field" required
                     value={formData.patient.bloodGroup} onChange={(e) => handleChange(e, 'patient')} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Emergency Contact</label>
            <input type="text" name="emergencyContact" className="input-field" required
                   value={formData.patient.emergencyContact} onChange={(e) => handleChange(e, 'patient')} />
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Medical Information</h3>
          
          <div className="form-group">
            <label>Current Diagnosis</label>
            <textarea name="currentDiagnosis" className="input-field" rows="2"
                      value={formData.currentDiagnosis} onChange={(e) => handleChange(e, 'medical')}></textarea>
          </div>
          <div className="form-group">
            <label>Medical History</label>
            <textarea name="medicalHistory" className="input-field" rows="3"
                      value={formData.medicalHistory} onChange={(e) => handleChange(e, 'medical')}></textarea>
          </div>
          <div className="form-group">
            <label>Medications</label>
            <textarea name="medications" className="input-field" rows="2"
                      value={formData.medications} onChange={(e) => handleChange(e, 'medical')}></textarea>
          </div>
          <div className="form-group">
            <label>Allergies</label>
            <textarea name="allergies" className="input-field" rows="2"
                      value={formData.allergies} onChange={(e) => handleChange(e, 'medical')}></textarea>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} style={{ marginRight: '8px' }} /> Save Patient Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
