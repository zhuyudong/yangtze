import { Switch } from '@headlessui/react'
import clsx from 'clsx'

export default function SwitchOpen({
  enabled,
  setEnabled,
  text
}: {
  enabled: boolean
  setEnabled: () => void
  text: string
}) {
  return (
    <Switch.Group as="div" className="mb-1 flex items-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={clsx(
          enabled ? 'bg-indigo-400' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-2 text-sm">
        <span className="font-medium">{text}</span>
      </Switch.Label>
    </Switch.Group>
  )
}
