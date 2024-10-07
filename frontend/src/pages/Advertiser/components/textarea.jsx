// src/components/ui/textarea.jsx

import React from 'react';

const Textarea = React.forwardRef(({ label, ...props }, ref) => {
    return (
        <div className="textarea-container">
            {label && <label className="textarea-label">{label}</label>}
            <textarea ref={ref} {...props} className="textarea" />
        </div>
    );
});

export default Textarea;
