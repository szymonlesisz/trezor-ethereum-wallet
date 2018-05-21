/* @flow */
'use strict';

import * as WalletActions from '../actions/WalletActions';
import * as STORAGE from '../actions/constants/localStorage';
import * as WALLET from '../actions/constants/wallet';
import { OPEN, CLOSE, ADD } from '../actions/constants/log';
import { LOCATION_CHANGE } from 'react-router-redux';

import type { 
    Middleware,
    MiddlewareAPI,
    MiddlewareDispatch,
    State,
    Dispatch,
    Action,
    AsyncAction,
    GetState,
    TrezorDevice,
    Account,
    Coin,
    Discovery,
    Token,
    Web3Instance
} from '~/flowtype';


const getSelectedDevice = (state: State): ?TrezorDevice => {
    const locationState = state.router.location.state;
    if (!locationState.device) return null;

    const instance: ?number = locationState.deviceInstance ? parseInt(locationState.deviceInstance) : undefined;
    return state.devices.find(d => d.features && d.features.device_id === locationState.device && d.instance === instance);
}


const getSelectedAccount = (state: State): ?Account => {
    const device = state.wallet.selectedDevice;
    const locationState = state.router.location.state;
    if (!device || !locationState.network || !locationState.account) return null;
    
    const index: number = parseInt(locationState.account);

    return state.accounts.find(a => a.deviceState === device.state && a.index === index && a.network === locationState.network);
}

const getSelectedNetwork = (state: State): ?Coin => {
    const device = state.wallet.selectedDevice;
    const coins = state.localStorage.config.coins;
    const locationState = state.router.location.state;
    if (!device || !locationState.network) return null;
    
    return coins.find(c => c.network === locationState.network);
}

const getDiscoveryProcess = (state: State): ?Discovery => {
    const device = state.wallet.selectedDevice;
    const locationState = state.router.location.state;
    if (!device || !locationState.network) return null;

    return state.discovery.find(d => d.deviceState === device.state && d.network === locationState.network);
}

const getTokens = (state: State): Array<Token> => {
    const account = state.wallet.selectedAccount;
    if (!account) return [];
    return state.tokens.filter(t => t.ethAddress === account.address && t.network === account.network && t.deviceState === account.deviceState);
}

const getWeb3 = (state: State): ?Web3Instance => {
    const locationState = state.router.location.state;
    if (!locationState.network) return null;
    return state.web3.find(w3 => w3.network === locationState.network);
}

/**
 * Middleware 
 */
const WalletService: Middleware = (api: MiddlewareAPI) => (next: MiddlewareDispatch) => (action: Action): Action => {


    const prevState = api.getState();
    const locationChange: boolean = action.type === LOCATION_CHANGE;

    // Application live cycle starts here
    if (locationChange) {
        const { location } = api.getState().router;
        if (!location) {
            // api.dispatch( WalletActions.init() );
            // load data from config.json and local storage
            // api.dispatch( LocalStorageActions.loadData() );
        } else {
            
        }
    }

    // pass action 
    next(action);

    api.dispatch( WalletActions.updateSelectedValues(prevState) );

    const state = api.getState();

    // listening devices state change
    if (locationChange || prevState.devices !== state.devices) {
        const device = getSelectedDevice(state);
        if (state.wallet.selectedDevice !== device) {
            console.warn("UPDATE SELECTED DEVICE!")
            api.dispatch({
                type: WALLET.SET_SELECTED_DEVICE,
                device
            })
        }
    }

    // update selectedAccount
    if (locationChange || prevState.accounts !== state.accounts) {
        const account = getSelectedAccount(state);
        if (state.wallet.selectedAccount !== account) {
            console.warn("UPDATE SELECTED ACC!", account)
            api.dispatch({
                type: WALLET.SET_SELECTED_ACCOUNT,
                account
            })
        }
        
    }

    if (locationChange || prevState.discovery !== state.discovery) {
        const discovery = getDiscoveryProcess(state);
        if (state.wallet.discovery !== discovery) {
            console.warn("UPDATE DISCOVERY", discovery)
            api.dispatch({
                type: WALLET.SET_DISCOVERY,
                discovery
            })
        }
    }

    if (locationChange || prevState.tokens !== state.tokens) {
        const tokens = getTokens(state);
        if (state.wallet.tokens !== tokens) {
            console.warn("UPDATE Tok", tokens)
            api.dispatch({
                type: WALLET.SET_TOKENS,
                tokens
            })
        }
    }

    if (locationChange || prevState.web3 !== state.web3) {
        const web3 = getWeb3(state);
        if (state.wallet.web3instance !== web3) {
            console.warn("UPDATE WEB#", web3)
            api.dispatch({
                type: WALLET.SET_WEB3_INSTANCE,
                web3
            })
        }
    }

    if (locationChange) {
        const network = getSelectedNetwork(state);
        if (state.wallet.selectedNetwork !== network) {
            console.warn("update network!");
            api.dispatch({
                type: WALLET.SET_SELECTED_NETWORK,
                network
            })
        }
    }



   
    return action;
};



export default WalletService;