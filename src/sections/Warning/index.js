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
        <Typography
          variant="h4"
          color="primary"
          style={{ marginBottom: '8px' }}
        >
          Oops ! We can't connect to the Ethereum network
        </Typography>
        <Typography variant="body1" color="secondary">
          For <i>seeblock</i> to work, an Ethereum provider must be injected in
          your browser.
        </Typography>
        <Typography variant="body1" color="secondary">
          You can install{' '}
          <Link
            href="https://metamask.io/"
            target="_blank"
            rel="noopener"
            rel="noreferrer"
            color="primary"
          >
            Metamask
          </Link>{' '}
          web extension in your browser (Chrome, Firefox)
        </Typography>
      </div>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
