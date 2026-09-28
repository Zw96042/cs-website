async function startApp () {
  let Inspector = null

  if (import.meta.env.DEV) {
    const { getSharedEngine, Lapse } = await import('@aiforui/lapse')
    const engine = getSharedEngine()
    engine.install()
    engine.setCaptureMode('replay')
    Inspector = Lapse
  }

  const { renderApp } = await import('./renderApp.jsx')
  renderApp(Inspector)
}

startApp()
