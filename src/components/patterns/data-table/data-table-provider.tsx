'use client'

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

import { DateRangePicker } from '../date-range-picker'

interface UserTableContextProps {
  enableAdvancedFilter: boolean
  setEnableAdvancedFilter: Dispatch<SetStateAction<boolean>>
  showFloatingBar: boolean
  setShowFloatingBar: Dispatch<SetStateAction<boolean>>
}

const UserTableContext = createContext<UserTableContextProps>({
  enableAdvancedFilter: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setEnableAdvancedFilter: () => {},
  showFloatingBar: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setShowFloatingBar: () => {}
})

export function useUserTable() {
  const context = useContext(UserTableContext)
  if (!context) {
    throw new Error('useUserTable must be used within a UserTableProvider')
  }
  return context
}

export function UserTableProvider({ children }: PropsWithChildren) {
  const [enableAdvancedFilter, setEnableAdvancedFilter] = useState(false)
  const [showFloatingBar, setShowFloatingBar] = useState(false)

  return (
    <UserTableContext.Provider
      value={{
        enableAdvancedFilter,
        setEnableAdvancedFilter,
        showFloatingBar,
        setShowFloatingBar
      }}
    >
      <DateRangePicker triggerSize="sm" triggerClassName="w-60" align="end" />
      {children}
    </UserTableContext.Provider>
  )
}
