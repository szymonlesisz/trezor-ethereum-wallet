/* @flow */
'use strict';

import { LOCATION_CHANGE } from 'react-router-redux';
import { DEVICE } from 'trezor-connect';
import * as MODAL from '../actions/constants/modal';
import * as WEB3 from '../actions/constants/web3';
import * as WALLET from '../actions/constants/wallet';
import * as CONNECT from '../actions/constants/TrezorConnect';


import type { 
    State as ReducersState, 
    Action, 
    RouterLocationState, 
    TrezorDevice,
    Account,
    Coin,
    Discovery,
    Token,
    Web3Instance
} from '~/flowtype';

type State = {
    ready: boolean;
    online: boolean;
    dropdownOpened: boolean;
    initialParams: ?RouterLocationState;
    initialPathname: ?string;
    disconnectRequest: ?TrezorDevice;

    // references to other reducers
    selectedDevice: ?TrezorDevice;
    selectedNetwork: ?Coin;
    selectedAccount: ?Account;
    // account specific
    discovery: ?Discovery;
    tokens: Array<Token>;
    web3instance: ?Web3Instance;

}

const initialState: State = {
    ready: false,
    online: navigator.onLine,
    dropdownOpened: false,
    initialParams: null,
    initialPathname: null,
    disconnectRequest: null,

    selectedDevice: null,
    selectedNetwork: null,
    selectedAccount: null,
    
    discovery: null,
    tokens: [],
    web3instance: null
};

export default function wallet(state: State = initialState, action: Action): State {
    switch(action.type) {

        case LOCATION_CHANGE : 
        case MODAL.CLOSE : 
            return {
                ...state,
                dropdownOpened: false
            }

        case WALLET.SET_INITIAL_URL :
            return {
                ...state,
                initialParams: action.state,
                initialPathname: action.pathname
            }

        case WEB3.READY :
            return {
                ...state,
                ready: true
            }

        case WALLET.ONLINE_STATUS :
            return {
                ...state,
                online: action.online
            }

        case WALLET.TOGGLE_DEVICE_DROPDOWN :
            return {
                ...state,
                dropdownOpened: action.opened
            }

        case CONNECT.DISCONNECT_REQUEST :
            return {
                ...state,
                disconnectRequest: action.device
            }

        case DEVICE.DISCONNECT :
            if (state.disconnectRequest && action.device.path === state.disconnectRequest.path) {
                return {
                    ...state,
                    disconnectRequest: null
                }
            }
            return state;

        

        case WALLET.SET_SELECTED_DEVICE :
            return {
                ...state,
                selectedDevice: action.device
            }
            
        case WALLET.SET_SELECTED_NETWORK :
            return {
                ...state,
                selectedNetwork: action.network
            }

        case WALLET.SET_SELECTED_ACCOUNT :
            return {
                ...state,
                selectedAccount: action.account
            }

        case WALLET.SET_DISCOVERY :
            return {
                ...state,
                discovery: action.discovery
            }

        default:
            return state;
    }
}
