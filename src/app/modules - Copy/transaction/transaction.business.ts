import {BaseBusiness} from "../BaseBusiness";
import { TransactionRepository } from "./transaction.repository";
import { ITransaction } from "./transaction.types";

class TransactionBusiness extends BaseBusiness<ITransaction> {
    private _transactionRepository: TransactionRepository;

    constructor() {
        super(new TransactionRepository())
        this._transactionRepository = new TransactionRepository()
    }

        //@ts-expect-error
        async createTable(worksheet, header, data) {
            for (let index = 1; index <= header.length; index++) {
                worksheet.getColumn(index).width = 15
            }
            //console.log("-->",worksheet);
    
            const row = worksheet.getRow(1)
    
            const table = worksheet.addTable({
                name: 'Activity',
                ref: 'A1',
                headerRow: { bold: true },
                totalsRow: false,
                style: {
                    theme: "TableStyleLight8",
                    showRowStripes: false,
                },
                columns: header,
                rows: data
            });
            //console.log("-=>",table);
            //@ts-expect-error
            row.eachCell((cell, number) => {
    
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    font: { bold: true },
                    fgColor: { argb: '#202020' },
                    bgColor: { argb: '#00FFFF' }
                }
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            })
    
            table.commit()
        }
}

Object.seal(TransactionBusiness)
export = TransactionBusiness