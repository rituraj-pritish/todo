import { createRoot } from "react-dom/client"

import ErrorBoundary from './error-boundary'

const APPLICATION_NAME = 'todo'

const App = () => {
    return (
        <>
            <div>
                <h4>{APPLICATION_NAME}</h4>
                <p>Application Name</p>
                <button>change</button>
            </div>
        </>
    )
}

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)
rootEl.classList.add('rendered')
root.render(
    <ErrorBoundary>
        <App/>
    </ErrorBoundary>
)