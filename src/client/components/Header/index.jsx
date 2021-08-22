import React, { memo } from 'react';
import { Link } from '@reach/router';

import { ReactComponent as Logo } from 'client/assets/images/logo.svg';
import styles from './style.module.scss';

const Header = () => (
  <Link to='/'>
    <Logo width={70} className={styles.logo} />

    <h1>React SSR Starter</h1>
  </Link>
);

export default memo(Header);
