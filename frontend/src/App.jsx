import { useMemo, useState } from 'react'
import CivicNavbar from './components/CivicNavbar.jsx'
import SideNavigation from './components/SideNavigation.jsx'
import LayersPanel from './panels/LayersPanel.jsx'
import CityOverviewPanel from './panels/CityOverviewPanel.jsx'
import SocioEconomicPanel from './panels/SocioEconomicPanel.jsx'
import WardDetailsPanel from './panels/WardDetailsPanel.jsx'
import NetworkAnalysisPanel from './panels/NetworkAnalysisPanel.jsx'
import RoadDetailsPanel from './panels/RoadDetailsPanel.jsx'
import KolkataMap from './maps/KolkataMap.jsx'
import useWardGeoJson from './hooks/useWardGeoJson.js'
import useRoadGeoJson from './hooks/useRoadGeoJson.js'
import { getQuantileBreaks, indicators } from './utils/socioEconomicIndicators.js'
import './App.css'

function App() {
  const [wardBoundariesEnabled, setWardBoundariesEnabled] = useState(false)
  const [activePage, setActivePage] = useState('cityExplorer')
  const [indicatorId, setIndicatorId] = useState(indicators[0].id)
  const [rampId, setRampId] = useState('red')
  const [selectedWard, setSelectedWard] = useState(null)
  const [roadClass, setRoadClass] = useState('all')
  const [roadColor, setRoadColor] = useState('lime')
  const [selectedRoad, setSelectedRoad] = useState(null)
  const { data: wardData, error: wardDataError } = useWardGeoJson()
  const isNetworkPage = activePage === 'networkAnalysis'
  const { data: roadData, error: roadDataError } = useRoadGeoJson(isNetworkPage)

  const isSocioEconomicPage = activePage === 'socioEconomic'
  const activeIndicatorId = isSocioEconomicPage ? indicatorId : null
  const activeIndicator = indicators.find((item) => item.id === activeIndicatorId)
  const indicatorBreaks = useMemo(
    () => activeIndicator && wardData ? getQuantileBreaks(wardData.features, activeIndicator.field) : [],
    [activeIndicator, wardData],
  )

  function navigateTo(page) {
    setActivePage(page)
    setSelectedWard(null)
    setSelectedRoad(null)
  }

  return (
    <main className="dashboard">
      <CivicNavbar />
      <SideNavigation activePage={activePage} onNavigate={navigateTo} />
      {isSocioEconomicPage ? (
        <SocioEconomicPanel
          indicatorId={indicatorId}
          onIndicatorChange={setIndicatorId}
          rampId={rampId}
          onRampChange={setRampId}
          breaks={indicatorBreaks}
        />
      ) : isNetworkPage ? (
        <NetworkAnalysisPanel
          data={roadData}
          roadClass={roadClass}
          onRoadClassChange={setRoadClass}
          roadColor={roadColor}
          onRoadColorChange={setRoadColor}
        />
      ) : (
        <LayersPanel
          wardBoundariesEnabled={wardBoundariesEnabled}
          onWardBoundariesToggle={() => setWardBoundariesEnabled((enabled) => !enabled)}
        />
      )}
      <KolkataMap
        showWardBoundaries={!isNetworkPage && (wardBoundariesEnabled || isSocioEconomicPage)}
        data={wardData}
        error={wardDataError}
        indicatorId={activeIndicatorId}
        rampId={rampId}
        selectedWardNumber={selectedWard?.ward_no ?? selectedWard?.Ward_No_1}
        onWardSelect={setSelectedWard}
        showRoads={isNetworkPage}
        roadData={roadData}
        roadError={roadDataError}
        roadClassFilter={roadClass}
        roadColorId={roadColor}
        selectedRoadId={selectedRoad?.id}
        onRoadSelect={setSelectedRoad}
      />
      {isSocioEconomicPage
        ? <WardDetailsPanel ward={selectedWard} indicatorId={indicatorId} />
        : isNetworkPage
          ? <RoadDetailsPanel road={selectedRoad} />
          : <CityOverviewPanel />}
    </main>
  )
}

export default App
