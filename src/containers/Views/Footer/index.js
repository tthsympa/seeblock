// @flow

import React from 'react';
import type { Node } from 'react';
import Divider from 'material-ui/Divider';
import github from 'assets/GitHub-Mark-64px.png';
import telegram from 'assets/Telegram-64px.png';
import styles from './Footer.css';

const Footer = (): Node => (
  <div className={styles.container}>
    <Divider />
    <div className={styles.logos}>
      <form action="https://github.com/TTHledieu/seeblock" target="_blank">
        <button className={styles.logoButton}>
          <img className={styles.logoImg} src={github} alt="github-logo" />
        </button>
      </form>
      <form action="https://t.me/TTHledieu" target="_blank">
        <button className={styles.logoButton}>
          <img className={styles.logoImg} src={telegram} alt="telegram-logo" />
        </button>
      </form>
    </div>
  </div>
);

export default Footer;
// <div className={styles.loading}>
//           {
//           renderIf(isLoading)(<Lottie
//             options={this.defaultOptions}
//             isStopped={!isLoading}
//           />)
//           }
//         </div>
//  defaultOptions = {
//   loop: true,
//   autoplay: false,
//   animationData,
// };
