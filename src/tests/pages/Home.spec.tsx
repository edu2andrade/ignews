import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock('next/router')
jest.mock('next-auth/react', () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe')

describe('Home page', () => {
  it('Renders correctly', () => {
    render(<Home product={{ amount: '$19', priceId: 'fake-price-id' }} />)

    expect(screen.getByText('for only $19 per month!')).toBeInTheDocument()
  })

  it('Loads initial data', async () => {
    const stripePricesRetrieveMocked = jest.mocked(stripe.prices.retrieve)

    // a promise, must use mockResolved not mockReturn!
    stripePricesRetrieveMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any) /* as any, just to not return every value inside*/

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})