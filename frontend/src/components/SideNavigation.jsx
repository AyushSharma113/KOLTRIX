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
} from 'lucide-react'

const navigationItems = [
  { label: 'Dashboard', icon: Grid2X2 },
  { label: 'City Explorer', icon: MapPinned, active: true },
  { label: 'Spatial Analytics', icon: ScanEye },
  { label: 'Locate', icon: Crosshair },
  { label: 'Permits', icon: FileText },
  { label: 'Account', icon: UserCog },
  { label: 'Data sources', icon: Cpu },
  { label: 'Development trends', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
  { label: 'Help', icon: LifeBuoy },
  { label: 'Sign out', icon: LogOut },
]

export default function SideNavigation() {
  return (
    <nav className="rail" aria-label="Main navigation">
      {navigationItems.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          className={active ? 'rail-active' : undefined}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
          type="button"
        >
          <Icon size={19} />
        </button>
      ))}
    </nav>
  )
}
