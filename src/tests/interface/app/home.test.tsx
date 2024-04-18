import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('<Home />', () => {
  test('should render the heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: 'Home', level: 1 }))
  })
})
