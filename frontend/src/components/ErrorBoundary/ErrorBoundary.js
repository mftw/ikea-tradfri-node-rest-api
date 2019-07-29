import React from "react";

// https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }

  // Use static getDerivedStateFromError() to render a fallback UI
  // after an error has been thrown. Use componentDidCatch()
  // to log error information.

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    this.setState({
      hasError: true,
      error,
      info
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.errorComponent || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * <ErrorBoundary>
 *  <MyWidget />
 * </ErrorBoundary>
 *
 *
 * <ErrorBoundary errorComponent={someComponent}>
 *  <MyWidget />
 * </ErrorBoundary>
 */
