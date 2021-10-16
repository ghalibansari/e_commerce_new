"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regex = void 0;
class Regex {
}
exports.Regex = Regex;
Regex.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
Regex.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
Regex.mongoObjectId = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
Regex.phoneNumberCode = /^\+(?:[0-9] ?){1,5}$/;
Regex.scheduleTime = /^(([01]?[0-9]|2[0-3]):[0-5][0-9])$/;
//# sourceMappingURL=Regex.js.map