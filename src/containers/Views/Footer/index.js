// @flow

import React from 'react';
import { withTheme } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import styles from './Footer.css';

type Props = {
  theme: any,
};

type State = {

}

// eslint-disable-next-line react/prefer-stateless-function
class Footer extends React.Component<Props, State> {
  render() {
    const { palette } = this.props.theme;
    return (
      <div style={{ backgroundColor: palette.secondary.main }} className={styles.container}>
        <div className={styles.name}>
          <Typography
            align="left"
            variant="title"
            noWrap
            color="inherit"
          >
            seeblock
          </Typography>
        </div>
        <div className={styles.social}>
          <a
            className="github-button"
            href="https://github.com/TTHledieu/seeblock"
            data-icon="octicon-star"
            data-size="small"
            aria-label="Star TTHledieu/seeblock on GitHub"
          >
            Star
          </a>
          <Typography
            variant="caption"
            noWrap
            color="inherit"
          >
            <a
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/TTHledieu"
            >
              t.me/TTHledieu
            </a>
          </Typography>
        </div>
      </div>
    );
  }
}

export default withTheme()(Footer);
