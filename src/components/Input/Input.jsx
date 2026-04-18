import React from 'react';
import './Input.css';

const Input = React.forwardRef(({
  label,
  error,
  helpText,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  icon = null,
  className = '',
  ...props
}, ref) => {
  const inputClass = `
    input
    input-${size}
    input-${variant}
    ${error ? 'input-error' : ''}
    ${icon ? 'input-with-icon' : ''}
    ${fullWidth ? 'input-full-width' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`input-group ${fullWidth ? 'input-group-full' : ''}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          ref={ref}
          className={inputClass}
          {...props}
        />
      </div>
      {error && (
        <span className="input-error-text">{error}</span>
      )}
      {helpText && !error && (
        <span className="input-help-text">{helpText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
