"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enum = void 0;
class Enum {
    constructor() {
        this.dmStatus = {
            MATCHED: 'MATCHED',
            NOTMATCHED: 'NOTMATCHED'
        };
    }
}
exports.Enum = Enum;
Enum.stoneStatus = {
    ARRIVAL: 'ARRIVAL',
    TRANSIT: 'TRANSIT',
    CONSIGNMENT: 'CONSIGNMENT',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    MISSING: 'MISSING',
    SOLD: 'SOLD',
    REMOVED: 'REMOVED'
};
Enum.rfidStatus = {
    IN: 'IN',
    OUT: 'OUT',
    INSTOCK: 'INSTOCK'
};
Enum.collateralStatus = {
    COLLATERAL_IN: 'COLLATERAL IN',
    COLLATERAL_OUT: 'COLLATERAL OUT'
};
//# sourceMappingURL=Enum.js.map