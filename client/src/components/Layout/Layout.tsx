import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '../SideBar/sidebar';
import { AppSidebar } from './app-sidebar';
import NotFound from '../NotFound/NotFound';
import styles from './Layout.module.scss';

function Layout({ children }: { children: React.ReactNode }) {
  const [isValidPage, setIsValidPage] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.replace('/adm/', '');

  useEffect(() => {
    const validPaths = [
      'settings/add-admin',
      'reservations',
      'restaurant-config',
      'settings',
      'help',
    ];

    setIsValidPage(validPaths.some(vp => path.startsWith(vp)));
  }, [path]);

  if (location.pathname === '/adm') {
    navigate('/adm/reservations', { replace: true });
  }

  if (!isValidPage) return <NotFound />;

  // const path = location.pathname.replace("/adm/", "");
  const parts = path.split('/');

  const breadcrumbLinks = parts.map((part, index) => {
    const name = part.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    const fullPath = `/adm/${parts.slice(0, index + 1).join('/')}`;
    const isLast = index === parts.length - 1;

    return isLast ? (
      <span key={index} className="text-gray-700">
        {name}
      </span>
    ) : (
      <Link key={index} to={fullPath} className="text-gray-700 hover:text-black transition-colors">
        {name}
      </Link>
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className={styles.main__container}>
        <div className={styles.header__pwd}>
          <SidebarTrigger />
          <div className={styles.verticalBar}></div>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {breadcrumbLinks.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-gray-400">{'>'}</span>}
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.children}>{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default Layout;
