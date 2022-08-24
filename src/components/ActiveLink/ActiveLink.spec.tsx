import { render } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink Component', () => {
  it('renders correctly', () => {
    const { getByText } = render (
      <ActiveLink href='/' activeClassName='active' >
        <a href="">home</a>
      </ActiveLink>
    )
    expect(getByText('home')).toBeInTheDocument();
  })
  
  it('add active class if link is currently active', () => {
    const { getByText } = render (
      <ActiveLink href='/' activeClassName='active' >
        <a href="">home</a>
      </ActiveLink>
    )
    expect(getByText('home')).toHaveClass('active');
  })
})

