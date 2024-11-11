// src/components/ui/progress.jsx
import React from 'react';

export const Progress = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
      <div
        style={{
          width: `${percentage}%`,
          height: '10px',
          backgroundColor: '#4caf50',
          borderRadius: '5px',
        }}
      />
    </div>
  );
};
