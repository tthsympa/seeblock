// @flow

import React from 'react';
import styles from './Body.css';

type Props = {

};

type State = {

}

// eslint-disable-next-line react/prefer-stateless-function
class Body extends React.Component<Props, State> {
  render() {
    return (
      <div className={styles.container}>
        <p>Body the body</p>
      </div>
    );
  }
}

export default Body;
