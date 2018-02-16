// @flow

import React from 'react';
import SearchBar from 'components/header/SearchBar';
import Title from 'components/header/Title';
import Goal from 'components/header/Goal';
import styles from './Header.css';

type Props = {

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
    if (inputLength === 42 && (/^\w+$/.test(input))) {
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
    if (key === 'Enter') {
      searchInput ? console.log('good') : this.setState({ inputError: true });
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

export default Header;
