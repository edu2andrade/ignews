import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')
jest.mock('next-auth/react')
jest.mock('next/router')

const post = {
  slug: 'my-new-post',
  title: 'my-new-title',
  content: '<p>post-excerpt</p>',
  updatedAt: '5 de maio',
 }

describe('Post preview page', () => {
  it('Renders correctly', () => {

    const useSessionMocked = jest.mocked(useSession)
    
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })
    
    render(<Post post={post} />)

    expect(screen.getByText('my-new-title')).toBeInTheDocument()
    expect(screen.getByText('post-excerpt')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('Redirects to post when user is subscribed', async () => {

    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
          activeSubscription: 'fake-active-subscription',
          expires: null
      },
      status: 'authenticated'
  });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    }as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    
  })

  it('Loads initial data', async () => {

    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'my-new-title' }
          ],
          content: [
            { type: 'paragraph', text: 'post-content' }
          ]
        },
        last_publication_date: '09-07-2022'
      })
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'my-new-post'
      }
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'my-new-title',
            content: '<p>post-content</p>',
            updatedAt: '07 de setembro de 2022'
          }
        }
      })
    )
    
  })
})