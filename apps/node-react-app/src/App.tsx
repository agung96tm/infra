function App() {
  const title = import.meta.env.VITE_APP_TITLE || 'React + TypeScript'
  const apiUrl = import.meta.env.VITE_API_URL || ''

  return (
    <div className="app">
      <h1>Welcome to {title}</h1>
      <p>Setup complete. Ready to build.</p>
      {apiUrl && <p className="api-url">API: {apiUrl}</p>}
    </div>
  )
}

export default App
