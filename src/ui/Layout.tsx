import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topnav">
        <NavLink to="/model" className="brand">
          <span className="brand-mark" />
          PEBBLE
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/model">Model</NavLink>
          <NavLink to="/sim">Sim</NavLink>
          <NavLink to="/bom">BOM</NavLink>
          <NavLink to="/docs">Docs</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
