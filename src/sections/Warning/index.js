// @flow

import React from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import styles from './Warning.css'

type Props = {}

type State = {}

// eslint-disable-next-line react/prefer-stateless-function
class Header extends React.Component<Props, State> {
  render() {
    return (
      <div className={styles.container}>
        <Typography variant="h4" color="primary" style={{ marginBottom: '8px'}}>
          Oops ! You seems not connected to the Ethereum network
        </Typography>
        <Typography variant="body1" color="secondary">
          In ordre to <i>seeblock</i> to work, a Ethereum blockchain provider
          must be injected in your browser.
        </Typography>
        <Typography variant="body1" color="secondary">
          An easy method is to install{' '}
          <Link
            href="https://metamask.io/"
            target="_blank"
            rel="noopener"
            rel="noreferrer"
            color="primary"
          >
            Metamask
          </Link>{' '}
          web extansion in your browser (Chrome, Firefox)
        </Typography>
        <Typography variant="body1" color="secondary">
          It'll allow you to interact with the Ethereum network. <i>seeblock</i>{' '}
          will use it perform it's requests.
        </Typography>
      </div>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
