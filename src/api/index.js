// @flow

import Web3 from 'web3'
import { TYPE, STARTBLOCKOFFSET, WEI, LOCALHOST } from 'config/constants'
import type { Input, AdressDatas } from 'reduxTypes/input'
import { List } from 'immutable'

const getWeb3Object = () => new Web3(Web3.givenProvider || LOCALHOST)

const getBlockDatas = (blockNumber: number): Promise<Web3.Block> => {
  const web3: Web3 = getWeb3Object()
  return web3.eth.getBlock(blockNumber, true).then((block) => block)
}
const getTxData = (tx): Object => {
  return {
    value: tx.value / WEI,
    valueInWei: tx.value,
    status: tx.blockHash ? 'success' : 'pending',
    blockHash: tx.blockHash,
    gas: {
      amount: tx.gas,
      price: tx.gasPrice,
    },
  }
}

const getTxByBlock = async (blockNumber: number) => {
  const txs: AdressDatas = {
    adress: '',
    block: blockNumber,
    count: 0,
    from: List(),
    to: List(),
  }
  const web3: Web3 = getWeb3Object()

  // eslint-disable-next-line no-await-in-loop
  const block = await getBlockDatas(blockNumber)
  if (block && block.transactions) {
    block.transactions.forEach((tx) => {
      txs.from = txs.from.push({
        ...getTxData(tx),
        adress: tx.from,
        bTimestamp: block.timestamp,
        from: true,
      })
      txs.to = txs.to.push({
        ...getTxData(tx),
        adress: tx.to,
        bTimestamp: block.timestamp,
        from: false,
      })
    })
  }
  txs.count = txs.from.size + txs.to.size
  return txs
}

const getTxByAdress = async (adress: string) => {
  const txs: AdressDatas = {
    adress,
    block: -1,
    count: 0,
    from: List(),
    to: List(),
  }
  const web3: Web3 = getWeb3Object()
  const lastBlock: number = await web3.eth
    .getBlockNumber()
    .then((number) => number)
  const startBlock: number = lastBlock - STARTBLOCKOFFSET
  for (let i: number = startBlock; i <= lastBlock; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const block = await getBlockDatas(i)
    if (block && block.transactions) {
      block.transactions.forEach((tx) => {
        if (tx.to === adress) {
          txs.from = txs.from.push({
            ...getTxData(tx),
            adress: tx.from,
            bTimestamp: block.timestamp,
            from: true,
          })
        } else if (tx.from === adress) {
          txs.to = txs.to.push({
            ...getTxData(tx),
            adress: tx.to,
            bTimestamp: block.timestamp,
            from: false,
          })
        }
      })
    }
  }
  txs.count = txs.from.size + txs.to.size
  return txs
}

export const fetchElemFromBC = ({ elem, type }: Input) => {
  switch (type) {
    case TYPE.BLOCK:
      return getTxByBlock(parseInt(elem, 10))
    case TYPE.ADRESS:
      return getTxByAdress(elem)
    default:
      return null
  }
}

export const createWeb3Object = () => {
  const web3 = getWeb3Object()
  try {
    return web3.eth.net.getId().then(() => web3)
  } catch (error) {
    return null
  }
}
