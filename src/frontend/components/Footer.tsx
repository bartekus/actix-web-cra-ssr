import React from 'react';

export default function Footer() {
  return (
  <footer>
    <h3>{'Copyright © '}</h3>
    {' '}
    {new Date().getFullYear()}
    {'.'}
  </footer>
  );
}
