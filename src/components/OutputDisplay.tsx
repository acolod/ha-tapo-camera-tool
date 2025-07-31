import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputDisplayProps {
  title: string;
  yaml: string;
}

export function OutputDisplay({ title, yaml }: OutputDisplayProps) {
  const [buttonText, setButtonText] = useState('Copy to Clipboard');

  const handleCopy = () => {
    // Check if the modern Clipboard API is available (requires a secure context)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(yaml).then(() => {
        setButtonText('Copied!');
        setTimeout(() => setButtonText('Copy to Clipboard'), 2000);
      });
    } else {
      // Fallback for insecure contexts (like http:// or file://)
      const textArea = document.createElement('textarea');
      textArea.value = yaml;
      // Make the textarea invisible
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setButtonText('Copied!');
        setTimeout(() => setButtonText('Copy to Clipboard'), 2000);
      } catch (err) {
        console.error('Fallback copy failed', err);
        setButtonText('Error!');
        setTimeout(() => setButtonText('Copy to Clipboard'), 2000);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-36"
        >
          {buttonText}
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