// @flow

import React from 'react';
import { connect } from 'react-redux';
import SearchBar from 'components/header/SearchBar';
import Title from 'components/header/Title';
import Goal from 'components/header/Goal';
import { input } from 'actions/input';
import { ADRESSLENGTH } from 'config/constants';
import styles from './Header.css';

type Props = {
  dInput: typeof input,
};

type State = {
  searchInput: string,
  inputError: boolean,
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
  };

  goalText: string = 'Visual interpretation of what happen in a blockchain';
  verifyInput: Function;
  go: Function;

  verifyInput = (input: string, inputLength: number) => {
    if (inputLength === ADRESSLENGTH && (/^\w+$/.test(input))) {
      this.setState({
        searchInput: input,
        inputError: false,
      });
    } else if (/^\d+$/.test(input)) {
      this.setState({
        searchInput: input,
        inputError: false,
      });
    } else {
      this.setState({ searchInput: '' });
    }
  }

  go(key: string) {
    const { searchInput } = this.state;
    const { dInput } = this.props;
    if (key === 'Enter') {
      searchInput ? dInput(searchInput, 0) : this.setState({ inputError: true });
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
