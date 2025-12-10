import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function FloatingZaloButton() {
  const { language } = useLanguage();
  const label = language === 'vi' ? 'Gọi Ngay' : 'Call Us';

  return (
    <motion.div
      className='fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2'
      animate={{ y: [0, -12, 0] }} // Jumping for BOTH bubble + icon
      transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop' }}
    >
      {/* Speech bubble */}
      <motion.div
        className='
          bg-white 
          text-black 
          px-4 py-2 
          rounded-xl 
          shadow-lg 
          border border-gray-200 
          text-sm 
          font-semibold
        '
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {label}

        {/* Little speech arrow */}
        <div
          className='
            absolute left-1/2 -bottom-2 
            -translate-x-1/2 
            w-3 h-3 
            bg-white 
            border-r border-b border-gray-200 
            rotate-45
          '
        ></div>
      </motion.div>

      {/* Zalo icon */}
      <a
        href='https://zalo.me/0762666875'
        target='_blank'
        rel='noopener noreferrer'
        className='cursor-pointer'
      >
        <div className='w-25 h-25 rounded-full bg-blue-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer'>
          <img
            src='/Icon_of_Zalo.png'
            alt='Zalo'
            className='w-20 h-20 object-contain'
          />
        </div>
      </a>
    </motion.div>
  );
}
