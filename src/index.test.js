import React from 'react';
import ReactDOM from 'react-dom';
import Illustration from './index';

it('Check if render works fine', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Illustration name="error-404-colour" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
