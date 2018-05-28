/* @flow */
'use strict';

import * as CONNECT from '../actions/constants/TrezorConnect';
import * as ACCOUNT from '../actions/constants/account';
import * as SEND from '../actions/constants/send';

import type { Action, TrezorDevice } from '~/flowtype';
import type { 
    AccountCreateAction,
    AccountSetBalanceAction,
    AccountSetNonceAction
} from '../actions/AccountsActions';

export type Account = {
    loaded: boolean;
    +network: string;
    +deviceID: string;
    +deviceState: string;
    +index: number;
    +addressPath: Array<number>;
    +address: string;
    balance: string;
    nonce: number;
}

export type State = Array<Account>;

const initialState: State = [];

export const findAccount = (state: State, index: number, deviceState: string, network: string): ?Account => {
    return state.find(a => a.deviceState === deviceState && a.index === index && a.network === network);
}

export const findDeviceAccounts = (state: State, device: TrezorDevice, network: string): Array<Account> => {
    if (network) {
        return state.filter((addr) => addr.deviceState === device.state && addr.network === network);
    } else {
        return state.filter((addr) => addr.deviceState === device.state);
    }
}

const createAccount = (state: State, action: AccountCreateAction): State => {

    // TODO check with device_id
    // check if account was created before
    // const exist: ?Account = state.find(account => account.address === action.address && account.network === action.network && action.device.features && account.deviceID === action.device.features.device_id);
    const exist: ?Account = state.find(account => account.address === action.address && account.network === action.network && account.deviceState === action.device.state);
    if (exist) {
        return state;
    }

    const account: Account = {
        loaded: false,
        network: action.network,
        deviceID: action.device.features ? action.device.features.device_id : '0',
        deviceState: action.device.state || 'undefined',
        index: action.index,
        addressPath: action.path,
        address: action.address,
        balance: '0',
        nonce: 0,
    }

    const newState: State = [ ...state ];
    newState.push(account);
    return newState;
}

const removeAccounts = (state: State, device: TrezorDevice): State => {
    //return state.filter(account => device.features && account.deviceID !== device.features.device_id);
    return state.filter(account => account.deviceState !== device.state);
}

const setBalance = (state: State, action: AccountSetBalanceAction): State => {
    const index: number = state.findIndex(account => account.address === action.address && account.network === action.network && account.deviceState === action.deviceState);
    const newState: State = [ ...state ];
    newState[index].loaded = true;
    newState[index].balance = action.balance;
    return newState;
}

const setNonce = (state: State, action: AccountSetNonceAction): State => {
    const index: number = state.findIndex(account => account.address === action.address && account.network === action.network && account.deviceState === action.deviceState);
    const newState: State = [ ...state ];
    newState[index].loaded = true;
    newState[index].nonce = action.nonce;
    return newState;
}

export default (state: State = initialState, action: Action): State => {

    switch (action.type) {

        case ACCOUNT.CREATE :
            return createAccount(state, action);

        case CONNECT.FORGET :
        case CONNECT.FORGET_SINGLE :
            return removeAccounts(state, action.device);

        //case CONNECT.FORGET_SINGLE :
        //    return forgetAccounts(state, action);

        case ACCOUNT.SET_BALANCE :
            return setBalance(state, action);
        case ACCOUNT.SET_NONCE :
            return setNonce(state, action);

        case ACCOUNT.FROM_STORAGE :
            return action.payload;


        //case SEND.TX_COMPLETE :
            // add pending amount to account
        //    return state;

        //case PENDING.TX_RESOLVED :
        //case PENDING.TX_NOT_FOUND :

        default:
            return state;
    }

}