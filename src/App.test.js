import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the EverSwap lab navigation shell', () => {
  render(<App />);
  expect(screen.getByText(/EverSwap/i)).toBeInTheDocument();
  expect(screen.getByText(/Trade/i)).toBeInTheDocument();
  expect(screen.getByText(/Protocol live · \$2\.4B TVL/i)).toBeInTheDocument();
});
