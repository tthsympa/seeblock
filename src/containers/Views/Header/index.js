// @flow

import React from 'react';
import styles from './Header.css';

type Props = {

};

type State = {

}

// eslint-disable-next-line react/prefer-stateless-function
class Header extends React.Component<Props, State> {
  render() {
    return (
      <div className={styles.container}>
        <p>Headerbar</p>
      </div>
    );
  }
}

export default Header;
