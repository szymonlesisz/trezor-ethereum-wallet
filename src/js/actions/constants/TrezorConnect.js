/* @flow */
'use strict';

//regExp1 : string = '(.*)'
//regExp2 : '$1' = '$1'

export const READY: 'connect__ready' = 'connect__ready';
export const INITIALIZATION_ERROR: 'connect__init_error' = 'connect__init_error';


export const DEVICE_FROM_STORAGE: 'connect__device_from_storage' = 'connect__device_from_storage';
export const AUTH_DEVICE: 'connect__auth_device' = 'connect__auth_device';
export const COIN_CHANGED: 'connect__coin_changed' = 'connect__coin_changed';

export const REMEMBER_REQUEST: 'connect__remember_request' = 'connect__remember_request';
export const FORGET_REQUEST: 'connect__forget_request' = 'connect__forget_request';
export const FORGET: 'connect__forget' = 'connect__forget';
export const FORGET_SINGLE: 'connect__forget_single' = 'connect__forget_single';
export const DISCONNECT_REQUEST: 'connect__disconnect_request' = 'connect__disconnect_request';
export const REMEMBER: 'connect__remember' = 'connect__remember';

export const TRY_TO_DUPLICATE: 'connect__try_to_duplicate' = 'connect__try_to_duplicate';
export const DUPLICATE: 'connect__duplicate' = 'connect__duplicate';

export const DEVICE_STATE_EXCEPTION: 'connect__device_state_exception' = 'connect__device_state_exception';

export const START_ACQUIRING: 'connect__start_acquiring' = 'connect__start_acquiring';
export const STOP_ACQUIRING: 'connect__stop_acquiring' = 'connect__stop_acquiring';