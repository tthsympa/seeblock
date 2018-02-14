// @flow

import React from 'react';
import Typography from '@material-ui/core/Typography'
import styles from './Title.css';

const Title = () => (
  <div className={styles.title}>
    <Typography
      align="center"
      variant="h1"
      color="secondary"
    >
      seeblock
    </Typography>
  </div>
);

export default Title;
