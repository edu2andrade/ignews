import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { SubscribeButton } from '.'

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton Component', () => {

  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render (<SubscribeButton />)
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  })

  it('redirects user to sign in when its not authenticated', () => {
    const signInMocked = jest.mocked(signIn)
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render (<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to post when user has an active subscription', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const useSessionMocked = jest.mocked(useSession)

    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'Jane Doe',
          email: 'janedoe@example.com',
        },
        expires: 'fake-expires',
        activeSubscription: 'fake-active-subscription'
      },
      status: 'authenticated',
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})

