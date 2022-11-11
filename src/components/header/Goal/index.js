// @flow

import React from 'react'
import type { Node } from 'react'
import Typography from '@material-ui/core/Typography'
import styles from './Goal.css'

type Props = {
  text: string,
}

const Goal = ({ text }: Props): Node => (
  <div className={styles.goal}>
    <Typography align="right" variant="subtitle1" noWrap color="primary">
      {text}
    </Typography>
  </div>
)

export default Goal
