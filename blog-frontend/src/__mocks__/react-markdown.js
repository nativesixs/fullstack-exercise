const React = require('react');

function ReactMarkdown(props) {
  return React.createElement(
    'div',
    {
      'data-testid': 'mock-markdown',
      className: props.className,
    },
    props.children || ''
  );
}

module.exports = ReactMarkdown;
