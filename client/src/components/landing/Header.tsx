import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle, LanguageToggleCompact } from '@/components/landing/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, Briefcase } from 'lucide-react';

export function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.jobs, href: '#jobs' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'}`}
      data-testid='header'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-20'>
          <a
            href='#home'
            className='flex items-center gap-2 text-xl font-bold'
            data-testid='link-logo'
          >
            <div className='flex items-center'>
              <img
                src={isScrolled ? '/Baller Logo (Black).png' : '/Baller New Logo (White).png'}
                alt='Baller Logo'
                className='h-12 md:h-14 w-auto object-contain'
              />
            </div>
          </a>

          <nav className='hidden md:flex items-center gap-8'>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-lg font-bold transition-colors hover:text-primary ${isScrolled ? 'text-foreground' : 'text-white/90 hover:text-white'}`}
              >
                {item.label}
              </a>
            ))}

            {/* Contact Info (phone + email) */}
            <div className={`flex items-center gap-6 text-lg font-medium ${isScrolled ? 'text-foreground' : 'text-white/90'}`}>
              <a
                href='tel:0762666875'
                className='hover:text-primary transition-colors font-bold'
              >
                📞 0762 666 875
              </a>
              <a
                href='mailto:hr@ballerheadwear.com'
                className='hover:text-primary transition-colors font-bold'
              >
                ✉️ hr@ballerheadwear.com
              </a>
            </div>
          </nav>

          {/*
          <div className='hidden md:flex items-center gap-4'>
            <LanguageToggle />
          </div>

          <div className='flex md:hidden items-center gap-2'>
            <LanguageToggleCompact />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={isScrolled ? '' : 'text-white'}
              data-testid='button-mobile-menu'
            >
              {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </Button>
          </div>
          */}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden bg-background border-b'
          >
            <nav className='px-4 py-4 space-y-2'>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className='block py-3 px-4 rounded-lg font-medium text-foreground hover:bg-muted transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`link-mobile-nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
