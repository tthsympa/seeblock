// @flow

import React from 'react';
import { connect } from 'react-redux';
import { createWeb3Object } from 'actions/web3';
import Container from 'components/common/Layout/Container';
import Header from 'containers/Views/Header';
import Body from 'containers/Views/Body';
import Footer from 'containers/Views/Footer';
// eslint-disable-next-line no-unused-vars
import styles from './Root.css';

type Props = {
  dCreateWeb3Object: typeof createWeb3Object,
};

// eslint-disable-next-line react/prefer-stateless-function
class Root extends React.Component<Props> {
  componentDidMount() {
    const { dCreateWeb3Object } = this.props;
    dCreateWeb3Object();
  }

  render() {
    return (
      <Container>
        <Header />
        <Body />
        <Footer />
      </Container>
    );
  }
}


const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  dCreateWeb3Object: createWeb3Object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
