import { renderToPipeableStream, renderToString } from "react-dom/server";
import Page from './page'

export const render = (res) => {
  const {pipe} = renderToPipeableStream(
    <Page/>,
    {
      onShellReady: () => {
        pipe(res)
      }
    }
  )
}