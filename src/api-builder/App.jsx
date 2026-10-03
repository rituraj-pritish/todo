import { useEffect } from "react"

import ErrorBoundary from "../error-boundary"
import UpdateDom from "./UpdateDom.jsx"
import Dom from "./Dom.jsx"

import { colors } from "./constants.js"
import { GlobalContextProvider } from "./useGlobalContext"

export default () => {
  // remove from production
  useEffect(() => {
    const eventSource = new EventSource('/api/re-load')
    eventSource.onmessage = () => {
      window.location.reload()
    }
    
    let id
    eventSource.onerror = () => {
      // debug ERR_INCOMPLETE_CHUNKED_ENCODING error
      id = setTimeout(() => {
        window.location.reload()
      }, 500)
    }

    return () => {
      clearTimeout(id)
    }
  }, [])

  return (
    <ErrorBoundary>
      <GlobalContextProvider>
        <section>
          <div className="p-2 flex" style={{ height: '50vh' }}>
            <UpdateDom/>
          </div>
          <hr className={`${colors.theme.border}`}/>
          <Dom/>
        </section>
      </GlobalContextProvider>
    </ErrorBoundary>
  )
}