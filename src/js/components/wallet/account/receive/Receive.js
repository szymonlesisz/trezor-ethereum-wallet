/* @flow */
'use strict';

import React, { Component } from 'react';

import Tooltip from 'rc-tooltip';
import { QRCode } from 'react-qr-svg';

import SelectedAccount from '../SelectedAccount';
import { Notification } from '~/js/components/common/Notification';

import type { ComponentState } from '../SelectedAccount';
import type { Props } from './index';

export default class Receive extends SelectedAccount<Props> {
    render() {
        return super.render() || _render(this.props, this.state);
    }
}

const _render = (props: Props, state: ComponentState): React$Element<string> => {

    const {
        deviceStatusNotification
    } = state;

    const {
        selectedDevice,
        selectedAccount,
        discovery,
    } = props.wallet;

    const {
        addressVerified,
        addressUnverified,
    } = props.receive;

    if (!selectedDevice || !selectedAccount || !discovery) return <section></section>;

    let qrCode = null;
    let address = `${selectedAccount.address.substring(0, 20)}...`;
    let className = 'address hidden';
    let button = (
        <button disabled={ selectedDevice.connected && !discovery.completed } onClick={ event => props.showAddress(selectedAccount.addressPath) }>
            <span>Show full address</span>
        </button>
    );

    if (addressVerified || addressUnverified) {
        qrCode = (
            <QRCode
                className="qr"
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 256 }}
                value={ selectedAccount.address }
                />
        );
        address = selectedAccount.address;
        className = addressUnverified ? 'address unverified' : 'address';

        const tooltip = addressUnverified ?
            (<div>Unverified address.<br/>{ selectedDevice.connected && selectedDevice.available ? 'Show on TREZOR' : 'Connect your TREZOR to verify it.' }</div>)
            :
            (<div>{ selectedDevice.connected ? 'Show on TREZOR' : 'Connect your TREZOR to verify address.' }</div>);

        button = (
            <Tooltip
                arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                overlay={ tooltip }
                placement="bottomRight">
                <button className="white" onClick={ event => props.showAddress(selectedAccount.addressPath) }>
                    <span></span>
                </button>
            </Tooltip>
        );
    }
    
    return (
        <section className="receive">
            { deviceStatusNotification }
            <h2>Receive Ethereum or tokens</h2>
            
            <div className={ className }>
                <div className="value">
                    { address }
                </div>
                { button }
            </div>
            { qrCode }
        </section>
    );
}