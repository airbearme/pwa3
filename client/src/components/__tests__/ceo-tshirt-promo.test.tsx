import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CeoTshirtPromo from '../ceo-tshirt-promo'

// Mock the useAirbearSession hook
vi.mock('../../hooks/use-airbear-session', () => ({
  useAirbearSession: () => ({
    user: { id: 'test-user-id', email: 'test@example.com', username: 'tester' },
    role: 'user',
    loading: false,
    session: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    error: null
  })
}))

// Mock the useToast hook
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

// Mock the stripe utility

describe('CeoTshirtPromo', () => {
  it('renders the CEO t-shirt promo dialog', () => {
    render(<CeoTshirtPromo isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('CEO-Signed AirBear T-Shirt')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('✍️ CEO Signature')).toBeInTheDocument()
  })

  it('displays the signed icon', () => {
    render(<CeoTshirtPromo isOpen={true} onClose={() => {}} />)

    const signatureElement = screen.getByText('✍️ CEO Signature')
    expect(signatureElement).toBeInTheDocument()
  })

  it('shows size selection options', () => {
    render(<CeoTshirtPromo isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('Choose your size')).toBeInTheDocument()
  })
})
