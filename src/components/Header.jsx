
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    { name: 'Business Corner', path: '/family-business' },
    { name: 'Family Portraits', path: '/family-portraits' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Family Legacy', path: '/family-legacy' },
    ...(hasAdminSession ? [{ name: 'Admin', path: '/admin' }] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-navbar border-b border-white/10 shadow-md">
      <nav className="w-full px-4 md:px-6 xl:px-10 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/84d9ab8efcec41799c1c6b1d68bfb5f9.jpg" 
              alt="Sumlin family crest - ornate heraldic shield with crossed swords, lion emblem, castle towers"
              className="h-12 md:h-14 w-auto object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:block text-white text-shadow-sm">
              <span className="font-bold text-xl tracking-wide">Sumlin Family</span>
              <p className="text-xs text-white/80 uppercase tracking-widest font-semibold">Reunion 2026</p>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 px-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
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
              className="relative p-2.5 rounded-xl hover:bg-white/10 transition-colors duration-200 group"
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
              <span className="hidden xl:inline">Support Reunion</span>
              <span className="xl:hidden">Support</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors duration-200 text-white drop-shadow-sm"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
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
                      onClick={() => setIsMobileMenuOpen(false)}
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
                  Support Reunion
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
