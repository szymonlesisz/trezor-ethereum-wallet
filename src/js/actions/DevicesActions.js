/* @flow */
'use strict';

// import * as ACCOUNT from './constants/account';
import type { Action, TrezorDevice, DevicesState } from '~/flowtype';
// import type { State } from '../reducers/AccountsReducer';
import type { Device } from 'trezor-connect';


// helper action
// generate new instance id from DevicesState
export const getNewInstance = (devices: DevicesState, device: Device | TrezorDevice): number => {

    const affectedDevices: DevicesState = devices.filter(d => d.features && device.features && d.features.device_id === device.features.device_id)
    .sort((a, b) => {
        if (!a.instance) {
            return -1;
        } else {
            return !b.instance || a.instance > b.instance ? 1 : -1;
        }
    });

    const instance: number = affectedDevices.reduce((inst, dev) => {
        return dev.instance ? dev.instance + 1 : inst + 1;
    }, 0);

    return instance;
}