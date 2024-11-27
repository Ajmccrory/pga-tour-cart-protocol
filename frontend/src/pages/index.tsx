/**
 * Cart Management System - Index Page
 * @author AJ McCrory
 * @created 2024
 * @description Entry point for the application
 */

import React, { useState } from 'react';
import AdminScreen from './AdminScreen';
import ErrorSnackbar from '../components/ErrorSnackbar';

const IndexPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
  };

  return (
    <>
      <AdminScreen onError={handleError} />
      <ErrorSnackbar
        open={!!error}
        message={error || ''}
        onClose={() => setError(null)}
      />
    </>
  );
};

export default IndexPage;
