import { createRoot } from "react-dom/client"
import App from "./App.jsx"

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)
rootEl.classList.add('rendered')
root.render(
    <>
        <App/>
    </>
)