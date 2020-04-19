import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import './Header.css';

export default function Header() {
  return (
  <header>
    <p className="home-link">
      <Link to="/">
        <img src={logo} className="logo" alt="logo" />
      </Link>
    </p>
    <nav>
      <ul>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
    <Link to="/dashboard">
      <button>
        Login
      </button>
    </Link>
  </header>
  );
}
