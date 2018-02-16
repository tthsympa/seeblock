// @flow

import React from 'react';
import type { Node } from 'react';
import TextField from 'material-ui/TextField';
import styles from './SearchBar.css';

type Props = {
  inputError: boolean,
  verifyInput: Function,
  go: Function,
};

const SearchBar = ({ inputError, verifyInput, go }: Props): Node => (
  <div className={styles.search}>
    <TextField
      id="search"
      label="Adress / Block"
      fullWidth
      error={inputError}
      onChange={changeEvent => (verifyInput(
        changeEvent.target.value,
        changeEvent.target.value.length,
      ))}
      onKeyPress={keyEvent => go(keyEvent.key)}
    />
  </div>
);

export default SearchBar;
