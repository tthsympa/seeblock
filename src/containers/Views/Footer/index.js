// @flow

import React from 'react';
import styles from './Footer.css';

type Props = {

};

type State = {

}

// eslint-disable-next-line react/prefer-stateless-function
class Footer extends React.Component<Props, State> {
  render() {
    return (
      <div className={styles.container}>
        <p>Footer</p>
      </div>
    );
  }
}

export default Footer;
