import clsx from 'clsx'

import { InfinityIcon } from '@/components/icons/InfinityIcon'

export function Buttons({
  items,
  current = items[0],
  onClick
}: {
  items: (string | number)[]
  current?: string | number
  onClick: (i: string | number) => void
}) {
  return (
    <span className="isolate mt-2 inline-flex rounded-sm shadow-sm">
      {items.map((i, ix) => {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onClick(i)}
            className={clsx(
              'relative -ml-px inline-flex items-center bg-white px-6 py-1 text-sm font-light text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10',
              ix === 0 && 'rounded-l-sm',
              ix === items.length - 1 && 'rounded-r-sm',
              i === current && '!bg-gray-300'
            )}
          >
            {typeof i === 'number' && i !== 10000 ? (
              i
            ) : i === 'Infinity' || i === 10000 ? (
              <InfinityIcon />
            ) : (
              i
            )}
          </button>
        )
      })}
    </span>
  )
}
