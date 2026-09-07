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

    }

    render() {
        if(this.state.hasError) {
            return error
        }

        return this.props.children
    }
}

export default ErrorBoundary