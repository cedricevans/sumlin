
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Ticket, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { getAdminSession, watchAdminSession } from '@/lib/sumlinData';

const Header = ({ setIsCartOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const session = await getAdminSession();
      if (active) {
        setHasAdminSession(Boolean(session));
      }
    };

    initialize();

    const unsubscribe = watchAdminSession((session) => {
      setHasAdminSession(Boolean(session));
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Family Legacy', path: '/family-legacy' },
    { name: 'Business Corner', path: '/family-business' },
    { name: 'Family Portraits', path: '/family-portraits' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Donate', path: '/donate' },
    ...(hasAdminSession ? [{ name: 'Admin', path: '/admin' }] : [])
  ];

  const isActive = (path) => {
    const [pathPart, hash] = path.split('#');
    if (hash) {
      return location.pathname === pathPart && location.hash === `#${hash}`;
    }
    return location.pathname === path;
  };

  const navigate = useNavigate();

  const handleNavClick = useCallback((e, path) => {
    if (path.includes('#')) {
      e.preventDefault();
      const [pathPart, hash] = path.split('#');
      if (location.pathname === pathPart) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(pathPart);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, [location.pathname, navigate]);

  return (
    <header className="sticky top-0 z-50 bg-navbar border-b border-white/10 shadow-md">
      <nav className="w-full px-4 md:px-6 xl:px-10 py-3 md:py-4">
        <div className="relative flex items-center justify-between lg:justify-between">
          <div className="lg:hidden w-10 flex justify-start">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200 text-white drop-shadow-sm"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <Link to="/" className="flex items-center gap-3 group lg:static lg:translate-x-0 absolute left-1/2 -translate-x-1/2">
            <img 
              src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/84d9ab8efcec41799c1c6b1d68bfb5f9.jpg" 
              alt="Sumlin family crest - ornate heraldic shield with crossed swords, lion emblem, castle towers"
              className="h-12 md:h-14 w-auto object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="text-white text-shadow-sm">
              <span className="block font-bold text-base sm:text-xl tracking-wide leading-tight">Sumlin Family</span>
              <p className="hidden sm:block text-xs text-white/80 uppercase tracking-widest font-semibold">Reunion 2026</p>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 px-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`font-semibold tracking-wide transition-all duration-200 relative whitespace-nowrap text-shadow-sm ${
                  isActive(link.path)
                    ? 'text-[#d4af37] text-shadow-glow'
                    : 'text-white/90 hover:text-white hover:text-shadow-md'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden lg:block relative p-2.5 rounded-xl hover:bg-white/10 transition-colors duration-200 group"
              aria-label="Open cart"
            >
              <ShoppingCartIcon className="w-6 h-6 text-white group-hover:text-[#d4af37] transition-colors drop-shadow-sm" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-burgundy text-white text-xs font-bold flex items-center justify-center shadow-sm"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Link
              to="/store"
              className="hidden md:flex items-center gap-2 gradient-metallic text-black px-5 xl:px-6 py-2.5 rounded-xl font-bold tracking-wide hover:brightness-110 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
            >
              <Ticket className="w-5 h-5" />
              <span className="hidden xl:inline">Fundraiser</span>
              <span className="xl:hidden">Support</span>
            </Link>
            <div className="lg:hidden w-10" />
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 border-t border-white/10 mt-4">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={(e) => {
                        handleNavClick(e, link.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block px-4 py-3 rounded-xl font-semibold tracking-wide transition-colors duration-200 text-shadow-sm ${
                        isActive(link.path)
                          ? 'bg-[#d4af37]/15 text-[#d4af37] text-shadow-glow'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <Link
                  to="/store"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 gradient-metallic text-black px-6 py-3 rounded-xl font-bold tracking-wide mt-4 hover:brightness-110 transition-all shadow-md"
                >
                  <Ticket className="w-5 h-5" />
                  Fundraiser
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-white/15 transition-colors duration-200"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Open Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
