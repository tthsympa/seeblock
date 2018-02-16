// @flow

import React from 'react';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { withTheme } from 'material-ui/styles';
import styles from './Header.css';

type Props = {

};

// eslint-disable-next-line react/prefer-stateless-function
class Header extends React.Component<Props> {
  goalText: string = 'Visual interpretation of what happen in a blockchain';

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.search}>
          <TextField
            id="search"
            label="Adress / Block / Txhash"
            fullWidth
            onChange={event => console.log(event.target.value)}
          />
        </div>
        <div className={styles.title}>
          <Typography
            align="center"
            variant="display2"
            color="secondary"
          >
            seeblock
          </Typography>
        </div>
        <div className={styles.goal}>
          <Typography
            align="right"
            variant="subheading"
            noWrap
            color="primary"
          >
            {this.goalText}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withTheme()(Header);
