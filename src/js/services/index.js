/* @flow */
'use strict';

import LogService from './LogService';
import RouterService from './RouterService';
import LocalStorageService from './LocalStorageService';
import SessionStorageService from './SessionStorageService';
import CoinmarketcapService from './CoinmarketcapService';
import TrezorConnectService from './TrezorConnectService';
import WalletService from './WalletService';

export default [
    LogService,
    RouterService,
    LocalStorageService,
    SessionStorageService,
    TrezorConnectService,
    CoinmarketcapService,
    WalletService
];