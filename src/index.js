import React from 'react';
import illustrations from '../dist/illustrations';

export default class Illustrations extends React.Component {
  render() {
    const { name, height = '250', primaryColor = '#ffd98e', secondaryColor = '#6bd5e1' } = this.props;
    const Illustration = illustrations[name];

    if (!Illustration) {
      console.log(`Could not find illustration "${name}"!`);
      return null;
    }
    return <Illustration height={height} primaryColor={primaryColor} secondaryColor={secondaryColor} />;
  }
}
