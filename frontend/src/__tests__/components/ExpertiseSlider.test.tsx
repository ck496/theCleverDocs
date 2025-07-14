import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { ExpertiseSlider } from '@/components/ExpertiseSlider'

const renderWithProviders = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>)
}

describe('ExpertiseSlider', () => {
  // Test 1: Expected use case
  test('renders with default intermediate position', () => {
    const mockOnChange = jest.fn()
    renderWithProviders(<ExpertiseSlider value={50} onChange={mockOnChange} />)
    
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
    expect(screen.getByText('Expert')).toBeInTheDocument()
    expect(screen.getByText('Current: Intermediate')).toBeInTheDocument()
  })
  
  // Test 2: Edge case - boundary values
  test('handles boundary values correctly', () => {
    const mockOnChange = jest.fn()
    
    renderWithProviders(<ExpertiseSlider value={0} onChange={mockOnChange} />)
    expect(screen.getByText('Current: Beginner')).toBeInTheDocument()
  })
  
  // Test 3: Expert level
  test('shows expert level correctly', () => {
    const mockOnChange = jest.fn()
    
    renderWithProviders(<ExpertiseSlider value={100} onChange={mockOnChange} />)
    expect(screen.getByText('Current: Expert')).toBeInTheDocument()
  })
  
  // Test 4: Accessibility
  test('has proper accessibility attributes', () => {
    const mockOnChange = jest.fn()
    
    renderWithProviders(<ExpertiseSlider value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-label', 'Content expertise level')
    expect(slider).toHaveAttribute('aria-describedby', 'expertise-description')
  })
  
  // Test 5: Callback function
  test('calls onChange when value changes', async () => {
    const user = userEvent.setup()
    const mockOnChange = jest.fn()
    
    renderWithProviders(<ExpertiseSlider value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider')
    // Simulate arrow key press to move slider
    await user.click(slider)
    await user.keyboard('{ArrowRight}')
    
    // Note: The exact implementation depends on how Radix UI slider handles events
    // This test verifies that the component structure is correct
    expect(mockOnChange).toHaveBeenCalled()
  })
})