// @flow

import React from 'react';
import type { Node } from 'react';
import styles from './Container.css';

type Props = {
  children?: Node,
};

const Container = ({ children }: Props): Node => (
  <div className={styles.container}>
    {children}
  </div>
);

Container.defaultProps = {
  children: null,
};

export default Container;
