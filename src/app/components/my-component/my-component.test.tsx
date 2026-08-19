import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MyComponent } from '.'

describe('<MyComponent />', () => {
  it('should render component', () => {
    render(<MyComponent />)
    expect(screen.getByText('MyComponent')).toBeInTheDocument()
  })
})
