// src/hooks/useToast.js
import { useState } from 'react';

export const useToast = () => {
  const [message, setMessage] = useState(null);

  const toast = ({ title, description, variant }) => {
    setMessage({ title, description, variant });
    console.log(title, description, variant); // Or handle toast display here
  };

  return { toast, message };
};
