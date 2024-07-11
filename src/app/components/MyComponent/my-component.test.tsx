import { render, screen } from '@testing-library/react'
import { MyComponent } from '.'

describe('<MyComponent />', () => {
  it('should render component', () => {
    render(<MyComponent>MyComponent</MyComponent>)
    expect(screen.getByText('MyComponent')).toBeInTheDocument()
  })
})
