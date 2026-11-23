import { useState } from 'react'
import { Activity, Bell, ChevronDown, Download, Search } from 'lucide-react'

function AngleCap({ side }) {
  const left = side === 'left'
  return (
    <svg className={`navbar-angle navbar-angle-${side}`} viewBox="0 0 72 68" aria-hidden="true">
      {left ? (
        <>
          <path d="M0 0H72V66Q62 66 54 57L0 0Z" fill="#0f1015" />
          <path d="M0 0L54 57Q62 66 72 66" fill="none" stroke="#242630" strokeWidth="1.2" />
        </>
      ) : (
        <>
          <path d="M0 66Q10 66 18 57L72 0H0V66Z" fill="#0f1015" />
          <path d="M0 66Q10 66 18 57L72 0" fill="none" stroke="#242630" strokeWidth="1.2" />
        </>
      )}
    </svg>
  )
}

export default function CivicNavbar() {
  const [search, setSearch] = useState('')

  return (
    <header className="civic-navbar">
      <div className="navbar-grid" aria-hidden="true" />
      <div className="navbar-brand-zone">
        <div className="navbar-brand" aria-label="Koltrix home">
          <Activity size={17} strokeWidth={2.2} />
        </div>
      </div>

      <div className="navbar-search-frame">
        <AngleCap side="left" />
        <label className="navbar-search-slot">
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="Search wards and places"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search wards and places..."
          />
          {search ? <button type="button" onClick={() => setSearch('')} aria-label="Clear search">Clear</button> : <kbd>⌘ K</kbd>}
        </label>
        <AngleCap side="right" />
      </div>

      <div className="navbar-actions">
        <button type="button" aria-label="Export map" title="Export map"><Download size={17} /></button>
        <button type="button" aria-label="Notifications" title="Notifications" className="navbar-notification"><Bell size={17} /><i /></button>
        <button type="button" className="navbar-profile" aria-label="Kolkata Explorer profile">
          <span className="navbar-avatar">K</span>
          <span className="navbar-profile-copy"><b>Kolkata Explorer</b><small>City dashboard</small></span>
          <ChevronDown size={13} />
        </button>
      </div>
    </header>
  )
}
