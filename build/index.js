"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const bignumber_js_1 = require("bignumber.js");
const dotenv = require("dotenv-flow");
dotenv.config();
const getEnv = (k) => {
    if (k in process.env) {
        return process.env[k];
    }
    throw new Error(`.env variable ${k} not found`);
};
const prime = new bignumber_js_1.default(getEnv('PRIME'));
const base = new bignumber_js_1.default(getEnv('BASE'));
const inverse = new bignumber_js_1.default(getEnv('INVERSE'));
const mixer = new bignumber_js_1.default(getEnv('MIXER'));
const alpha = getEnv('ALPHA');
const alphaBase = new bignumber_js_1.default(alpha.length);
function encode(i) {
    return encode2(encode1(i));
}
exports.encode = encode;
function decode(id) {
    return decode2(decode1(id));
}
exports.decode = decode;
function encode1(i) {
    return prime.multipliedBy(i).plus(mixer).modulo(base);
}
function encode2(i) {
    let result = '';
    while (i.isGreaterThan(0)) {
        const remainder = i.modulo(alphaBase);
        i = i.minus(remainder).dividedBy(alphaBase);
        result += alpha[remainder.toNumber()];
    }
    return result;
}
function decode1(id) {
    let result = new bignumber_js_1.default(0);
    for (let i = id.length; i--;) {
        result = result.plus(new bignumber_js_1.default(alpha.indexOf(id[i])).multipliedBy(alphaBase.exponentiatedBy(i)));
    }
    return result;
}
function decode2(i) {
    return i.minus(mixer).multipliedBy(inverse).modulo(base).plus(base).toNumber();
}
