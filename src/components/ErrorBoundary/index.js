import React, { Component } from 'react';

/**
 * Renders an Error Block which describes the error if an error was catched
 * Otherwise, returns the children components
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error: error,
      info: info
    })
  }

  render() {
    // If an error was catched then render an Error Block instead of Children
    if(this.state.hasError) {
      return (
        <div className='errorBoundary'>
          <h1>Something went wrong</h1>
          <p>Error - {this.state.error}</p>
          <p>Occured at {this.state.info.componentStack}</p>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}
