// @flow

import React from 'react';
import { connect } from 'react-redux';
import SearchBar from 'components/header/SearchBar';
import Title from 'components/header/Title';
import Goal from 'components/header/Goal';
import { input } from 'actions/input';
import { TYPE, ADDRESSLENGTH } from 'config/constants';
import styles from './Header.css';

type Props = {
  dInput: typeof input,
};

type State = {
  searchInput: string,
  inputError: boolean,
  type: number,
};

// eslint-disable-next-line react/prefer-stateless-function
class Header extends React.Component<Props, State> {
  constructor() {
    super();
    this.verifyInput = this.verifyInput.bind(this);
    this.go = this.go.bind(this);
  }

  state: State = {
    searchInput: '',
    inputError: false,
    type: TYPE.NONE,
  };

  goalText: string = 'Visual interpretation of what happen in a blockchain';
  verifyInput: Function;
  go: Function;

  verifyInput = (ipt: string, iptLength: number) => {
    if (iptLength === ADDRESSLENGTH && (/^\w+$/.test(ipt))) {
      this.setState({
        searchInput: ipt,
        inputError: false,
        type: TYPE.ADDRESS,
      });
    } else if (/^\d+$/.test(ipt)) {
      this.setState({
        searchInput: ipt,
        inputError: false,
        type: TYPE.BLOCK,
      });
    } else {
      this.setState({ searchInput: '' });
    }
  }

  go(key: string) {
    const { searchInput, type } = this.state;
    const { dInput } = this.props;
    if (key === 'Enter') {
      searchInput ? dInput(searchInput, type) : this.setState({ inputError: true });
    }
  }

  render() {
    const { inputError } = this.state;
    return (
      <div className={styles.container}>
        <SearchBar
          verifyInput={this.verifyInput}
          go={this.go}
          inputError={inputError}
        />
        <Title />
        <Goal text={this.goalText} />
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  dInput: input,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
