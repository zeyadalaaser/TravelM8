import React from 'react';
import Input from './input'; // Import your Input component
import { Textarea } from './textarea'; // Import your Textarea component

// Define the Label component
const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

// Export the components
export { Input, Textarea, Label };

// You can add more form-related components here in the future
