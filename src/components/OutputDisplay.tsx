import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputDisplayProps {
  title: string;
  yaml: string;
}

export function OutputDisplay({ title, yaml }: OutputDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    // You could add a "Copied!" toast notification here in the future
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Copy to Clipboard
        </button>
      </div>
      <div className="bg-gray-800 rounded-md overflow-hidden">
        <SyntaxHighlighter language="yaml" style={atomDark} customStyle={{ margin: 0 }}>
          {yaml}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}