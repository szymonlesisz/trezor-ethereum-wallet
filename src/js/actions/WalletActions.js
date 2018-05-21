/* @flow */
'use strict';

import * as WALLET from './constants/wallet';
import * as stateUtils from '~/js/utils/stateUtils';

import type { 
    Coin, 
    Account, 
    Discovery,
    Token,
    Web3Instance,
    TrezorDevice, 
    RouterLocationState, 
    ThunkAction, 
    AsyncAction,
    Dispatch, 
    GetState,
    State
} from '~/flowtype';

export type WalletAction = {
    type: typeof WALLET.SET_INITIAL_URL,
    state?: RouterLocationState,
    pathname?: string
} | {
    type: typeof WALLET.TOGGLE_DEVICE_DROPDOWN,
    opened: boolean
} | {
    type: typeof WALLET.ON_BEFORE_UNLOAD
} | {
    type: typeof WALLET.ONLINE_STATUS,
    online: boolean
} | {
    type: typeof WALLET.SET_SELECTED_DEVICE,
    device: ?TrezorDevice
} | {
    type: typeof WALLET.SET_SELECTED_ACCOUNT,
    account: ?Account
} | {
    type: typeof WALLET.SET_SELECTED_NETWORK,
    network: ?Coin
} | {
    type: typeof WALLET.SET_DISCOVERY,
    discovery: ?Discovery
} | {
    type: typeof WALLET.SET_TOKENS,
    tokens: Array<Token>
} | {
    type: typeof WALLET.SET_WEB3_INSTANCE,
    web3: ?Web3Instance
}

export const init = (): ThunkAction => {
    return (dispatch: Dispatch, getState: GetState): void => {

        const updateOnlineStatus = (event) => {
            dispatch({
                type: WALLET.ONLINE_STATUS,
                online: navigator.onLine
            })
        }
        window.addEventListener('online',  updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }
}

export const onBeforeUnload = (): WalletAction => {
    return {
        type: WALLET.ON_BEFORE_UNLOAD
    }
}

export const toggleDeviceDropdown = (opened: boolean): WalletAction => {
    return {
        type: WALLET.TOGGLE_DEVICE_DROPDOWN,
        opened
    }
}

export const updateSelectedValues = (prevState: State): AsyncAction => {
    return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
        const state: State = getState();
        const location = state.router.location;

        let needUpdate: boolean = false;
        let newValues = {};

        if (prevState.devices !== state.devices) {
            const device = stateUtils.getSelectedDevice(state);
            if (state.wallet.selectedDevice !== device) {
                console.warn("PREVDEV")
                newValues.device = device;
            }
        }

        if (prevState.accounts !== state.accounts) {
            const account = stateUtils.getSelectedAccount(state);
            if (state.wallet.selectedAccount !== account) {
                newValues.account = account;
            }
        }

        if (!prevState.router.location || prevState.router.location.state.network !== state.router.location.state.network) {
            const network = stateUtils.getSelectedNetwork(state);
            if (state.wallet.selectedNetwork !== network) {
                newValues.network = network;
            }
        }

        if (prevState.discovery !== state.discovery) {
            const discovery = stateUtils.getDiscoveryProcess(state);
            if (state.wallet.discovery !== discovery) {
                newValues.discovery = discovery;
            }
        }

        // Ethereum specific

        if (prevState.tokens !== state.tokens) {
            const tokens = stateUtils.getTokens(state);
            if (state.wallet.tokens !== tokens) {
                newValues.tokens = tokens;
            }
        }

        if (prevState.web3 !== state.web3) {
            const web3 = stateUtils.getWeb3(state);
            if (state.wallet.web3instance !== web3) {
                newValues.web3 = web3;
            }
        }

        if (Object.keys(newValues).length > 0) {
            console.warn("niu values detected!", newValues);
        }
    }
}
