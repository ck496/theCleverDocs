import React, { useMemo } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Code, 
  List, 
  ListItem, 
  Link, 
  useColorModeValue,
  Button,
  HStack,
  useToast,
  VStack
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { useState } from 'react';

// Import highlight.js CSS theme
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, inline, ...props }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const codeString = String(children).replace(/\n$/, '');
  const language = className?.replace('language-', '') || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Code copied!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to copy code',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (inline) {
    return (
      <Code
        px={1}
        py={0.5}
        bg={bgColor}
        color={textColor}
        borderRadius="md"
        fontSize="sm"
        fontFamily="'Monaco', 'Menlo', 'Ubuntu Mono', monospace"
        {...props}
      >
        {children}
      </Code>
    );
  }

  return (
    <Box
      position="relative"
      my={4}
      borderRadius="lg"
      overflow="hidden"
      border="1px"
      borderColor={borderColor}
      bg={bgColor}
    >
      {/* Code header with language and copy button */}
      <HStack
        justify="space-between"
        align="center"
        px={4}
        py={2}
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={useColorModeValue('gray.600', 'gray.300')}
          textTransform="uppercase"
        >
          {language || 'code'}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={copied ? <CheckIcon /> : <CopyIcon />}
          onClick={handleCopy}
          colorScheme={copied ? 'green' : 'gray'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </HStack>

      {/* Code content */}
      <Box
        as="pre"
        p={4}
        overflow="auto"
        fontSize="sm"
        lineHeight="1.5"
        fontFamily="'Monaco', 'Menlo', 'Ubuntu Mono', monospace"
        className={className}
        sx={{
          '& code': {
            fontFamily: 'inherit',
            fontSize: 'inherit',
          },
          // Override highlight.js styles to match theme
          '& .hljs': {
            background: 'transparent !important',
            color: textColor,
          },
          '& .hljs-keyword': {
            color: useColorModeValue('#d73a49', '#ff7b72'),
            fontWeight: 'bold',
          },
          '& .hljs-string': {
            color: useColorModeValue('#032f62', '#a5d6ff'),
          },
          '& .hljs-comment': {
            color: useColorModeValue('#6a737d', '#8b949e'),
            fontStyle: 'italic',
          },
          '& .hljs-function': {
            color: useColorModeValue('#6f42c1', '#d2a8ff'),
          },
          '& .hljs-variable': {
            color: useColorModeValue('#e36209', '#ffa657'),
          },
          '& .hljs-number': {
            color: useColorModeValue('#005cc5', '#79c0ff'),
          },
        }}
        {...props}
      >
        <code className={className}>{children}</code>
      </Box>
    </Box>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const linkColor = useColorModeValue('blue.600', 'blue.300');

  const components = useMemo(() => ({
    // Headings
    h1: ({ children }: any) => (
      <Heading
        as="h1"
        size="xl"
        mb={4}
        mt={8}
        color={headingColor}
        lineHeight="1.2"
        fontWeight="bold"
      >
        {children}
      </Heading>
    ),
    h2: ({ children }: any) => (
      <Heading
        as="h2"
        size="lg"
        mb={3}
        mt={6}
        color={headingColor}
        lineHeight="1.3"
        fontWeight="semibold"
      >
        {children}
      </Heading>
    ),
    h3: ({ children }: any) => (
      <Heading
        as="h3"
        size="md"
        mb={2}
        mt={4}
        color={headingColor}
        lineHeight="1.4"
        fontWeight="semibold"
      >
        {children}
      </Heading>
    ),
    h4: ({ children }: any) => (
      <Heading
        as="h4"
        size="sm"
        mb={2}
        mt={3}
        color={headingColor}
        lineHeight="1.4"
        fontWeight="medium"
      >
        {children}
      </Heading>
    ),

    // Paragraphs
    p: ({ children }: any) => (
      <Text
        mb={4}
        lineHeight="1.7"
        color={textColor}
        fontSize="md"
      >
        {children}
      </Text>
    ),

    // Code blocks and inline code
    code: CodeBlock,

    // Lists
    ul: ({ children }: any) => (
      <List spacing={1} mb={4} ml={4}>
        {children}
      </List>
    ),
    ol: ({ children }: any) => (
      <List as="ol" spacing={1} mb={4} ml={4} styleType="decimal">
        {children}
      </List>
    ),
    li: ({ children }: any) => (
      <ListItem color={textColor} lineHeight="1.6">
        <Text as="span">• {children}</Text>
      </ListItem>
    ),

    // Links
    a: ({ href, children }: any) => (
      <Link
        href={href}
        color={linkColor}
        textDecoration="underline"
        _hover={{ textDecoration: 'none', opacity: 0.8 }}
        isExternal={href?.startsWith('http')}
      >
        {children}
      </Link>
    ),

    // Blockquotes
    blockquote: ({ children }: any) => (
      <Box
        borderLeft="4px"
        borderColor="blue.400"
        pl={4}
        py={2}
        my={4}
        bg={useColorModeValue('blue.50', 'blue.900')}
        borderRadius="md"
      >
        <Text
          fontStyle="italic"
          color={textColor}
          lineHeight="1.6"
        >
          {children}
        </Text>
      </Box>
    ),

    // Horizontal rules
    hr: () => (
      <Box
        as="hr"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        my={6}
      />
    ),

    // Strong/Bold text
    strong: ({ children }: any) => (
      <Text as="strong" fontWeight="bold" color={headingColor}>
        {children}
      </Text>
    ),

    // Emphasis/Italic text
    em: ({ children }: any) => (
      <Text as="em" fontStyle="italic">
        {children}
      </Text>
    ),
  }), [headingColor, textColor, linkColor]);

  return (
    <VStack align="stretch" spacing={0} className={className}>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </VStack>
  );
};

export default MarkdownRenderer;