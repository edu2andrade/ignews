import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps, Post } from "../../pages/posts";
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [{
  slug: 'my-new-post',
  title: 'my-new-title',
  excerpt: 'post-excerpt',
  updatedAt: 'May 5',
 }] as Post[]

describe('Posts page', () => {
  it('Renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('my-new-title')).toBeInTheDocument()
  })

  it('Loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
           {
             uid: 'my-new-post',
             data: {
               title: [
                 { type: 'heading', text: 'my-new-title' }
               ],
               content: [
                 { type: 'paragraph', text: 'post-excerpt' }
               ],
             },
             last_publication_date: '09-07-2022'
           }
      ])
    } as any)

    


    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'my-new-title',
            excerpt: 'post-excerpt',
            updatedAt: '07 de setembro de 2022',
          }]
        }
      })
    )
  })
})