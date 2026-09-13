import * as React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            info: null
        }
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true
        }
    }

    componentDidCatch(error, info) {
        this.setState({
            hasError: true,
            error,
            info
        })
    }

    // fix component stack to display source code directory stack
    render() {
        if(this.state.hasError) {
            return (
                `
                    ${this.state.error?.message}
                
                    ${this.state.info?.componentStack}
                `
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary