import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
    <div className={`flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 ${className}`}>
        {children}
    </div>
);

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}
export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
    <h3 className={`text-lg font-semibold text-slate-800 dark:text-slate-100 ${className}`}>{children}</h3>
);


export default Card;