import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Skeleton from '../../src/skeleton/Skeleton';

describe('Skeleton', () => {
  test('renders correctly with default props', () => {
    render(<Skeleton />);
    const skeletonElement = screen.getByRole('status');
    expect(skeletonElement).toBeInTheDocument();
    expect(skeletonElement).toHaveStyle('height: 20px');
    expect(skeletonElement).toHaveStyle('width: 100%');
  });

  test('applies square styles when square prop is true', () => {
    render(<Skeleton square={true} width={50} />);
    const skeletonElement = screen.getByRole('status');
    expect(skeletonElement).toHaveStyle('height: 50px');
    expect(skeletonElement).toHaveStyle('width: 50px');
    expect(skeletonElement).toHaveStyle('border-radius: 12px');
  });

  test('applies rounded styles when rounded prop is true', () => {
    render(<Skeleton rounded={true} height={40} width={40} />);
    const skeletonElement = screen.getByRole('status');
    expect(skeletonElement).toHaveStyle('height: 40px');
    expect(skeletonElement).toHaveStyle('width: 40%');
    expect(skeletonElement).toHaveStyle('border-radius: 45px');
  });

  test('applies circle styles when circle prop is true', () => {
    render(<Skeleton circle={true} width={50} height={50} />);
    const skeletonElement = screen.getByRole('status');
    expect(skeletonElement).toHaveStyle('border-radius: 50%');
    expect(skeletonElement).toHaveStyle('height: 50px');
    expect(skeletonElement).toHaveStyle('width: 50%');
  });

  test('adjusts height when circle and width are different', () => {
    render(<Skeleton circle={true} width={60} height={30} />);
    const skeletonElement = screen.getByRole('status');
    expect(skeletonElement).toHaveStyle('height: 60px');
  });

  test('applies additional class names passed via className prop', () => {
    render(<Skeleton className="custom-class" />);
    const skeletonElement = screen.getByRole('status');
    expect(skeletonElement).toHaveClass('custom-class');
  });
});
