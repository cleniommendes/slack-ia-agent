import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Clenio Chat',
  description: 'Chat de equipe com agentes de IA.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
