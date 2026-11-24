import {
  BarChart3,
  Cpu,
  Crosshair,
  FileText,
  Grid2X2,
  LifeBuoy,
  LogOut,
  MapPinned,
  ScanEye,
  Settings,
  UserCog,
  Waypoints,
} from 'lucide-react'

const navigationItems = [
  { label: 'Dashboard', icon: Grid2X2 },
  { label: 'City Explorer', icon: MapPinned, page: 'cityExplorer' },
  { label: 'Socio-economic factors', icon: ScanEye, page: 'socioEconomic' },
  { label: 'Network analysis', icon: Waypoints, page: 'networkAnalysis' },
  { label: 'Locate', icon: Crosshair },
  { label: 'Permits', icon: FileText },
  { label: 'Account', icon: UserCog },
  { label: 'Data sources', icon: Cpu },
  { label: 'Development trends', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
  { label: 'Help', icon: LifeBuoy },
  { label: 'Sign out', icon: LogOut },
]

export default function SideNavigation({ activePage, onNavigate }) {
  return (
    <nav className="rail" aria-label="Main navigation">
      {navigationItems.map(({ label, icon: Icon, page }) => {
        const active = page === activePage
        return (
        <button
          key={label}
          className={active ? 'rail-active' : undefined}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
          type="button"
          onClick={page ? () => onNavigate(page) : undefined}
        >
          <Icon size={19} />
        </button>
        )
      })}
    </nav>
  )
}
