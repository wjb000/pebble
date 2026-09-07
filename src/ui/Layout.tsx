import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topnav">
        <NavLink to="/" className="brand">
          <span className="brand-mark" />
          PEBBLE
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/sim">Sim</NavLink>
          <NavLink to="/bom">BOM / Specs</NavLink>
          <NavLink to="/docs">Docs</NavLink>
        </nav>
        <NavLink to="/sim" className="nav-cta">Try the sim</NavLink>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
