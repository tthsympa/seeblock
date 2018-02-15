// @flow

import React from 'react';
import Web3 from 'web3';

type Props = {

};

type State = {
  currentBlock: number,
}

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<Props, State> {
  state: State = {
    currentBlock: -1,
  };

  setCurrentBlock = (blockHeader: any) => this.setState({ currentBlock: blockHeader.number });
  initializeWeb3 = () => new Web3(Web3.givenProvider || 'ws://localhost:8546');

  render() {
    const web3: Web3 = this.initializeWeb3();
    const newBlocksHeaderEvent = web3.eth.subscribe('newBlockHeaders')
      .on('data', this.setCurrentBlock);
    return (
      <div>
        <p>This is my new react app</p>
        <p>Current block : {this.state.currentBlock}</p>
      </div>
    );
  }
}

export default App;
