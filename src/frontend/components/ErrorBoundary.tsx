import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error(error);
  }

  render() {
    // @ts-ignore
    const { hasError } = this.state;

    if (hasError) {
      return (
      <div style={{ paddingLeft: 20 }}>
        <h1>Something went wrong.</h1>
        <article>
          Please reload the current page
        </article>
      </div>
      );
    }

    return this.props.children;
  }
}
