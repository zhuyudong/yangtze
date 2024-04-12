import type { CSSProperties } from 'react'
import RingLoader from 'react-spinners/RingLoader'

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red'
}

export const Loading = () => {
  return (
    <RingLoader
      loading
      size={99}
      color="#0260A0"
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )
}
