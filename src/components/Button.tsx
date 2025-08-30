interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({ 
  onClick, 
  children = "Botão", 
  className = "",
  variant = 'primary',
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseClasses = "font-semibold px-8 py-4 rounded-xl transition-colors duration-200 whitespace-nowrap hover:opacity-90";
  
  const variantStyles = {
    primary: {
      className: `text-white ${baseClasses}`,
      style: { backgroundColor: '#97151B' }
    },
    secondary: {
      className: `text-gray-900 bg-white ${baseClasses}`,
      style: {}
    }
  };

  const { className: variantClassName, style } = variantStyles[variant];

  return (
    <button 
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${variantClassName} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={style}
    >
      {children}
    </button>
  );
}
