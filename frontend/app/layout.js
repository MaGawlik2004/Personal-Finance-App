'use client'
import { usePathname } from 'next/navigation';
import Navigation from './components/Navigation';
import '../styles/home-page.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hiddenNavigationPaths = ['/', '/login', '/registration'];

  const showNavigation = !hiddenNavigationPaths.includes(pathname);

    return (
      <html lang="pl">
        <head />
        <body>
          <header>
            <img src="/Logo-FinMate.png" alt="Logo mojej strony" />
            {showNavigation && <Navigation />}
          </header>
            <main>{children}</main>
        </body>
      </html>
    );
  }