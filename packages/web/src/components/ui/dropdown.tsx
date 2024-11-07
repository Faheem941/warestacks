interface DropdownProps {
  id: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'large';
  options: Record<string, string>;
}

function Dropdown({
  id,
  onChange = undefined,
  defaultValue = undefined,
  value = undefined,
  variant = 'default',
  options,
}: DropdownProps) {
  const selectClasses =
    variant === 'large'
      ? 'bg-white border border-gray-300 text-neutral-600 text-base rounded-2xl focus:outline-none focus:ring-primary focus:border-primary block w-full p-4 pr-10'
      : 'bg-white border border-gray-300 text-neutral-500 text-sm rounded-xl focus:outline-none focus:ring-primary focus:border-primary block w-full p-3 pr-10';

  const labelClasses =
    variant === 'large'
      ? 'block text-lg font-semibold text-slate-700'
      : 'block text-base font-medium text-slate-700';

  return (
    <div className="flex flex-col w-full relative">
      <label htmlFor={id} className={labelClasses}>
        Warehouse Type
        <div className="relative mt-1">
          <select
            id={id}
            className={selectClasses}
            defaultValue={defaultValue}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
          >
            {Object.keys(options).map((key) => (
              <option key={key} value={key}>
                {options[key]}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
}

export default Dropdown;
