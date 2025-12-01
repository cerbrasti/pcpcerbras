// app/fonts/index.ts
import localFont from 'next/font/local';

export const candara = localFont({
  src: [
    { path: './candarab.ttf', weight: '700', style: 'normal' }, // bold
  ],
  display: 'swap',
  variable: '--font-candara', // opcional (p/ Tailwind)
});
