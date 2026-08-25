const navigationItems = [
  ["home.html", "Home"],
  ["clients.html", "Clients"],
  ["procedures.html", "Procedures"],
  ["appointments.html", "Appointments"],
  ["general-history.html", "History"],
  ["system-history.html", "System History"],
];

const navigation = document.querySelector("#site-navigation");
const currentPage = window.location.pathname.split("/").pop() || "home.html";

if (navigation) {
  const header = document.createElement("header");
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Main navigation");

  navigationItems.forEach(([href, label]) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;

    if (href === currentPage) {
      link.setAttribute("aria-current", "page");
    }

    nav.append(link);
  });

  header.append(nav);
  navigation.append(header);
}
