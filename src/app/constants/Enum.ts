export class Enum {

    static stoneStatus = {
        ARRIVAL: 'ARRIVAL',
        TRANSIT: 'TRANSIT',
        CONSIGNMENT: 'CONSIGNMENT',
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED',
        MISSING: 'MISSING',
        SOLD: 'SOLD',
        REMOVED: 'REMOVED'
    };

    static rfidStatus = {
        IN: 'IN',
        OUT: 'OUT',
        INSTOCK: 'INSTOCK'
    };

    static collateralStatus = {
        COLLATERAL_IN: 'COLLATERAL IN',
        COLLATERAL_OUT: 'COLLATERAL OUT'
    };

    dmStatus = {
        MATCHED: 'MATCHED',
        NOTMATCHED: 'NOTMATCHED'
    }

}