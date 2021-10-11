import {BaseBusiness} from '../BaseBusiness'
import {DeviceRepository} from "./device.repository"
import {IDevice} from "./device.types";


class DeviceBusiness extends BaseBusiness<IDevice> {
    private _deviceRepository: DeviceRepository;

    constructor() {
        super(new DeviceRepository())
        this._deviceRepository = new DeviceRepository();
    }

    //@ts-expect-error
    async exportExcel(worksheet, header, data) {
        for (let index = 1; index <= header.length; index++) {
            worksheet.getColumn(index).width = 22
        }
        //console.log("-->",worksheet);

        const row = worksheet.getRow(1)
        // worksheet.getCell('A2').value = { formula: '=COUNT(' + `A3: A${(data.length + 1)}` + ')' }
        // worksheet.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
        // worksheet.getCell('F2').value = { formula: '=SUMPRODUCT((' + `F3: F${(data.length + 1)})*1` + ')' }
        // worksheet.getCell('F2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
        const table = worksheet.addTable({
            name: 'User',
            ref: 'A1',
            headerRow: { bold: true },
            totalsRow: false,
            style: {
                theme: "TableStyleMedium4",
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
                fgColor: { argb: '404040' },
                bgColor: { argb: '#00FFFF' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

        table.commit()
    }
}


Object.seal(DeviceBusiness);
export = DeviceBusiness;