import { render, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import Auth from '../Auth'
import { describe } from 'node:test'

// Mock firebase/app and firebase/auth before importing the component
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({}))
}))

const mockSignInWithPopup = vi.fn()
const mockGetIdToken = vi.fn().mockResolvedValue('fake-token')

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(() => ({})),
  OAuthProvider: vi.fn(() => ({})),
  signInWithPopup: function (...args: unknown[]) {
      return mockSignInWithPopup(...args)
  },
}))

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as Record<string, unknown>),
    useNavigate: () => vi.fn(),
  }
})

// Mock window.fetch
global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ name: 'Test', email: 'a@b.c', picture: '', uid: 'u1', roles: [] }) })) as unknown as typeof fetch


describe('Auth page', () => {
  test('renders two auth buttons and triggers google login flow', async () => {
    // prepare signInWithPopup to resolve a credential-like object
    mockSignInWithPopup.mockResolvedValue({ user: { getIdToken: mockGetIdToken } })

    const { getByText } = render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    )

    const googleBtn = getByText(/Continuer avec Google/i)
    const msBtn = getByText(/Continuer avec Microsoft/i)

    expect(googleBtn).toBeInTheDocument()
    expect(msBtn).toBeInTheDocument()

    fireEvent.click(googleBtn)

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled()
    })
  })
})
