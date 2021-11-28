import React, { memo } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from 'client/assets/images/logo.svg';
import styles from './style.module.scss';

const Header = () => (
  <header>
    <Link to='/'>
      <Logo width={70} className={styles.logo} />

      <h1 className={styles.h1}>React SSR Starter</h1>
    </Link>

    <hr />
  </header>
);

export default memo(Header);
