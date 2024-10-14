import { useRef } from 'react';

const XPathInspector = ({ url }) => {
  const iframeRef = useRef(null);

  const getRelativeXPath = (element) => {
    if (!(element instanceof Element)) return;

    let xpath = '';
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += `[@id="${element.id}"]`;
      } else {
        let sibling = element;
        let index = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === element.nodeName.toLowerCase()) {
            index++;
          }
        }
        selector += `[${index}]`;
      }
      xpath = `${selector}${xpath ? '/' + xpath : ''}`;
      element = element.parentNode;
    }
    return xpath;
  };

  const inspectIframe = () => {
    const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    const elements = iframeDocument.querySelectorAll('*');

    elements.forEach((element) => {
      console.log(getRelativeXPath(element));
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-96 border border-gray-300 rounded"
        title="XPath Inspector Iframe"
      />
      <button
        onClick={inspectIframe}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-all"
      >
        Inspect Elements
      </button>
    </div>
  );
};

export default XPathInspector;
