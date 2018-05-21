/* @flow */
'use strict';

import React, { Component } from 'react';
import { Notification } from '~/js/components/common/Notification';
import { findDevice } from '~/js/reducers/TrezorConnectReducer';

// import * as SelectedAccountActions from '~/js/actions/SelectedAccountActions';
import { default as SelectedAccountActions } from '~/js/actions/SelectedAccountActions';

import type { State, TrezorDevice, Action, ThunkAction } from '~/flowtype';
import type { Account } from '~/js/reducers/AccountsReducer';
import type { Discovery } from '~/js/reducers/DiscoveryReducer';

export type StateProps = {
    selectedAccount: $ElementType<State, 'selectedAccount'>,
    devices: $PropertyType<$ElementType<State, 'connect'>, 'devices'>,
    discovery: $ElementType<State, 'discovery'>,
    accounts: $ElementType<State, 'accounts'>,
    wallet: $ElementType<State, 'wallet'>,
}

export type DispatchProps = {
    selectedAccountActions: typeof SelectedAccountActions,
    initAccount: () => ThunkAction,
    disposeAccount: () => Action,
}

export type Props = StateProps & DispatchProps;

export type ComponentState = {
    deviceStatusNotification: ?React$Element<typeof Notification>;
}

export default class SelectedAccount<P> extends Component<Props & P, ComponentState> {

    state: ComponentState = {
        deviceStatusNotification: null
    };

    componentDidMount() {
        this.props.selectedAccountActions.init();
        this.props.initAccount();
    }

    componentWillReceiveProps(props: Props & P) {
        
        this.props.selectedAccountActions.update( this.props.initAccount );

        const accountState = props.selectedAccount;
        if (!accountState) return;

        const {
            selectedDevice,
            selectedAccount,
            discovery 
        } = props.wallet;

        if (!selectedDevice) return;

        let deviceStatusNotification: ?React$Element<typeof Notification> = null;
        if (selectedAccount) {
            if (!selectedDevice.connected) {
                deviceStatusNotification = <Notification className="info" title={ `Device ${ selectedDevice.instanceLabel } is disconnected` } />;
            } else if (!selectedDevice.available) {
                deviceStatusNotification = <Notification className="info" title={ `Device ${ selectedDevice.instanceLabel } is unavailable` } message="Change passphrase settings to use this device" />;
            }
        }

        if (discovery && !discovery.completed && !deviceStatusNotification) {
            deviceStatusNotification = <Notification className="info" title="Loading accounts..." />;
        }

        this.setState({
            deviceStatusNotification
        })
    }

    componentWillUnmount() {
        this.props.selectedAccountActions.dispose();
        this.props.disposeAccount();
    }

    render(): ?React$Element<string> {

        const props = this.props;
        const accountState = props.selectedAccount;

        const {
            selectedDevice,
            selectedAccount,
            discovery 
        } = props.wallet;
        
        if (!selectedDevice) {
            return (<section><Notification className="warning" title={ `Loading device...` } /></section>);
            //return (<section><Notification className="warning" title={ `Device with state ${accountState.deviceState} not found` } /></section>);
        }

        // account not found. checking why...
        if (!selectedAccount) {
            if (!discovery || discovery.waitingForDevice) {
                
                if (selectedDevice.connected) {
                    // case 1: device is connected but discovery not started yet (probably waiting for auth)
                    if (selectedDevice.available) {
                        return (
                            <section>
                                <Notification className="info" title="Loading accounts..." />
                            </section>
                        );
                    } else {
                        // case 2: device is unavailable (created with different passphrase settings) account cannot be accessed 
                        return (
                            <section>
                                <Notification 
                                    className="info" 
                                    title={ `Device ${ selectedDevice.instanceLabel } is unavailable` } 
                                    message="Change passphrase settings to use this device"
                                     />
                            </section>
                        );
                    }
                } else {
                    // case 3: device is disconnected 
                    return (
                        <section>
                            <Notification 
                                className="info" 
                                title={ `Device ${ selectedDevice.instanceLabel } is disconnected` } 
                                message="Connect device to load accounts"
                                />
                        </section>
                    );
                }
            } else if (discovery.waitingForBackend) {
                // case 4: backend is not working
                return (
                    <section>
                        <Notification className="warning" title="Backend not working" />
                    </section>
                );
            } else if (discovery.completed) {
                // case 5: account not found and discovery is completed
                return (
                    <section>
                        <Notification className="warning" title="Account does not exist" />
                    </section>
                );
            } else {
                // case 6: discovery is not completed yet
                return (
                    <section>
                        <Notification className="info" title="Account is loading..." />
                    </section>
                );
            }
        }

        return null;
    }
}