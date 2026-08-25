import { NavLink } from "react-router-dom";

const navigationItems = [
  { to: "/", label: "Home", end: true },
  { to: "/clients", label: "Clients", end: true },
  { to: "/procedures", label: "Procedures" },
  { to: "/appointments", label: "Appointments" },
  { to: "/history", label: "History" },
  { to: "/history/system", label: "System History" },
];

const Layout = ({ children }) => (
  <>
    <header className="topbar">
      <nav className="navigation" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Karen Nogueira's Salon Home">
          Karen Nogueira's Salon
        </a>
        <div className="navigation-links">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "navigation-link active" : "navigation-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
    <main className="page-content">{children}</main>
  </>
);

export default Layout;
