import { useMemo } from "react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { to: "/", label: "Home", end: true },
  { to: "/clients", label: "Clients", end: true },
  { to: "/procedures", label: "Procedures" },
  { to: "/appointments", label: "Appointments" },
  { to: "/history", label: "History", end: true },
  { to: "/history/system", label: "System History" },
];

const watermarkColors = ["#2f8f46", "#2474c6", "#c43d3d"];

const createWatermarkItems = () =>
  Array.from({ length: 300 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 124 - 12}%`,
    top: `${Math.random() * 96}%`,
    rotation: `${Math.round(Math.random() * 360 - 180)}deg`,
    color: watermarkColors[Math.floor(Math.random() * watermarkColors.length)],
  }));

const Layout = ({ children }) => {
  const watermarkItems = useMemo(() => createWatermarkItems(), []);

  return (
    <>
    <div className="watermark" aria-hidden="true">
      {watermarkItems.map((item) => (
        <span
          key={item.id}
          style={{
            left: item.left,
            top: item.top,
            transform: `rotate(${item.rotation})`,
            color: item.color,
          }}
        >
          Karen Nogueira
        </span>
      ))}
    </div>
    <header className="topbar">
      <nav className="navigation" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Salon Manager Home">
          Salon Manager
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
};

export default Layout;