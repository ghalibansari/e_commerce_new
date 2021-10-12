import {BaseBusiness} from '../BaseBusiness'
import {IActivityHistory} from "./activity-history.types";
import {ActivityHistoryRepository} from "./activity-history.repository";


class ActivityHistoryBusiness extends BaseBusiness<IActivityHistory>{
    private _activityRepository: ActivityHistoryRepository;

    constructor() {
        super(new ActivityHistoryRepository())
        this._activityRepository = new ActivityHistoryRepository();
    }

    // //@ts-expect-error
    // async exportExcel(worksheet, header, data) {
    //     for (let index = 1; index <= header.length; index++) {
    //         worksheet.getColumn(index).width = 15
    //     }
    //     //console.log("-->",worksheet);
    //
    //     const row = worksheet.getRow(1)
    //
    //     const table = worksheet.addTable({
    //         name: 'Activity',
    //         ref: 'A1',
    //         headerRow: { bold: true },
    //         totalsRow: false,
    //         style: {
    //             theme: "TableStyleLight8",
    //             showRowStripes: false,
    //         },
    //         columns: header,
    //         rows: data
    //     });
    //     //console.log("-=>",table);
    //     //@ts-expect-error
    //     row.eachCell((cell, number) => {
    //
    //         cell.fill = {
    //             type: 'pattern',
    //             pattern: 'solid',
    //             font: { bold: true },
    //             fgColor: { argb: '#202020' },
    //             bgColor: { argb: '#00FFFF' }
    //         }
    //         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    //     })
    //
    //     table.commit()
    // }

}


Object.seal(ActivityHistoryBusiness);
export = ActivityHistoryBusiness;