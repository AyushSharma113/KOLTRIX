import { MapPinned } from 'lucide-react'
import './App.css'

function App() {
  return (
    <main className="startup-screen">
      <section className="startup-card" aria-labelledby="app-title">
        <div className="brand-mark" aria-hidden="true">
          <MapPinned size={22} strokeWidth={1.8} />
        </div>
        <p className="eyebrow">Kolkata Urban Intelligence Platform</p>
        <h1 id="app-title">Koltrix</h1>
        <p className="startup-copy">
          The application foundation is ready. The next milestone is the dashboard shell;
          verified Kolkata layers will be connected after the data audit.
        </p>
        <div className="status-row">
          <span className="status-dot" />
          <span>Project initialized</span>
        </div>
      </section>
    </main>
  )
}

export default App
