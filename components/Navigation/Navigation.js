/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React from 'react';
import './Navigation.scss';
import Link from '../Link';

function Navigation() {
  return (
    <nav role="navigation">
      <div>
        <div className="nav-container">
          <Link className="logo" to="/"><img onClick={Link.handleClick} role="link" src="link-sf.png" alt="San Francisco website that connects homeless and low-income residents with critical and life-saving resources"/></Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
