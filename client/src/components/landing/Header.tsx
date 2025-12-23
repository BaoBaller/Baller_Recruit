import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'framer-motion';

interface AnimatedContactLinkProps extends HTMLMotionProps<'a'> {
  children: ReactNode;
  delay?: number;
}

export const AnimatedContactLink = ({ children, className = '', ...props }: AnimatedContactLinkProps) => {
  return (
    <motion.a
      {...props}
      initial='rest'
      animate='active'
      whileHover='hover'
      className={`relative font-bold text-red-500 ${className}`}
    >
      {children}

      {/* underline */}
      <motion.span
        className='absolute left-0 -bottom-1 h-[2px] w-full bg-red-500'
        variants={{
          rest: { scaleX: 0, originX: 0 },
          active: { scaleX: 1 },
          hover: { scaleX: 1.1 },
        }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1], // luxury easing
        }}
      />
    </motion.a>
  );
};

export function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        {/* ===========================
            ⭐ MOBILE + TABLET HEADER ⭐
            =========================== */}
        <div className='flex md:hidden items-center justify-between h-20'>
          {/* Left spacer để căn giữa logo */}
          <div className='w-10'></div>

          {/* Logo ở giữa */}
          <a
            href='#home'
            className='flex items-center justify-center'
          >
            <img
              src={isScrolled ? '/Baller Logo (Black).png' : '/Baller New Logo (White).png'}
              alt='Baller Logo'
              className='h-14 w-auto object-contain'
            />
          </a>

          {/* Button bên phải */}
          <motion.a
            href='#jobs'
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.06, 1],
              boxShadow: ['0 0 0px rgba(255, 255, 255, 0.0)', '0 0 12px rgba(255, 82, 82, 0.45)', '0 0 0px rgba(255, 255, 255, 0.0)'],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: 'easeInOut',
            }}
            whileTap={{ scale: 0.92 }}
            className='
    bg-gradient-to-r from-red-500 to-red-600
    text-white font-bold
    px-4 py-2 rounded-xl text-sm
    shadow-lg
    active:scale-95
  '
          >
            Ứng tuyển nhanh
          </motion.a>
        </div>

        {/* ===========================
            ⭐ DESKTOP HEADER ⭐
            =========================== */}
        <div className='hidden md:flex items-center justify-between h-20'>
          <a
            href='#home'
            className='flex items-center gap-2 text-xl font-bold'
          >
            <img
              src={isScrolled ? '/Baller Logo (Black).png' : '/Baller New Logo (White).png'}
              alt='Baller Logo'
              className='h-12 md:h-14 w-auto object-contain'
            />
          </a>

          <nav className='flex items-center gap-8'>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-lg font-bold transition-colors hover:text-primary ${isScrolled ? 'text-foreground' : 'text-white/90 hover:text-white'}`}
              >
                {item.label}
              </a>
            ))}

            {/* Contact */}
            <div className={`flex items-center gap-6 text-lg font-medium ${isScrolled ? 'text-foreground' : 'text-white/90'}`}>
              <AnimatedContactLink
                href='tel:0762666061'
                className='text-[#111111]'
              >
                📞 0762 666 061
              </AnimatedContactLink>

              <AnimatedContactLink
                href='mailto:hiring@ballerheadwear.com'
                className='text-[#111111]'
                delay={0.4}
              >
                ✉️ hiring@ballerheadwear.com
              </AnimatedContactLink>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
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
                  className='block py-3 px-4 rounded-lg font-medium text-foreground hover:bg-muted'
                  onClick={() => setIsMobileMenuOpen(false)}
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
