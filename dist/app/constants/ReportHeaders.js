"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderData = void 0;
class HeaderData {
}
exports.HeaderData = HeaderData;
HeaderData.Diamond_match_header = [
    { name: "Match date", filterButton: true }, { name: "Ref #", filterButton: true }, { name: "Report Lab", filterButton: true }, { name: "Report Number", filterButton: true }, { name: "Carat Weight", filterButton: true },
    { name: "Shape", filterButton: true }, { name: "Color Category", filterButton: true }, { name: "Color Sub-Category", filterButton: true }, { name: "Grading Report Color", filterButton: true },
    { name: "Clarity", filterButton: true }, { name: "Cut", filterButton: true }, { name: "Value", filterButton: true }, { name: "Type of Diamond Match requested", filterButton: true }, { name: "Action", filterButton: true },
    { name: "Success", filterButton: true }, { name: "Message", filterButton: true }, { name: "Match Location", filterButton: true }
];
HeaderData.Daily_match_header = [
    { name: "Ref #", filterButton: true }, { name: "Company", filterButton: true }, { name: "Action", filterButton: true }, { name: "Action date", filterButton: true }, { name: "Success", filterButton: true },
    { name: "Asset type", filterButton: true }, { name: "Group date", filterButton: true }, { name: "Report Lab", filterButton: true }, { name: "Report Number", filterButton: true }, { name: "Carat weight", filterButton: true },
    { name: "Shape", filterButton: true }, { name: "Color Sub-Category", filterButton: true }, { name: "Color Category", filterButton: true }, { name: "Grading Color", filterButton: true }, { name: "Grading Shape", filterButton: true },
    { name: "Clarity", filterButton: true }, { name: "Cut", filterButton: true }, { name: "Value", filterButton: true }, { name: "Completion", filterButton: true }
];
HeaderData.Transporter_storage_header = [
    { name: 'Ref #', filterButton: true }, { name: 'Transit ID', filterButton: true }, { name: 'Tag ID', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true },
    { name: 'Carat Weight', filterButton: true }, { name: 'Shape', filterButton: true }, { name: 'Color', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'Value', filterButton: true }, { name: 'Dismissed', filterButton: true }, { name: 'Stages', filterButton: true },
    { name: 'Non match stages', filterButton: true }, { name: 'Return date', filterButton: true }
];
HeaderData.Collateral_accounted_header = [
    { name: 'Status', filterButton: true }, { name: 'Date', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true },
    { name: 'Carat Weight', filterButton: true }, { name: 'Shape', filterButton: true }, { name: 'Color Sub-Category', filterButton: true }, { name: 'Color Category', filterButton: true },
    { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
    { name: 'PWV', filterButton: true }, { name: 'IAV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }
];
HeaderData.Collateral_at_inception_header = [
    { name: 'Company', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true }, { name: 'Shape', filterButton: true },
    { name: 'Color Sub-Category', filterButton: true }, { name: 'Carat Weight', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
    { name: 'IAV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }, { name: 'PWV', filterButton: true }
];
HeaderData.Collateral_sold_header = [
    { name: 'Company', filterButton: true }, { name: 'Date', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true }, { name: 'Shape', filterButton: true }, { name: 'Carat Weight', filterButton: true },
    { name: 'Color Sub-Category', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
    { name: 'IAV', filterButton: true }, { name: 'PWV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }
];
HeaderData.Collateral_added_header = [
    { name: "Action", filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Date', filterButton: true }, { name: 'Ref #', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number' }, { name: 'Carat Weight', filterButton: true }, { name: 'Shape', filterButton: true },
    { name: 'Color Sub-Category', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape' }, { name: 'Clarity' }, { name: 'Cut', filterButton: true }, { name: 'V/C', filterButton: true }, { name: 'DRV', filterButton: true },
    { name: 'PWV', filterButton: true }, { name: 'IAV', filterButton: true }, { name: 'Last DiamondMatch', filterButton: true }
];
HeaderData.sinceInception_header = [{ name: "Collateral accounted", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Calculated Collateral', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: '%', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Unaccounted', style: { font: { bold: true, color: { argb: 'FF3333' } }, alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } }, { name: 'Status', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];
HeaderData.dailyMatch_header = [{ name: "Stones requested", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Positive match', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: 'Non-match', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Stones not tested', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Matched stones', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Status', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];
HeaderData.malcaStorage_header = [{ name: "Stones requested", style: { font: { bold: true } } }, { name: 'Positive Match Malca', style: { font: { bold: true } } },
    { name: 'Positive match Borrower', style: { font: { bold: true } } }, { name: 'Non-match', style: { font: { bold: true } } }, { name: 'Stones not tested', style: { font: { bold: true } } }, { name: 'Matched stones', style: { font: { bold: true } } }, { name: 'Status', style: { font: { bold: true } } }];
HeaderData.sinceInception_header2 = [{ name: "Collateral at inception", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Sold', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: 'Added', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Calculated Collateral', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Removed', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];
HeaderData.sinceInception_header3 = [{ name: "Previous Day Collateral", style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Sold', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } },
    { name: 'Added', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }, { name: 'Calculated Collateral', style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, font: { bold: true } } }];
HeaderData.transImport_header = [{ name: 'Ref #', filterButton: true }, { name: 'Stone Status', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true }, { name: 'Collateral Status', filterButton: true }, { name: 'Gemologist Status', filterButton: true }, { name: 'Shape', filterButton: true },
    { name: 'Color Sub-Category', filterButton: true }, { name: 'Carat Weight', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'DRV', filterButton: true },
    { name: 'IAV', filterButton: true }, { name: 'PWV', filterButton: true }];
//# sourceMappingURL=ReportHeaders.js.map