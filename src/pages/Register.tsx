
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/store';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for dark mode preference when the component mounts
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <RegisterForm />;
};

export default Register;
