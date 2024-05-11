import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'

import { InstallationIcon } from '@/components/syntax/icons/installation-icon'
import { LightbulbIcon } from '@/components/syntax/icons/lightbulb-icon'
import { PluginsIcon } from '@/components/syntax/icons/plugins-icon'
import { PresetsIcon } from '@/components/syntax/icons/presets-icon'
import { ThemingIcon } from '@/components/syntax/icons/theming-icon'
import { WarningIcon } from '@/components/syntax/icons/warning-icon'
import { cn } from '@/lib/utils'

const icons = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon
}

const iconStyles = {
  blue: '[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]',
  amber:
    '[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]'
}

export function Icon({
  icon,
  color = 'blue',
  className,
  ...props
}: {
  color?: keyof typeof iconStyles
  icon: keyof typeof icons
} & Omit<ComponentPropsWithoutRef<'svg'>, 'color'>) {
  const id = useId()
  const IconComponent = icons[icon]

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={cn(className, iconStyles[color])}
      {...props}
    >
      <IconComponent id={id} color={color} />
    </svg>
  )
}

const gradients = {
  blue: [
    { stopColor: '#0EA5E9' },
    { stopColor: '#22D3EE', offset: '.527' },
    { stopColor: '#818CF8', offset: 1 }
  ],
  amber: [
    { stopColor: '#FDE68A', offset: '.08' },
    { stopColor: '#F59E0B', offset: '.837' }
  ]
}

export function Gradient({
  color = 'blue',
  ...props
}: {
  color?: keyof typeof gradients
} & Omit<ComponentPropsWithoutRef<'radialGradient'>, 'color'>) {
  return (
    <radialGradient
      cx={0}
      cy={0}
      r={1}
      gradientUnits="userSpaceOnUse"
      {...props}
    >
      {gradients[color].map((stop, stopIndex) => (
        <stop key={stopIndex} {...stop} />
      ))}
    </radialGradient>
  )
}

export function LightMode({
  className,
  ...props
}: ComponentPropsWithoutRef<'g'>) {
  return <g className={cn('dark:hidden', className)} {...props} />
}

export function DarkMode({
  className,
  ...props
}: ComponentPropsWithoutRef<'g'>) {
  return <g className={cn('hidden dark:inline', className)} {...props} />
}
