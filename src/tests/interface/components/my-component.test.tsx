import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components'

describe('<MyComponent />', () => {
  test('should render the heading', () => {
    render(<MyComponent />)
    expect(screen.getByText('MyComponent'))
  })
})
