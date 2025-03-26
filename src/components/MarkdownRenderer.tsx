import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    children: string;
}

const MarkdownRenderer = ({ children }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ node, ...props }) => (
          <strong className="font-semibold" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        p: ({ node, ...props }) => (
          <p className="mb-4 text-gray-700" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-6 mb-4" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-2" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
export default MarkdownRenderer;