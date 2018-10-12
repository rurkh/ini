import React, { Component } from 'react';

export default className => WrappedComponent =>
  class WrappedWithBodyClass extends Component {
    componentWillMount() {
      document.body.classList.add(className);
    }

    componentWillUnmount() {
      document.body.classList.remove(className);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
