import React from 'react';

import logo from '../../assets/logo.svg';
import './Media.css';

export default function Media() {
  return (
    <div className="media">

      <div className="img">
        <img src={logo} alt="logo"/>
      </div>
      <h2 className="title">This is my title</h2>
      <div className="content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula vitae ligula sit amet maximus. Nunc
          auctor neque ipsum, ac porttitor elit lobortis ac. Vivamus ultrices sodales tellus et aliquam. Pellentesque
          porta sit amet nulla vitae luctus.
          Praesent quis risus id dolor venenatis condimentum.</p>
      </div>
      <div className="footer">
        An optional footer goes here.
      </div>
    </div>
  );
}
