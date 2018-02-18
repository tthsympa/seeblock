// @flow

import React from 'react';
import Lottie from 'react-lottie';
import { connect } from 'react-redux';
import renderIf from 'utils/renderIf';
import * as animationData from 'assets/loader.json';
import styles from './Footer.css';

type Props = {
  isLoading: boolean,
};

type State = {
}

// eslint-disable-next-line react/prefer-stateless-function
class Footer extends React.Component<Props, State> {
  defaultOptions = {
    loop: true,
    autoplay: false,
    animationData,
  };

  render() {
    const { isLoading } = this.props;
    return (
      <div className={styles.container}>
        {
        renderIf(isLoading)(<Lottie
          options={this.defaultOptions}
          isStopped={!isLoading}
        />)
        }
      </div>
    );
  }
}

const mapStateToProps = ({ input }) => ({
  isLoading: input.isLoading,
});

export default connect(mapStateToProps, null)(Footer);
