/* @flow */
'use strict';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { default as SendFormActions } from '~/js/actions/SendFormActions';
import { default as SelectedAccountActions } from '~/js/actions/SelectedAccountActions';
import SendForm from './SendForm';

import type { MapStateToProps, MapDispatchToProps } from 'react-redux';
import type { State, Dispatch } from '~/flowtype';
import type { StateProps as BaseStateProps, DispatchProps as BaseDispatchProps } from '../SelectedAccount';

type OwnProps = { }

export type StateProps = BaseStateProps & {
    tokens: $ElementType<State, 'tokens'>,
    pending: $ElementType<State, 'pending'>,
    sendForm: $ElementType<State, 'sendForm'>,
    fiat: $ElementType<State, 'fiat'>,
    localStorage: $ElementType<State, 'localStorage'>,
    children?: React.Node;
}

export type DispatchProps = BaseDispatchProps & {
    sendFormActions: typeof SendFormActions
}

export type Props = StateProps & DispatchProps;

const mapStateToProps: MapStateToProps<State, OwnProps, StateProps> = (state: State, own: OwnProps): StateProps => {
    return {
        selectedAccount: state.selectedAccount,
        devices: state.connect.devices,
        accounts: state.accounts,
        discovery: state.discovery,
        tokens: state.tokens,
        pending: state.pending,
        sendForm: state.sendForm,
        fiat: state.fiat,
        localStorage: state.localStorage,
        wallet: state.wallet
    };
}

const mapDispatchToProps: MapDispatchToProps<Dispatch, OwnProps, DispatchProps> = (dispatch: Dispatch): DispatchProps => {
    return {
        selectedAccountActions: bindActionCreators(SelectedAccountActions, dispatch), 
        sendFormActions: bindActionCreators(SendFormActions, dispatch),
        initAccount: bindActionCreators(SendFormActions.init, dispatch),  
        disposeAccount: bindActionCreators(SendFormActions.dispose, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendForm)