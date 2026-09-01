import { hydrateRoot } from 'react-dom/client'

import App from './App'

const root = hydrateRoot(document.getElementById('root'), <App/>)
