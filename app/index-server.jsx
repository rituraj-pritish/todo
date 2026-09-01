import { renderToString } from "react-dom/server";
import App from './App'

export const render = (_url) => {
  const html = renderToString(
    <App/>
  )
  return {html}
}