import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const MeowInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name,
  required = false,
  error = null,
  icon = null 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5 sm:space-y-2">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-meow-pink">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm sm:text-base">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-bg-input border rounded-lg sm:rounded-xl text-text-primary 
            placeholder-text-placeholder transition-all duration-200 text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-meow-pink/20 
            focus:border-meow-pink focus:bg-bg-input-focus
            ${icon ? 'pl-8 sm:pl-10' : ''}
            ${type === 'password' ? 'pr-8 sm:pr-10' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-border-input'}
            ${isFocused ? 'transform scale-[1.01]' : ''}
          `}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors duration-200"
          >
            {showPassword ? <FaEyeSlash size={14} className="sm:w-4 sm:h-4" /> : <FaEye size={14} className="sm:w-4 sm:h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs sm:text-sm flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default MeowInput;
