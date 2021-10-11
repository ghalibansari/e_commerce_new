import {BaseBusiness} from '../BaseBusiness'
import { IRapNetPrice } from './rap-net-price.types';
import { RapNetPriceRepository } from './rap-net-price.repository';


class RapNetPriceBusiness extends BaseBusiness<IRapNetPrice> {
    private _rapNetPriceRepository: RapNetPriceRepository;

    constructor() {
        super(new RapNetPriceRepository())
        this._rapNetPriceRepository = new RapNetPriceRepository();
    }

    async createTableData(worksheet: any, header: any, data: any) {
        for (let index = 1; index <= header.length; index++) {
            worksheet.getColumn(index).width = 18
        }
        let row = worksheet.getRow(1)
        const table = worksheet.addTable({
            name: 'rapNetTable Import',
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


Object.seal(RapNetPriceBusiness);
export = RapNetPriceBusiness;