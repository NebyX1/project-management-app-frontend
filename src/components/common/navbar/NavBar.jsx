import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiFolder, FiArchive, FiLogOut } from 'react-icons/fi';
import useAuth from '../../../store/useAuth';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const auth = useAuth((state) => state.auth);
  const logout = useAuth((state) => state.logout);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) =>
    `flex items-center px-3 py-2 text-sm rounded-md transition-all duration-300 
    ${isActive(path)
      ? 'bg-white/10 text-white font-medium'
      : 'text-blue-100 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-lg font-semibold text-white tracking-tight">
                D.X. Software de Gestión
              </span>
            </Link>
          </div>

          {/* Desktop Menu - Only show when authenticated */}
          {auth?.access && (
            <div className="hidden md:flex md:items-center md:space-x-2">
              <Link to="/" className={linkStyle('/')}>
                <FiFolder className="w-4 h-4 mr-2" />
                Proyectos Activos
              </Link>
              <Link to="/archived" className={linkStyle('/archived')}>
                <FiArchive className="w-4 h-4 mr-2" />
                Archivados
              </Link>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm rounded-md transition-all duration-300 text-blue-100 hover:bg-white/10 hover:text-white"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          )}

          {/* Mobile menu button - Only show when authenticated */}
          {auth?.access && (
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                <svg
                  className={`h-5 w-5 ${isOpen ? 'hidden' : 'block'}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`h-5 w-5 ${isOpen ? 'block' : 'hidden'}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Only show when authenticated */}
      {auth?.access && (
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={`${linkStyle('/')} block`}>
              <FiFolder className="w-4 h-4 mr-2 inline" />
              Proyectos Activos
            </Link>
            <Link to="/archived" className={`${linkStyle('/archived')} block`}>
              <FiArchive className="w-4 h-4 mr-2 inline" />
              Archivados
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm rounded-md transition-all duration-300 text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <FiLogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;