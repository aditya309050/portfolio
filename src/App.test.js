import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio navigation shell', () => {
  render(<App />);
  expect(screen.getByText(/Aditya raj/i)).toBeInTheDocument();
});
