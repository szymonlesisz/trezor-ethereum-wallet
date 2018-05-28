/* @flow */
'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NOTIFICATION from '~/js/actions/constants/notification';
import * as NotificationActions from '~/js/actions/NotificationActions';
import type { Action, State, Dispatch } from '~/flowtype';

type Props = {
    notifications: $ElementType<State, 'notifications'>,
    close: (notif?: any) => Action,
    expand: typeof NotificationActions.expand,
}

type NProps = {
    key?: number;
    className: string;
    cancelable?: boolean;
    title: string;
    message?: string;
    actions?: Array<any>;
    close?: typeof NotificationActions.close
}

export const Notification = (props: NProps): React$Element<string>  => {
    const className = `notification ${ props.className }`;
    const close: Function = typeof props.close === 'function' ? props.close : () => {}; // TODO: add default close action
    const actionButtons = props.actions ? props.actions.map((a, i) => {
        return (
            <button key={ i } onClick={ event => { close(); a.callback(); } } className="transparent">{ a.label }</button>
        )
    }) : null;

    return (
        <div className={ className }>
            { props.cancelable ? (
                <button className="notification-close transparent" 
                    onClick={ event => close() }></button>
            ) : null }
            <div className="notification-body">
                <h2>{ props.title }</h2>
                { props.message ? (<p dangerouslySetInnerHTML={{__html: props.message }}></p>) : null }
            </div>
            { props.actions && props.actions.length > 0 ? (
                <div className="notification-action">
                    { actionButtons }
                </div>
            ) : null }

        </div>
    )
}

const PRIORITY: Array<string> = ['error', 'warning', 'info', 'success'];

export const NotificationGroup = (props: Props) => {
    const { notifications, close } = props;

    if (notifications.global.length < 1) return null;

    if (notifications.global.length === 1) {
        // only one notif
    }

    // group by cancelable (pinned)
    const pinned = notifications.global.filter(n => !n.cancelable);
    const cancelable = notifications.global.filter(n => n.cancelable);

    // sort pinned by priority
    const pinnedSorted = pinned.sort((a ,b) => {
        const p = PRIORITY.indexOf(a.type) - PRIORITY.indexOf(b.type);
        if (p !== 0) return p;
        return b.ts - a.ts;
    });

    const pinnedNotifications = pinnedSorted.map((n, i) => {
        return (
            <Notification 
                    key={i}
                    className={ n.type }
                    title={ n.title }
                    message={ n.message }
                    cancelable={ n.cancelable }
                    actions={ n.actions }
                    close={ close }
                    />
        );
    });


    // sort pinned by priority
    let useGroup: boolean = false;
    const cancelableSorted = cancelable.sort((a ,b) => {
        const p = PRIORITY.indexOf(a.type) - PRIORITY.indexOf(b.type);
        if (p !== 0) {
            useGroup = true;
            return p;
        }
        return b.ts - a.ts;
    });
    
    const group: { [key: string]: Array<any> } = {};
    cancelableSorted.forEach((n) => {
        if (!Array.isArray(group[n.type])) {
            group[n.type] = [];
        }
        group[n.type].push(n);
    });

    const keys: Array<string> = Object.keys(group).sort((a, b) => {
        if (notifications.expanded === a) return -1;
        if (notifications.expanded === b) return 1;
        return PRIORITY.indexOf(a) - PRIORITY.indexOf(b);
    });

    const cancelableNotifications = keys.map((key, index) => {
        const len = group[key].length;
        if (index == 0) {
            const notificationGroup = group[key].map((n, i) => {
                return (
                    <Notification 
                        key={i}
                        className={ n.type }
                        title={ n.title }
                        message={ n.message }
                        cancelable={ n.cancelable }
                        actions={ n.actions }
                        close={ close }
                        />
                )
            });

            return (
                <div key={index} className={ `notifications-expanded-group ${ key }` }>
                    { notificationGroup }
                </div>
            );
        } else {
            const k = len > 1 ? `${ key }s` : key;
            return (<div key={index} className={ `notifications-group ${ key }` } onClick={ event => props.expand(key) }>{ k } ({ len })</div>)
        }
    });

    return (
        <div className="notifications">
            { pinnedNotifications }
            { cancelableNotifications }
        </div>
    )



    



    // const group: { [key: string]: Array<any> } = {};

    // const sorted = notifications.global.sort((a, b) => {
    //     if (!a.ts || !b.ts) {
    //         return -1;
    //     } else {
    //         return a.ts > b.ts ? -1 : 1;
    //     }
    // });

    // const focused = sorted[0];

    // sorted.forEach((n => {
    //     if (!Array.isArray(group[n.type])) {
    //         group[n.type] = [];
    //     }
    //     group[n.type].push(n);
    // }));

    // const keys: Array<string> = Object.keys(group);
    
    // if (keys.length > 1) {
    //     keys.sort((a, b) => {
    //         return priority.indexOf(a) > priority.indexOf(b) ? 1 : -1;
    //     })
    // }

    // console.warn("SORTED!", sorted, group, keys, focused)

    // const g = keys.map((key, i) => {
    //     const len = group[key].length;
    //     const gg = group[key].map((n, i) => {
    //         return (
    //             <Notification 
    //                 key={i}
    //                 className={ n.type }
    //                 title={ n.title }
    //                 message={ n.message }
    //                 cancelable={ n.cancelable }
    //                 actions={ n.actions }
    //                 close={ close }
    //                 />
    //         )
    //     });

    //     if (notifications.expanded === key) {
    //         return (
    //             <div className="notifications-group">
    //                 <div>{ key } ({ len })</div>
    //                 <div>{ gg }</div>
    //             </div>
    //         );
    //     } else {
    //         return (<div className="notifications-group" onClick={ event => props.expand(key) }>{ key } ({ len })</div>)
    //     }

        
    // });

    // return (
    //     <div className="notifications">
    //         { g }
    //     </div>
    // )

    

    // // return sorted.map((n, i) => {
    //     return (
    //         <Notification 
    //             key={i}
    //             className={ n.type }
    //             title={ n.title }
    //             message={ n.message }
    //             cancelable={ n.cancelable }
    //             actions={ n.actions }
    //             close={ close }
    //             />
    //     )
    // });
}

export default connect( 
    (state: State) => {
        return {
            notifications: state.notifications
        };
    },
    (dispatch: Dispatch) => {
        return { 
            close: bindActionCreators(NotificationActions.close, dispatch),
            expand: bindActionCreators(NotificationActions.expand, dispatch),
        };
    }
)(NotificationGroup);