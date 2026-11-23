import CivicNavbar from './components/CivicNavbar.jsx'
import SideNavigation from './components/SideNavigation.jsx'
import LayersPanel from './panels/LayersPanel.jsx'
import CityOverviewPanel from './panels/CityOverviewPanel.jsx'
import KolkataMap from './maps/KolkataMap.jsx'
import './App.css'

function App() {
  return (
    <main className="dashboard">
      <CivicNavbar />
      <SideNavigation />
      <LayersPanel />
      <KolkataMap />
      <CityOverviewPanel />
    </main>
  )
}

export default App
