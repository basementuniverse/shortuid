"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const defaultOptions = {
    prime: '6345796823',
    base: '10212011',
    inverse: '3736125',
    mixer: '28737113',
    alpha: '568vhgxrwkfjyn9d3pc2mqbaz74set',
};
class Shortuid {
    static encode(i, options = defaultOptions) {
        const internalOptions = this.parseOptions(options);
        return this.encode2(this.encode1(i, internalOptions), internalOptions);
    }
    static decode(id, options = defaultOptions) {
        const internalOptions = this.parseOptions(options);
        return this.decode2(this.decode1(id, internalOptions), internalOptions);
    }
    static parseOptions(options) {
        return {
            prime: new bignumber_js_1.default(options.prime),
            base: new bignumber_js_1.default(options.base),
            inverse: new bignumber_js_1.default(options.inverse),
            mixer: new bignumber_js_1.default(options.mixer),
            alpha: options.alpha,
            alphaBase: new bignumber_js_1.default(options.alpha.length),
        };
    }
    static encode1(i, options) {
        return options.prime
            .multipliedBy(i)
            .plus(options.mixer)
            .modulo(options.base);
    }
    static encode2(i, options) {
        let result = '';
        while (i.isGreaterThan(0)) {
            const remainder = i.modulo(options.alphaBase);
            i = i.minus(remainder).dividedBy(options.alphaBase);
            result += options.alpha[remainder.toNumber()];
        }
        return result;
    }
    static decode1(id, options) {
        let result = new bignumber_js_1.default(0);
        for (let i = id.length; i--;) {
            result = result
                .plus(new bignumber_js_1.default(options.alpha.indexOf(id[i]))
                .multipliedBy(options.alphaBase.exponentiatedBy(i)));
        }
        return result;
    }
    static decode2(i, options) {
        return i
            .minus(options.mixer)
            .multipliedBy(options.inverse)
            .modulo(options.base)
            .plus(options.base)
            .toNumber();
    }
}
exports.default = Shortuid;
