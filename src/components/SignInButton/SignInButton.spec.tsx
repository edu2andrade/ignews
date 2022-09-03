import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'

jest.mock('next-auth/react')

describe('SignInButton Component', () => {

  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render (<SignInButton />)
    expect(screen.getByText('Sign In With GitHub')).toBeInTheDocument();
  })

  it('renders correctly when user is authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'Jane Doe',
          email: 'janedoe@example.com',
        },
        expires: 'fake-expires'
      },
      status: 'authenticated',
    })

    render (<SignInButton />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  })
})

