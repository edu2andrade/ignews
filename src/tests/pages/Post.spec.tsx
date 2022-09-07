import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')
jest.mock('next-auth/react')

const post = {
  slug: 'my-new-post',
  title: 'my-new-title',
  content: '<p>post-excerpt</p>',
  updatedAt: 'May 5',
 }

describe('Post page', () => {
  it('Renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('my-new-title')).toBeInTheDocument()
    expect(screen.getByText('post-excerpt')).toBeInTheDocument()
  })

  it('Redirects user if no subscription was found', async () => {

    const getSessionMocked = jest.mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        },)
      })
    )
  })

  it('Loads initial data', async () => {

    const getSessionMocked = jest.mocked(getSession)
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any)

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

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

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