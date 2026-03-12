import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft } from 'lucide-react';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });
    
    scannerRef.current = scanner;

    scanner.render(
      async (result) => {
        scanner.clear();
        setScanResult(result);
        try {
          const res = await api.get(`/patients/token/${result}`);
          navigate(`/patient/${res.data.patient.id}`);
        } catch (err) {
          setError('Invalid or expired QR code.');
        }
      },
      (err) => {
        console.warn(err);
      }
    );

    return () => {
      if (scannerRef.current) scannerRef.current.clear();
    };
  }, [navigate]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Dashboard
      </button>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Scan Patient QR</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          Position the QR code within the frame to retrieve the patient's medical record.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}></div>
        
        {scanResult && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            Authenticating scanned data...
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
