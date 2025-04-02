const React = require('react');

function SimpleMDE(props) {
  return React.createElement('textarea', {
    'data-testid': 'mock-editor',
    value: props.value || '',
    onChange: (e) => props.onChange && props.onChange(e.target.value)
  });
}

module.exports = SimpleMDE;
