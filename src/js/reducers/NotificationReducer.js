/* @flow */
'use strict';

import { LOCATION_CHANGE } from 'react-router-redux';
import * as NOTIFICATION from '../actions/constants/notification';
import { DEVICE } from 'trezor-connect';

import type { Action } from '~/flowtype';

export type CallbackAction = {
    label: string;
    callback: Function;
}

export type NotificationEntry = {
    +id: ?string;
    +devicePath: ?string; // device context
    +type: string;
    +title: string;
    +message: string;
    +cancelable: boolean;
    +actions: Array<CallbackAction>;
    +ts: number;
}

export type State = {
    global: Array<NotificationEntry>;
    context: Array<NotificationEntry>;
    expanded: ?string;
}

const initialState: State = {
    global: [
        // {
        //     id: undefined,
        //     devicePath: null,
        //     type: "warning",
        //     title: "Some static notification 2",
        //     message: "This one is not cancelable 2",
        //     cancelable: false,
        //     actions: [],
        //     ts: 2
        // },
        // {
        //     id: undefined,
        //     devicePath: null,
        //     type: "info",
        //     title: "Some static notification",
        //     message: "This one is not cancelable",
        //     cancelable: false,
        //     actions: [],
        //     ts: 1
        // },
        // {
        //     id: undefined,
        //     devicePath: null,
        //     type: "error",
        //     title: "Some static notification 2",
        //     message: "This one is not cancelable 2",
        //     cancelable: false,
        //     actions: [],
        //     ts: 2
        // },
        // {
        //     id: undefined,
        //     devicePath: null,
        //     type: "error",
        //     title: "Some static notification 3",
        //     message: "This one is not cancelable 3",
        //     cancelable: false,
        //     actions: [],
        //     ts: 3
        // },
    ],
    context: [

    ],
    expanded: null
}

const addNotification = (state: State, payload: any): State => {
    // const newState: State = state.filter(e => !e.cancelable);
    const newState: State = { ...state };
    newState.global.push({
        id: payload.id,
        devicePath: payload.devicePath,
        type: payload.type,
        title: payload.title.toString(),
        message: payload.message.toString(),
        cancelable: payload.cancelable,
        actions: payload.actions,
        ts: new Date().getTime()
    });
    newState.expanded = null;

    // TODO: sort
    return newState;
}

const closeNotification = (state: State, payload: any): State => {
    const newState: State = { ...state };
    if (payload && typeof payload.id === 'string') {
        newState.global = state.global.filter(entry => entry.id !== payload.id);
    } else if (payload && typeof payload.devicePath === 'string') {
        newState.global = state.global.filter(entry => entry.devicePath !== payload.devicePath);
    } else {
        newState.global = state.global.filter(entry => !entry.cancelable);
    }
    return newState;
}

export default function notification(state: State = initialState, action: Action): State {
    switch(action.type) {

        case DEVICE.DISCONNECT :
            const path: string = action.device.path; // Flow warning
            //return state.filter(entry => entry.devicePath !== path);
            // TODO!
            return state;

        case NOTIFICATION.ADD :
            return addNotification(state, action.payload);

        case NOTIFICATION.EXPAND :
            return {
                ...state,
                expanded: action.value
            }

        case LOCATION_CHANGE :
        case NOTIFICATION.CLOSE :
            return closeNotification(state, action.payload);

        default:
            return state;
    }
}
