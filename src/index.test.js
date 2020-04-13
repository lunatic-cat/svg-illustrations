import React from 'react';
import ReactDOM from 'react-dom';
import Smth from './index';

it('TODO', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Smth />, div);
  ReactDOM.unmountComponentAtNode(div);
});
