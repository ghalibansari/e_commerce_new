// Summary-Report Headers,Excel export  style: { font: { bold:true } }
export class HeaderData {
    static readonly Diamond_match_header: object[] = [
        { name: "Match date", filterButton: true }, { name: "Ref #", filterButton: true }, { name: "Report Lab", filterButton: true }, { name: "Report Number", filterButton: true }, { name: "Carat Weight", filterButton: true },
        { name: "Shape", filterButton: true }, { name: "Color Category", filterButton: true }, { name: "Color Sub-Category", filterButton: true }, { name: "Grading Report Color", filterButton: true },
        { name: "Clarity", filterButton: true }, { name: "Cut", filterButton: true }, { name: "Value", filterButton: true }, { name: "Type of Diamond Match requested", filterButton: true }, { name: "Action", filterButton: true },
        { name: "Success", filterButton: true }, { name: "Message", filterButton: true }, { name: "Match Location", filterButton: true }
    ];
    static readonly Daily_match_header: object[] = [
        { name: "Ref #", filterButton: true }, { name: "Company", filterButton: true }, { name: "Action", filterButton: true }, { name: "Action date", filterButton: true }, { name: "Success", filterButton: true },
        { name: "Asset type", filterButton: true }, { name: "Group date", filterButton: true }, { name: "Report Lab", filterButton: true }, { name: "Report Number", filterButton: true }, { name: "Carat weight", filterButton: true },
        { name: "Shape", filterButton: true }, { name: "Color Sub-Category", filterButton: true }, { name: "Color Category", filterButton: true }, { name: "Grading Color", filterButton: true }, { name: "Grading Shape", filterButton: true },
        { name: "Clarity", filterButton: true }, { name: "Cut", filterButton: true }, { name: "Value", filterButton: true }, { name: "Completion", filterButton: true }
    ];
    static readonly Transporter_storage_header: object[] = [
        { name: 'Ref #', filterButton: true }, { name: 'Transit ID', filterButton: true }, { name: 'Tag ID', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true },
        { name: 'Carat Weight', filterButton: true }, { name: 'Shape', filterButton: true }, { name: 'Color', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'Value', filterButton: true }, { name: 'Dismissed', filterButton: true }, { name: 'Stages', filterButton: true },
        { name: 'Non match stages', filterButton: true }, { name: 'Return date', filterButton: true }
    ];
    static readonly Collateral_accounted_header: object[] = [
        { name: 'Status', filterButton: true }, { name: 'Date', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true },
        { name: 'Carat Weight', filterButton: true }, { name: 'Shape', filterButton: true }, { name: 'Color Sub-Category', filterButton: true }, { name: 'Color Category', filterButton: true },
        { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
        { name: 'PWV', filterButton: true }, { name: 'IAV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }
    ];
    static readonly Collateral_at_inception_header: object[] = [
        { name: 'Company', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true }, { name: 'Shape', filterButton: true },
        { name: 'Color Sub-Category', filterButton: true }, { name: 'Carat Weight', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
        { name: 'IAV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }, { name: 'PWV', filterButton: true }
    ];
    static readonly Collateral_sold_header: object[] = [
        { name: 'Company', filterButton: true }, { name: 'Date', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true }, { name: 'Shape', filterButton: true }, { name: 'Carat Weight', filterButton: true },
        { name: 'Color Sub-Category', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
        { name: 'IAV', filterButton: true }, { name: 'PWV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }
    ];
    static readonly Collateral_added_header: object[] = [
        { name: "Action", filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Date', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number' }, { name: 'Carat Weight', filterButton: true }, { name: 'Shape', filterButton: true },
        { name: 'Color Sub-Category', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape' }, { name: 'Clarity' }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
        { name: 'PWV', filterButton: true }, { name: 'IAV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }
    ];

    static readonly sinceInception_header: object[] = [{ name: "Collateral accounted", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Calculated Collateral', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: '%', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Unaccounted', style: { font: { bold: true, color: { argb: 'FF3333' } }, alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } }, { name: 'Status', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];

    static readonly dailyMatch_header: object[] = [{ name: "Stones requested", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Positive match', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: 'Non-match', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Stones not tested', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Matched stones', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Status', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];

    static readonly malcaStorage_header: object[] = [{ name: "Stones requested", style: { font: { bold: true } } }, { name: 'Positive Match Malca', style: { font: { bold: true } } },
    { name: 'Positive match Borrower', style: { font: { bold: true } } }, { name: 'Non-match', style: { font: { bold: true } } }, { name: 'Stones not tested', style: { font: { bold: true } } }, { name: 'Matched stones', style: { font: { bold: true } } }, { name: 'Status', style: { font: { bold: true } } }]

    static readonly sinceInception_header2: object[] = [{ name: "Collateral at inception", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Sold', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: 'Added', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Calculated Collateral', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Removed', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];

    static readonly sinceInception_header3: object[] = [{ name: "Previous Day Collateral", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Sold', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: 'Added', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Calculated Collateral', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];

    //Transaction-Import headers for Excel-Export
    static readonly transImport_header: object[] = [{ name: 'Ref #', filterButton: true }, { name: 'Stone Status', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true }, { name: 'Collateral Status', filterButton: true }, { name: 'Gemologist Status', filterButton: true }, { name: 'Shape', filterButton: true },
    { name: 'Color Sub-Category', filterButton: true }, { name: 'Carat Weight', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'DRV', filterButton: true },
    { name: 'IAV', filterButton: true }, { name: 'PWV', filterButton: true }]
}