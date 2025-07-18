import React from 'react';

// By using generics, this component can be rendered as a button, a link (a), or any other element.
type ButtonProps<C extends React.ElementType> = {
  as?: C;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<C>, 'as' | 'variant' | 'size' | 'children' | 'className'>;

const Button = <C extends React.ElementType = 'button'>({
  as,
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps<C>) => {
  const Component = as || 'button';

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-500',
    outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-indigo-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-700'
  };
  
  const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
  };

  return (
    <Component className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Button;