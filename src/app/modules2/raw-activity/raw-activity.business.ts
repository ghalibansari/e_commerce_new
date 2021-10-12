import {BaseBusiness} from '../BaseBusiness'
import {RawActivityRepository} from "./raw-activity.repository"
import { IRawActivity } from './raw-activity.types'

class RawActivityBusiness extends BaseBusiness<IRawActivity>{
    private _rawactivityRepository: RawActivityRepository

    constructor() {
        super(new RawActivityRepository())
        this._rawactivityRepository = new RawActivityRepository()
    }

        //@ts-expect-error
        async createTable(worksheet, header, data) {
            for (let index = 1; index <= header.length; index++) {
                worksheet.getColumn(index).width = 22
            }
            // worksheet.getColumn(12).numFmt='"$"#,##0.00'
            let row = worksheet.getRow(1)
            const table = worksheet.addTable({
                name: 'Device-activity export',
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
            //@ts-expect-error
            row.eachCell((cell, number) => {
    
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    font: { bold: true },
                    fgColor: { argb: '808080' },
                    bgColor: { argb: '#00FFFF' }
                }
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            })
    
            table.commit()
        }
}


Object.seal(RawActivityBusiness)
export = RawActivityBusiness