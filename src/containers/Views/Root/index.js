// @flow

import React from 'react';
import Container from 'components/common/Layout/Container';
import Header from 'containers/Views/Header';
import Body from 'containers/Views/Body';
import Footer from 'containers/Views/Footer';
// eslint-disable-next-line no-unused-vars
import styles from './Root.css';

type Props = {
};

// eslint-disable-next-line react/prefer-stateless-function
class Root extends React.Component<Props> {
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

export default Root;
