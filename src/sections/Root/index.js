// @flow

import React from 'react'
import { connect } from 'react-redux'
import { createWeb3Object } from 'actions/web3'
import Container from 'components/Container'
import type { Web3ObjectState } from 'reduxTypes/web3'
import Header from '../Header'
import Body from '../Body'
import Warning from '../Warning'
import './Root.css'

type Props = {
  dCreateWeb3Object: typeof createWeb3Object,
  web3: Web3ObjectState,
}

// eslint-disable-next-line react/prefer-stateless-function
class Root extends React.Component<Props> {
  componentDidMount() {
    const { dCreateWeb3Object } = this.props
    dCreateWeb3Object()
  }

  render() {
    const { web3 } = this.props
    return (
      <Container>
        <Header />
        {web3.error || !web3.isConnected ? <Warning /> : <Body />}
      </Container>
    )
  }
}

const mapStateToProps = ({ web3 }) => ({
  web3,
})

const mapDispatchToProps = {
  dCreateWeb3Object: createWeb3Object,
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
