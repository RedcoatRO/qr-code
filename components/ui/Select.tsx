import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  const lightIcon = `url('data:image/svg+xml;charset=utf-8,<svg_xmlns="http://www.w3.org/2000/svg"_fill="none"_viewBox="0_0_20_20"><path_stroke="%236b7280"_stroke-linecap="round"_stroke-linejoin="round"_stroke-width="1.5"_d="m6_8_4_4_4-4"/></svg>')`;
  const darkIcon = `url('data:image/svg+xml;charset=utf-8,<svg_xmlns="http://www.w3.org/2000/svg"_fill="none"_viewBox="0_0_20_20"><path_stroke="%239ca3af"_stroke-linecap="round"_stroke-linejoin="round"_stroke-width="1.5"_d="m6_8_4_4_4-4"/></svg>')`;

  return (
    <select
      className={`w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-no-repeat bg-right pr-8 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 ${className}`}
      style={{ backgroundImage: lightIcon }}
      ref={ref}
      {...props}
      onFocus={(e) => {
          if (document.documentElement.classList.contains('dark')) {
              e.currentTarget.style.backgroundImage = darkIcon;
          }
          if (props.onFocus) props.onFocus(e);
      }}
      onBlur={(e) => {
          if (document.documentElement.classList.contains('dark')) {
              e.currentTarget.style.backgroundImage = darkIcon;
          }
          if (props.onBlur) props.onBlur(e);
      }}
      onChange={(e) => {
          if (document.documentElement.classList.contains('dark')) {
              e.currentTarget.style.backgroundImage = darkIcon;
          } else {
              e.currentTarget.style.backgroundImage = lightIcon;
          }
           if (props.onChange) props.onChange(e);
      }}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
export default Select;