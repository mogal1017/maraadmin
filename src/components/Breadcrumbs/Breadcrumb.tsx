import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
  to?: string; // Add a to prop for the link destination
  children?: React.ReactNode; // Ensure children prop is optional
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageName, to, children }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary cursor-pointer">
            {to ? <Link to={to}></Link> : <span></span>}
            {children}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
