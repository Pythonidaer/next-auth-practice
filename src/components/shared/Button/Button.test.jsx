import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import React from 'react';

// Mock the CSS module import so classNames don't interfere with queries
jest.mock('./Button.module.css', () => ({
  button: 'button',
  blue: 'blue',
  red: 'red',
  green: 'green',
  white: 'white',
  icon: 'icon',
}));

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button label="Click me" />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('button', 'blue');
  });

  it('renders with each color prop', () => {
    const colors = ['blue', 'red', 'green', 'white'];
    colors.forEach((color) => {
      render(<Button label={color} color={color} />);
      const button = screen.getByRole('button', { name: color });
      expect(button).toHaveClass('button', color);
    });
  });

  it('renders with an icon', () => {
    const icon = <svg data-testid="icon-svg" />;
    render(<Button label="With icon" icon={icon} />);
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
    // Icon wrapper span should have icon class
    const iconSpan = screen.getByTestId('icon-svg').parentElement;
    expect(iconSpan).toHaveClass('icon');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /click/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the provided type', () => {
    render(<Button label="Submit" type="submit" />);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('is accessible by role and label', () => {
    render(<Button label="Accessible" />);
    const button = screen.getByRole('button', { name: /accessible/i });
    expect(button).toBeInTheDocument();
  });
});

//
// Test Quality Explanation
//
// - Renders with all relevant props and asserts user-visible output.
// - Uses role and label queries for accessibility.
// - Simulates user interaction (click).
// - Does not check internal state or implementation details.
// - Mocks CSS module to avoid style-related test failures.
//
// See UNIT_TESTING_BEST_PRACTICES.md for further guidance.
