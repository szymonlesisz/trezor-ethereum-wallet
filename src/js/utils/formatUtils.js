/* @flow */
'use strict';

let currencyUnits: string = 'mbtc2';

// TODO: chagne currency units

export const formatAmount = (n: number, coinInfo: any): string => {
    let amount = (n / 1e8);
    if (coinInfo.isBitcoin && currencyUnits === 'mbtc' && amount <= 0.1 && n !== 0) {
        let s = (n / 1e5).toString();
        return `${s} mBTC`;
    }
    let s = amount.toString();
    return `${s} ${coinInfo.shortcut}`;
}

export const formatTime = (n: number): string => {
    let hours = Math.floor(n / 60);
    let minutes = n % 60;

    if (!n) return 'No time estimate';
    let res = '';
    if (hours != 0) {
        res += hours + ' hour';
        if (hours > 1) {
            res += 's';
        }
        res += ' ';
    }
    if (minutes != 0) {
        res += minutes + ' minutes';
    }
    return res;
}

export const btckb2satoshib = (n: number): number => {
    return Math.round(n * 1e5);
}

export const stringToHex = (str: string): string => {
    let result: string = '';
    let hex: string;
    for (let i = 0; i < str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ('000' + hex).slice(-4);
    }
    return result;
}

export const hexToString = (hex: string): string => {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
} 
