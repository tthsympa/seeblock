// @flow

import React from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { connect } from 'react-redux'
import Lottie from 'react-lottie'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import type { InputState } from 'reduxTypes/input'
import TrackballControls from 'helpers/TrackballControls'
import GPUParticleSystem from 'helpers/GPUParticleSystem'
import AdressModel from 'helpers/AdressModel'
import * as animationData from 'assets/eyeball.json'
import styles from './Body.css'

type Props = {
  input: InputState,
  selectedAddress: string,
}

type State = {}

function isAddressOrBlock({ adress, block }) {
  return adress ? 'Address' : block ? 'Block' : ''
}

function getTxInfos({ address, data: { to, from } }) {
  if (!address) return undefined
  return (
    to.find((infos) => infos.adress === address) ||
    from.find((infos) => infos.adress === address)
  )
}

// eslint-disable-next-line react/prefer-stateless-function
class Infos extends React.Component<Props, State> {
  render() {
    const { data } = this.props.input
    const { selectedAddress } = this.props
    const type = isAddressOrBlock(data)
    const txInfos = getTxInfos({ address: selectedAddress, data })
    return (
      <div className={styles.infos}>
        <div className={styles.infos_general}>
          <Typography variant="h5" color="primary">
            Type: {type || '-'}
          </Typography>
          <Typography variant="body1" color="secondary">
            Number of transactions:{' '}
            {data.count === undefined ? '-' : data.count}{' '}
            {type === 'Address' && (
              <Typography component="span" variant="caption">
                (in the last 30 blocks)
              </Typography>
            )}
          </Typography>
          <Typography display="inline" variant="body1" color="secondary">
            ID:{' '}
            <Typography component="span" variant="body2">
              {data.adress || data.block || '-'}
            </Typography>
          </Typography>
        </div>
        {txInfos && (
          <React.Fragment>
            <Divider />
            <div className={styles.infos_general}>
              <Typography variant="h5" color="primary">
                {txInfos.from ? 'Incoming' : 'Outgoing'} transaction
              </Typography>
              <Typography display="inline" variant="body1" color="secondary">
                Status: {txInfos.status}
              </Typography>
              <Typography component="div" variant="body1" color="secondary">
                Value: {txInfos.valueInWei} WEI
                <Typography component="div" variant="caption">
                  to ETH: {txInfos.value} ETH
                </Typography>
              </Typography>
              <Typography variant="body1" color="secondary">
                Gas amount: {txInfos.gas.amount}
              </Typography>
              <Typography variant="body1" color="secondary">
                Gas price: {txInfos.gas.price}
              </Typography>
              <Typography display="inline" variant="body1" color="secondary">
                Block hash:{' '}
                <Typography component="span" variant="caption">
                  {txInfos.blockHash}
                </Typography>
              </Typography>
              <Typography component="div" variant="body1" color="secondary">
                Timestamp: {txInfos.bTimestamp}
                <Typography component="div" variant="caption">
                  to date:{' '}
                  {new Date(txInfos.bTimestamp * 1000).toLocaleDateString()}
                </Typography>
              </Typography>
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Infos
