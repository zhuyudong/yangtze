'use client'

import type {
  ButtonHTMLAttributes,
  ChangeEventHandler,
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentType,
  CSSProperties,
  Dispatch,
  ElementRef,
  // ElementType,
  // FC,
  FormEvent as ReactFormEvent,
  HTMLAttributes,
  // HTMLProps,
  // InputHTMLAttributes,
  // KeyboardEvent,
  // KeyboardEventHandler,
  // KeygenHTMLAttributes,
  // MouseEvent,
  // MouseEventHandler,
  // PropsWithChildren,
  // ReactComponentElement, // @deprecated
  // ReactElement,
  // ReactHTML,
  // ReactInstance,
  ReactNode,
  // RefObject,
  SetStateAction
  // SuspenseProps,
  // SyntheticEvent
} from 'react'
import {
  Children,
  createContext,
  forwardRef,
  // Fragment,
  isValidElement,
  // memo,
  // StrictMode,
  // Suspense,
  // useCallback,
  useContext,
  // useDebugValue,
  // useDeferredValue,
  useEffect,
  useId,
  // useImperativeHandle,
  // useInsertionEffect,
  useLayoutEffect,
  // useMemo,
  // useReducer,
  useRef,
  useState
  // useSyncExternalStore,
  // useTransition
} from 'react'
// import type \{[A-Z,\n\s]+\} from 'react'

export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function App({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function GridPattern({
  width,
  height,
  x,
  y,
  ...props
}: ComponentPropsWithoutRef<'svg'> & {
  width: number
  height: number
  x: string | number
  y: string | number
  squares: [x: number, y: number][]
}) {
  const patternId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
    </svg>
  )
}

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, type = 'button', ...rest }: Props) {
  return (
    <button {...rest} type={type}>
      {children}
    </button>
  )
}

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <div ref={ref} {...props} />
)
Card.displayName = 'Card'

export function LocaleSwitcher() {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = event => {
    // event.target.value
  }

  return (
    <select
      onChange={handleChange}
      className="border border-gray-300 font-medium focus:outline-none focus-visible:ring"
    >
      null
    </select>
  )
}

const RootLayoutContext = createContext<{
  logoHovered: boolean
  setLogoHovered: Dispatch<SetStateAction<boolean>>
} | null>(null)

export function Header() {
  const { logoHovered, setLogoHovered } = useContext(RootLayoutContext)!

  return null
}

export function ReviewColumn({ msPerPixel = 0 }: { msPerPixel?: number }) {
  const columnRef = useRef<ElementRef<'div'>>(null)
  const [columnHeight, setColumnHeight] = useState(0)
  const duration = `${columnHeight * msPerPixel}ms`

  useEffect(() => {
    if (!columnRef.current) {
      return
    }

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0)
    })

    resizeObserver.observe(columnRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={columnRef}
      style={{ '--marquee-duration': duration } as CSSProperties}
    >
      null
    </div>
  )
}

export function CodePanel({
  children,
  code
}: {
  children: ReactNode
  code?: string
}) {
  const child = Children.only(children)

  if (isValidElement(child)) {
    // ...
  }

  if (!code) {
    throw new Error(
      '`CodePanel` requires a `code` prop, or a child with a `code` prop.'
    )
  }

  return null
}

const FeedbackForm = forwardRef<
  ElementRef<'form'>,
  Pick<ComponentPropsWithoutRef<'form'>, 'onSubmit'>
>(function FeedbackForm({ onSubmit }, ref) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="absolute inset-0 flex items-center justify-center gap-6 md:justify-start"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Was this page helpful?
      </p>
    </form>
  )
})

export function Feedback() {
  function onSubmit(event: ReactFormEvent<HTMLFormElement>) {
    event.preventDefault()

    // event.nativeEvent.submitter.dataset.response
    // => "yes" or "no"
  }

  return (
    <div className="relative h-8">
      <FeedbackForm onSubmit={onSubmit} />
    </div>
  )
}

export function App2() {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = event => {
    // event.target.value
  }

  return <select onChange={handleChange}>null</select>
}

export function SocialLink({
  icon: Icon
}: {
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <li>
      <Icon className="size-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
    </li>
  )
}

export function RootLayoutInner({ children }: { children: ReactNode }) {
  const navRef = useRef<ElementRef<'div'>>(null)

  return <div ref={navRef}>{children}</div>
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

export function WarningIcon({
  id,
  color
}: {
  id: string
  color?: ComponentProps<typeof Gradient>['color']
}) {
  return (
    <defs>
      <Gradient
        id={`${id}-gradient`}
        color={color}
        gradientTransform="rotate(65.924 1.519 20.92) scale(25.7391)"
      />
      <Gradient
        id={`${id}-gradient-dark`}
        color={color}
        gradientTransform="matrix(0 24.5 -24.5 0 16 5.5)"
      />
    </defs>
  )
}
