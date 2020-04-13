import React from 'react';
import illustrations from '../dist/illustrations';
import { render } from 'react-dom';

export default class Illustrations extends React.Component {
  render() {
    const defaultProps = {
      height: '250px',
    };

    const { name, ...rest } = this.props;
    const Illustration = illustrations[name];

    if (!Illustration) {
      console.log(`Could not find illustration "${name}"!`);
      return null;
    }
    return <Illustration {...rest} />;
  }
}
