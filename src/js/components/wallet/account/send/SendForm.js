/* @flow */
'use strict';

import React, { Component } from 'react';
import Select from 'react-select';
import AdvancedForm from './AdvancedForm';
import PendingTransactions from './PendingTransactions';
import { FeeSelectValue, FeeSelectOption } from './FeeSelect';
import { Notification } from '~/js/components/common/Notification';
import SelectedAccount from '../SelectedAccount';
import { findAccountTokens } from '~/js/reducers/TokensReducer';

import type { Props } from './index';
import type { ComponentState } from '../SelectedAccount';

export default class Send extends SelectedAccount<Props> {
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


    const selectedAccountLegacy = props.selectedAccount;

    if (!selectedDevice || !selectedAccount || !discovery || !selectedAccountLegacy) return <section></section>;

    const tokens = findAccountTokens(props.tokens, selectedAccount);
    const { network } = selectedAccountLegacy;

    const { 
        address,
        amount,
        setMax,
        coinSymbol,
        selectedCurrency,
        feeLevels,
        selectedFeeLevel,
        gasPriceNeedsUpdate,
        total,
        errors,
        warnings,
        infos,
        advanced,
        sending,
    } = props.sendForm;

    const {
        onAddressChange,
        onAmountChange,
        onSetMax,
        onCurrencyChange,
        onFeeLevelChange,
        updateFeeLevels,
        onSend,
    } = props.sendFormActions;

    const selectedCoin = selectedAccountLegacy.coin;
    const fiatRate = props.fiat.find(f => f.network === network);

    const tokensSelectData = tokens.map(t => {
        return { value: t.symbol, label: t.symbol };
    });
    tokensSelectData.unshift({ value: selectedCoin.symbol, label: selectedCoin.symbol });

    const setMaxClassName: string = setMax ? 'set-max enabled' : 'set-max';

    let updateFeeLevelsButton = null;
    if (gasPriceNeedsUpdate) {
        updateFeeLevelsButton = (
            <span className="update-fee-levels">Recommended fees updated. <a onClick={ updateFeeLevels }>Click here to use them</a></span>
        )
    }

    let addressClassName: ?string;
    if (errors.address) {
        addressClassName = 'not-valid';
    } else if (warnings.address) {
        addressClassName = 'warning';
    } else if (address.length > 0) {
        addressClassName = 'valid';
    }

    let buttonDisabled: boolean = Object.keys(errors).length > 0 || total === '0' || amount.length === 0 || address.length === 0 || sending;
    let buttonLabel: string = 'Send';
    if (coinSymbol !== selectedCurrency && amount.length > 0 && !errors.amount) {
        buttonLabel += ` ${amount} ${ selectedCurrency.toUpperCase() }`
    } else if (coinSymbol === selectedCurrency && total !== '0') {
        buttonLabel += ` ${total} ${ selectedCoin.symbol }`;
    }

    if (!selectedDevice.connected){
        buttonLabel = 'Device is not connected';
        buttonDisabled = true;
    } else if (!selectedDevice.available) {
        buttonLabel = 'Device is unavailable';
        buttonDisabled = true;
    } else if (!discovery.completed) {
        buttonLabel = 'Loading accounts';
        buttonDisabled = true;
    }

    let notification = null;

    return (
        <section className="send-form">

            { deviceStatusNotification }

            <h2>Send Ethereum or tokens</h2>
            <div className="row address-input">
                <label>Address</label>
                <input 
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    value={ address }
                    className={ addressClassName }
                    onChange={ event => onAddressChange(event.target.value) } />
                <span className="input-icon"></span>
                { errors.address ? (<span className="error">{ errors.address }</span>) : null }
                { warnings.address ? (<span className="warning">{ warnings.address }</span>) : null }
                { infos.address ? (<span className="info">{ infos.address }</span>) : null }
            </div>

            <div className="row">
                <label>Amount</label>
                <div className="amount-input">
                    <input 
                        type="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={ amount }
                        className={ errors.amount ? 'not-valid' : null }
                        onChange={ event => onAmountChange(event.target.value) } />

                    <a className={ setMaxClassName } onClick={ onSetMax }>Set max</a>

                    <Select
                        name="currency"
                        className="currency"
                        searchable={ false }
                        clearable= { false }
                        multi={ false }
                        value={ selectedCurrency }
                        disabled={ tokensSelectData.length < 2 }
                        onChange={ onCurrencyChange }
                        options={ tokensSelectData } />
                </div>
                { errors.amount ? (<span className="error">{ errors.amount }</span>) : null }
                { warnings.amount ? (<span className="warning">{ warnings.amount }</span>) : null }
            </div>

            <div className="row">
                <label>Fee{ updateFeeLevelsButton }</label>
                <Select 
                    name="fee"
                    className="fee"
                    searchable={ false }
                    clearable= { false }
                    value={ selectedFeeLevel }
                    onChange={ onFeeLevelChange }
                    valueComponent={ FeeSelectValue }
                    optionComponent={ FeeSelectOption }
                    optionClassName="fee-option"
                    options={ feeLevels } />
            </div>

            <AdvancedForm 
                selectedAccount={ props.selectedAccount }
                sendForm={ props.sendForm }
                sendFormActions={ props.sendFormActions }>
                <button disabled={ buttonDisabled } onClick={ event => onSend() }>{ buttonLabel }</button>
            </AdvancedForm>

            <PendingTransactions 
                pending={ props.pending }
                tokens={ props.tokens }
                account={ selectedAccount }
                selectedCoin={ selectedCoin } />
    
        </section>
    );
}
