import {BaseBusiness} from '../BaseBusiness'
import {DiamondMatchRepository} from "./diamond-match.repository";


class DiamondMatchBusiness extends BaseBusiness<any> {
    private _diamondMatchRepository: DiamondMatchRepository;

    constructor() {
        super(new DiamondMatchRepository())
        this._diamondMatchRepository = new DiamondMatchRepository();
    }

    static async diamondMatchS(data: any):Promise<void|any> {  //Todo remove any type
        // await super.findBB()
        console.log("in repo")
        let match // do diamond match here.
        //await new NotificationRepository().createBR({})  //  create alert to the users
        return {"df": "hello"};
    }

    //@ts-expect-error
    async createTable(worksheet, header, data) {
        for (const [index, element] of header.entries()) {      
            worksheet.getColumn(index+1).width = 18
            let valKey = await element.valKey.split(".");       

            if (valKey[valKey.length - 1] === "drv" || valKey[valKey.length - 1] === "price") worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
            else if( valKey[valKey.length - 1] === "pwv" ) worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
            else if(valKey[valKey.length - 1] === "weight") worksheet.getColumn(index + 1).numFmt = '#0.00'
            else if (valKey[valKey.length - 1] === 'iav') worksheet.getColumn(index + 1).numFmt = '##0.00000'
        } 
        // worksheet.getColumn(12).numFmt='"$"#,##0.00'
        let row = worksheet.getRow(1)
        const table = worksheet.addTable({
            name: 'DM export',
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


Object.seal(DiamondMatchBusiness);
export = DiamondMatchBusiness;