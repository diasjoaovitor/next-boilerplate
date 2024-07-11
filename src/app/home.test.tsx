import { render, screen } from '@testing-library/react'
import Home from './page'

describe('<MyComponent />', () => {
  it('should render component', () => {
    render(<Home />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
