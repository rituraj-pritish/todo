let id
window.onload = () => {
  const eventSource = new EventSource('/api/re-load')
  eventSource.onerror = () => {
    // debug ERR_INCOMPLETE_CHUNKED_ENCODING error
    // move snippet to onmessage
    id = setTimeout(() => {
      window.location.reload()
    }, 500)
  }
}

window.onbeforeunload = () => {
  clearTimeout(id)
}
