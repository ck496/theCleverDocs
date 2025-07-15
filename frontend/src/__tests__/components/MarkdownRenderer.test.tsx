import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import MarkdownRenderer from '../../components/MarkdownRenderer';

// Mock toast hook
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => jest.fn(),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider>
    {children}
  </ChakraProvider>
);

describe('MarkdownRenderer', () => {
  test('renders basic markdown content', () => {
    const markdownContent = `
# Test Heading
This is a test paragraph.

## Subheading
- List item 1
- List item 2
    `;

    render(
      <TestWrapper>
        <MarkdownRenderer content={markdownContent} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('This is a test paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Subheading')).toBeInTheDocument();
  });

  test('renders code blocks with copy button', () => {
    const markdownContent = `
\`\`\`tsx
const example = () => {
  return <div>Hello World</div>;
};
\`\`\`
    `;

    render(
      <TestWrapper>
        <MarkdownRenderer content={markdownContent} />
      </TestWrapper>
    );

    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('tsx')).toBeInTheDocument();
  });

  test('renders inline code', () => {
    const markdownContent = 'Use the `useState` hook for state management.';

    render(
      <TestWrapper>
        <MarkdownRenderer content={markdownContent} />
      </TestWrapper>
    );

    expect(screen.getByText('useState')).toBeInTheDocument();
  });

  test('handles empty content gracefully', () => {
    render(
      <TestWrapper>
        <MarkdownRenderer content="" />
      </TestWrapper>
    );

    // Should not crash and render empty content
    const container = screen.getByTestId ? screen.queryByTestId('markdown-container') : document.body;
    expect(container).toBeTruthy();
  });
});