import {BaseBusiness} from '../BaseBusiness'
import {ActivityRepository} from "./activity.repository";
import {IActivity} from "./activity.types";


class ActivityBusiness extends BaseBusiness<IActivity>{
    private _activityRepository: ActivityRepository;

    constructor() {
        super(new ActivityRepository())
        this._activityRepository = new ActivityRepository();
    }

    //@ts-expect-error
    async exportExcel(worksheet, header, data) {
        let content = data.length
        
        for (const [index, element] of header.entries()) {      
            worksheet.getColumn(index+1).width = 22
            let valKey = await element.valKey.split(".");                    

            if (valKey[valKey.length - 1] === "drv" || valKey[valKey.length - 1] === "price") worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
            else if( valKey[valKey.length - 1] === "pwv" ) {
                let data = String.fromCharCode(65 + index)
                worksheet.getCell(`${data}2`).value = { formula: '=SUM(' + `${data}3: ${data}${content+2}` + ')' }
                worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
            }
            else if(valKey[valKey.length - 1] === "weight") {
                let data = String.fromCharCode(65 + index)                
                worksheet.getCell(`${data}2`).value = { formula: '=SUM(' + `${data}3: ${data}${content+2}` + ')' }
                worksheet.getColumn(index + 1).numFmt = '#0.00'
            }
            else if (valKey[valKey.length - 1] === 'iav') worksheet.getColumn(index + 1).numFmt = '##0.00000'

            // else if (valKey[valKey.length - 1] === 'status') {
            //     let data = String.fromCharCode(65 + index);
            //     console.log(`${data}3: ${data}${content+2}`);
                           
            //     worksheet.addConditionalFormatting({
            //         ref: "A3:A58",
            //         rules: [
            //             {
            //                 type: "containsText",
            //                 operator: "containsText",
            //                 text: "SOLD",
            //                 style: { fill: {type: 'pattern',pattern:'darkVertical',fgColor:{argb:'FFFF0000'} }},
            //             }
            //         ]
            //     })

            // }
        }    
        //console.log("-->",worksheet);

        const row = worksheet.getRow(1)
        // worksheet.getCell('A2').value = { formula: '=COUNT(' + `A3: A${(data.length + 1)}` + ')' }
        // worksheet.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
        // worksheet.getCell('F2').value = { formula: '=SUMPRODUCT((' + `F3: F${(data.length + 1)})*1` + ')' }
        // worksheet.getCell('F2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
        const table = worksheet.addTable({
            name: 'Activity',
            ref: 'A1',
            headerRow: { bold: true },
            totalsRow: false,
            style: {
                theme: "TableStyleMedium2",
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
                fgColor: { argb: '808080' },
                bgColor: { argb: '#00FFFF' }
                // fgColor: { argb: '#202020' },
                // bgColor: { argb: '#00FFFF' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

        table.commit()
    }

}


Object.seal(ActivityBusiness);
export = ActivityBusiness;