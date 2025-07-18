import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:placeholder-slate-400 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
export default Input;