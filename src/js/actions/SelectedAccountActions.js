/* @flow */
'use strict';

import { LOCATION_CHANGE } from 'react-router-redux';
import * as ACCOUNT from './constants/account';
import * as SEND from './constants/send';
import * as NOTIFICATION from './constants/notification';

import * as SendFormActions from './SendFormActions';
import * as SessionStorageActions from './SessionStorageActions';
import * as stateUtils from '../reducers/utils';

import { initialState } from '../reducers/SelectedAccountReducer';

import type {
    Coin,
    TrezorDevice,
    AsyncAction,
    ThunkAction,
    Action, 
    GetState, 
    Dispatch,
    State,
} from '~/flowtype';


export type SelectedAccountAction = {
    type: typeof ACCOUNT.DISPOSE,
} | {
    type: typeof ACCOUNT.UPDATE_SELECTED_ACCOUNT,
    payload: $ElementType<State, 'selectedAccount'>
};

export const updateSelectedValues = (prevState: State, action: Action): AsyncAction => {
    return async (dispatch: Dispatch, getState: GetState): Promise<void> => {

        const locationChange: boolean = action.type === LOCATION_CHANGE;
        const state: State = getState();
        const location = state.router.location;
        const prevLocation = prevState.router.location;

        let needUpdate: boolean = false;

        // reset form to default
        if (action.type === SEND.TX_COMPLETE) {
            dispatch( SendFormActions.init() );
            // linear action
            SessionStorageActions.clear(location.pathname);
        }

        // handle devices state change (from trezor-connect events or location change)
        if (locationChange
            || prevState.accounts !== state.accounts
            || prevState.discovery !== state.discovery
            || prevState.tokens !== state.tokens
            || prevState.pending !== state.pending
            || prevState.web3 !== state.web3) {
            
            const account = stateUtils.getSelectedAccount(state);
            const network = stateUtils.getSelectedNetwork(state);
            const discovery = stateUtils.getDiscoveryProcess(state);
            const tokens = stateUtils.getAccountTokens(state, account);
            const pending = stateUtils.getAccountPendingTx(state.pending, account);
            const web3 = stateUtils.getWeb3(state);

            const payload: $ElementType<State, 'selectedAccount'> = {
                // location: location.pathname,
                account,
                network,
                discovery,
                tokens,
                pending,
                web3
            }

            let needUpdate: boolean = false;
            Object.keys(payload).forEach((key) => {
                if (payload[key] !== state.selectedAccount[key]) {
                    needUpdate = true;
                }
            })

            if (needUpdate) {
                dispatch({
                    type: ACCOUNT.UPDATE_SELECTED_ACCOUNT,
                    payload,
                });

                // check add account notif

            }

            if (locationChange) {

                if (prevLocation) {

                    if (prevLocation.state.network !== location.state.network) {
                        // network changed remove
                        dispatch({
                            type: NOTIFICATION.CLOSE,
                            payload: {
                                id: 'network'
                            }
                        })
                    }

                    // save form data to session storage
                    // TODO: move to state.sendForm on change event
                    if (prevLocation.state.send) {
                        SessionStorageActions.save(prevState.router.location.pathname, state.sendForm);
                    }

                }
                
                if (location.state.network === 'ethereum-classic') {
                    dispatch({
                        type: NOTIFICATION.ADD,
                        payload: {
                            type: "warning",
                            id: 'network',
                            title: location.state.network || 'NON',
                            message: 'Some warning about this network',
                            cancelable: false
                        }
                    });
                }

                if (location.state.network === 'ropsten') {
                    dispatch({
                        type: NOTIFICATION.ADD,
                        payload: {
                            type: "error",
                            id: 'network',
                            title: 'Backend is down',
                            message: 'Some network error',
                            cancelable: false
                        }
                    });
                }

                dispatch({
                    type: NOTIFICATION.ADD,
                    payload: {
                        type: "warning",
          
                        title: location.state.network || 'NON',
                        message: 'Some warning about this network',
                        cancelable: true
                    }
                });
                dispatch({
                    type: NOTIFICATION.ADD,
                    payload: {
                        type: "error",
       
                        title: location.state.network || 'NON',
                        message: 'Some warning about this network',
                        cancelable: true
                    }
                });
                dispatch({
                    type: NOTIFICATION.ADD,
                    payload: {
                        type: "info",
                      
                        title: location.state.network || 'NON',
                        message: 'Some warning about this network',
                        cancelable: true
                    }
                });
                

                

                dispatch( dispose() );
                if (location.state.send) {
                    dispatch( SendFormActions.init( SessionStorageActions.load(location.pathname) ) );
                }
            }
        }
    }
}

export const dispose = (): Action => {
    return {
        type: ACCOUNT.DISPOSE
    }
}