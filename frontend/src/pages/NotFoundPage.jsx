import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="empty-state">
    <h1>Page not found</h1>
    <p>The page you requested does not exist.</p>
    <Link to="/">Back to home</Link>
  </main>
);

export default NotFoundPage;
