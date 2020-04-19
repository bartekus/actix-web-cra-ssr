import React from 'react';

import Header from './Header';
import Footer from './Footer';

// @ts-ignore
export default function Layout({children}) {
  return (
  <>
    <Header />

    <div className="wrapper">
      <aside>
        Sidebar
      </aside>

      <main>
        {children}
      </main>
    </div>

    <Footer />
  </>
  );
}
