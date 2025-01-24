import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  path: string;
  label: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map paths to readable labels
  const getBreadcrumbLabel = (path: string): string => {
    switch (path.toLowerCase()) {
      case 'create':
        return 'Create Ticket';
      case 'edit':
        return 'Edit Ticket';
      default:
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
  };

  // Generate breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = pathnames.map((path, index) => {
    const url = `/${pathnames.slice(0, index + 1).join('/')}`;
    return {
      path: url,
      label: getBreadcrumbLabel(path),
    };
  });

  // Don't show breadcrumbs on login page or root path (which is also login)
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  // If we're on the board page, don't show it in breadcrumbs to avoid duplication
  const filteredBreadcrumbs = breadcrumbs.filter(item => item.path !== '/board');

  return (
    <nav className="breadcrumbs container fade-in">
      <span className="breadcrumb-label">Navigation:</span>
      <Link to="/board" className="breadcrumb-item">Board</Link>
      {filteredBreadcrumbs.map((item, index) => (
        <span key={item.path}>
          <span className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}>
            {index === breadcrumbs.length - 1 ? (
              item.label
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </span>
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
