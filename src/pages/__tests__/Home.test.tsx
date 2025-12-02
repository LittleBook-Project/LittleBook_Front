import { render, screen } from '@testing-library/react'
import Home from '../Home'
import { expect, test } from 'vitest'
import { describe } from 'node:test'

describe('Home page', () => {
  test('renders headings and popular section', () => {
    render(<Home />)

    expect(screen.getByText(/Pourquoi choisir Little Book \?/i)).toBeInTheDocument()
    expect(screen.getByText(/Tendances de la communauté/i)).toBeInTheDocument()
    // The mock popular books include "L'Étranger"
    expect(screen.getByText(/L'Étranger/i)).toBeInTheDocument()
  })
})
