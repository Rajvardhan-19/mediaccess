import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientForm from './components/PatientForm';
import PatientRecord from './components/PatientRecord';
import QRScanner from './components/QRScanner';
import ScanRedirect from './components/ScanRedirect';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        <Route path="/" element={
          <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE']}>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/patient/add" element={
          <PrivateRoute roles={['ROLE_ADMIN']}>
            <PatientForm />
          </PrivateRoute>
        } />

        <Route path="/patient/edit/:id" element={
          <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE']}>
            <PatientForm isEditing={true} />
          </PrivateRoute>
        } />

        <Route path="/patient/:id" element={
          <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE']}>
            <PatientRecord />
          </PrivateRoute>
        } />

        <Route path="/scan" element={
          <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE']}>
            <QRScanner />
          </PrivateRoute>
        } />
        
        <Route path="/scan-redirect/:token" element={
          <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE']}>
            <ScanRedirect />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
