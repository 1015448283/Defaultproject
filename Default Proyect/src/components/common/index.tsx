interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-700 text-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  const sizes = { sm: 'px-3 py-1 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || disabled} {...props}>
      {loading ? <span className="animate-spin mr-2">⟳</span> : null}
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <input className={`bg-dark-700 border rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-600'} ${className}`} {...props} />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <textarea className={`bg-dark-700 border rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-600'} ${className}`} {...props} />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>{children}</div>;
}

export function Skeleton({ width, height, lines = 1 }: { width?: string; height?: string; lines?: number }) {
  return (
    <div className={`bg-dark-700 rounded animate-pulse ${width || 'w-full'} ${height || 'h-4'}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`bg-dark-600 rounded my-2 ${width || 'w-full'} ${height || 'h-4'}`} />
      ))}
    </div>
  );
}

interface BadgeProps {
  variant: string;
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const variants: Record<string, string> = {
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    pending: 'bg-gray-600',
  };
  return <span className={`${variants[variant] || 'bg-gray-600'} px-2 py-1 rounded-full text-xs font-medium`}>{children}</span>;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-dark-800 rounded-xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
