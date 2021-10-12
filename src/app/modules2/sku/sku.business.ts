import {BaseBusiness} from '../BaseBusiness'
import {SkuRepository} from "./sku.repository";
import {ISku} from "./sku.types";


class SkuBusiness extends BaseBusiness<ISku>{
    private _skuRepository: SkuRepository;

    constructor() {
        super(new SkuRepository())
        this._skuRepository = new SkuRepository();
    }

     //@ts-expect-error
     async createTable(worksheet, header, data) {
        for (let index = 1; index <= header.length; index++) {
            worksheet.getColumn(index).width = 22
        }
        // for (const [index, element] of header.entries()) {      
        //     worksheet.getColumn(index+1).width = 18
        //     let valKey: any = {}
        //     if(element.valKey ) valKey = await element.valKey.split(".");

        //     if (valKey[valKey.length - 1] === "drv" || valKey[valKey.length - 1] === "pwvImport", valKey[valKey.length - 1] === "price") worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
        //     else if( valKey[valKey.length - 1] === "pwv" ) worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
        //     else if(valKey[valKey.length - 1] === "weight") worksheet.getColumn(index + 1).numFmt = '#0.00'
        //     else if (valKey[valKey.length - 1] === 'iav') worksheet.getColumn(index + 1).numFmt = '##0.00000'
        // } 
         let row = worksheet.getRow(1)
         const table = worksheet.addTable({
            name: 'Sku export',
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


Object.seal(SkuBusiness);
export = SkuBusiness;