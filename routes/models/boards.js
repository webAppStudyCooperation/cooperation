"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretNumber = exports.DateString = void 0;
class SecretNumber {
    constructor(secret) {
        this.valid = (0 <= secret && secret <= 1);
        this.value = secret;
    }
}
exports.SecretNumber = SecretNumber;
class DateString {
    constructor(str) {
        const regex = /\d\d-\d\d-\d\d/;
        this.valid = regex.test(str);
        this.date = str;
    }
}
exports.DateString = DateString;
