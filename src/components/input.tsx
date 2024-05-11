import type { FC } from 'react'

interface InputProps {
  id: string
  onChange: any
  value: string
  label: string
  type?: string
}

export const Input: FC<InputProps> = ({ id, onChange, value, label, type }) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        // bg-neutral-700 -> bg-neutral-300
        className="text-md invalid:border-b-1 peer block w-full appearance-none rounded-md bg-neutral-300 px-6 pb-1 pt-6 text-white focus:outline-none focus:ring-0"
        placeholder=" "
      />
      <label
        htmlFor={id}
        // text-zinc-400 -> text-zinc-700
        className="text-md absolute left-6 top-4 z-10 origin-[0] -translate-y-3 scale-75 text-zinc-700 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75"
      >
        {label}
      </label>
    </div>
  )
}
