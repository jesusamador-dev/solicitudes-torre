import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SafeView from '../../src/safe/SafeView';
import { mdiGoogleDownasaur } from '@mdi/js';

describe('SafeView component', () => {
  
  test('renders child content when no error occurs', () => {
    render(
      <SafeView>
        <p>Content without error</p>
      </SafeView>
    );
    const childContent = screen.getByText('Content without error');
    expect(childContent).toBeInTheDocument();
  });

  test('renders error view when an error is caught', () => {
    const error = new Error('Test Error');
    const { rerender } = render(<SafeView />);
    
    // Simular el error en getDerivedStateFromError
    SafeView.getDerivedStateFromError(error);

    // Rerender del componente para simular estado después del error
    rerender(<SafeView title="Error view" />);

    const errorTitle = screen.getByText('Error view');
    expect(errorTitle).toBeInTheDocument();
  });

  test('renders with default props after error', () => {
    // Simulamos que ha ocurrido un error para que el componente se cargue
    const error = new Error('Test Error');
    const { rerender } = render(<SafeView />);
    SafeView.getDerivedStateFromError(error);
    rerender(<SafeView />); // Rerenderizar el componente

    // Verificar que se renderiza con los valores por defecto
    const safeViewElement = screen.getByText('. . .'); // Título por defecto es '. . .'
    expect(safeViewElement).toBeInTheDocument();

    const safeViewContainer = safeViewElement.parentElement;
    expect(safeViewContainer).toHaveStyle('width: 100%');
    expect(safeViewContainer).toHaveStyle('height: 100%');
    expect(safeViewContainer).toHaveStyle('color: #757575');
  });

  test('applies props correctly (title, icon size, border, color) after error', () => {
    // Simulamos que ha ocurrido un error para que el componente se cargue
    const error = new Error('Test Error');
    const { rerender } = render(<SafeView />);
    SafeView.getDerivedStateFromError(error);
    
    // Rerenderizamos el componente con props personalizadas
    rerender(
      <SafeView
        title="Test Title"
        width={80}
        height={80}
        color="#ff0000"
        border={true}
        iconSize={2}
      />
    );

    // Verificar que el contenido se renderiza con las props personalizadas
    const safeViewElement = screen.getByText('Test Title');
    expect(safeViewElement).toBeInTheDocument();

    const safeViewContainer = safeViewElement.parentElement;
    expect(safeViewContainer).toHaveStyle('width: 80%');
    expect(safeViewContainer).toHaveStyle('height: 80%');
    expect(safeViewContainer).toHaveStyle('color: #ff0000');
    expect(safeViewContainer).toHaveClass('mf-c-center');
    expect(safeViewContainer).toHaveClass('mf-bdr-grey-lighten-1'); // Clase aplicada con 'border'

    // Verificar que el ícono tiene el tamaño correcto
    const icon = screen.getByTestId('mdi-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('size', '2');
  });
});
