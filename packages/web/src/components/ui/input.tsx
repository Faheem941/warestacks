import React, { HTMLInputTypeAttribute } from 'react';

interface InputProps {
  placeholder?: string;
  label: string;
  id: string;
  required?: boolean;
  isTextArea?: boolean;
  rows?: number;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  variant?: 'default' | 'large';
  type?: HTMLInputTypeAttribute;
}

export default function Input({
  placeholder = undefined,
  label,
  id,
  required = false,
  isTextArea = false,
  rows = 4,
  onChange = undefined,
  defaultValue = undefined,
  type = 'text',
  variant = 'default',
}: InputProps) {
  // Classes for default and large variants
  const inputClasses =
    variant === 'large'
      ? 'bg-white border border-gray-300 text-neutral-600 text-base rounded-2xl focus:outline-none focus:ring-violet-500 focus:border-violet-500 block w-full p-4'
      : 'bg-white border border-gray-300 text-neutral-500 text-sm rounded-xl focus:outline-none focus:ring-violet-500 focus:border-violet-500 block w-full p-3';

  const labelClasses =
    variant === 'large'
      ? 'block text-lg font-semibold text-slate-700'
      : 'block text-base font-medium text-slate-700';

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          defaultValue={defaultValue}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          rows={rows}
          onChange={onChange}
        />
      ) : (
        <input
          id={id}
          type={type}
          defaultValue={defaultValue}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
        />
      )}
    </div>
  );
}
