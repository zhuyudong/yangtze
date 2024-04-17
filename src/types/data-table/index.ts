import type { ComponentType } from 'react'

export type SearchParams = Record<string, string | string[] | undefined>

export type Option = {
  label: string
  value: string
  icon?: ComponentType<{ className?: string }>
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  placeholder?: string
}

export interface DataTableFilterableColumn<TData> {
  id: keyof TData
  title: string
  options: Option[]
}

export interface DataTableFilterOption<TData> {
  id: string
  label: string
  value: keyof TData
  items: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}
