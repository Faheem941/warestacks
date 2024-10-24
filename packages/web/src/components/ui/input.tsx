import React, { HTMLInputTypeAttribute } from 'react';

interface InputProps {
  placeholder?: string;
  label: string;
  id: string;
  required?: boolean;
  isTextArea?: boolean;
  rows?: number;
  defaultValue?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  variant?: 'default' | 'large';
  type?: HTMLInputTypeAttribute;
  isLoading?: boolean;
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
  value = undefined,
  type = 'text',
  variant = 'default',
  isLoading = false, // New prop default
}: InputProps) {
  // Classes for default and large variants
  const inputClasses =
    variant === 'large'
      ? 'bg-white border border-gray-300 text-neutral-600 text-base rounded-2xl focus:outline-none focus:ring-violet-500 focus:border-violet-500 block w-full p-4 pr-10' // Added padding-right for loader space
      : 'bg-white border border-gray-300 text-neutral-500 text-sm rounded-xl focus:outline-none focus:ring-violet-500 focus:border-violet-500 block w-full p-3 pr-10'; // Added padding-right for loader space

  const labelClasses =
    variant === 'large'
      ? 'block text-lg font-semibold text-slate-700'
      : 'block text-base font-medium text-slate-700';

  return (
    <div className="flex flex-col gap-y-1 w-full relative">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          defaultValue={defaultValue}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          rows={rows}
          onChange={onChange}
        />
      ) : (
        <div className="relative">
          <input
            id={id}
            type={type}
            value={value}
            defaultValue={defaultValue}
            className={inputClasses}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                aria-hidden="true"
                className="w-6 h-6 animate-spin text-neutral-300 fill-violet-700"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
