import {IAccess, IPermissionDefaultValues} from "./permission.types";
import {Constant, Messages, Texts} from "../../constants";
import {enumAlignment, IDefaultValues} from "../display-configuration/diaplay-configuration.types";


export class PermissionDefaultValues
{
    constructor(public roleName: string = ''){}   //Todo remove default value for roleName in constructor

    SpacecodeAdmin: IPermissionDefaultValues = {
        roleId: "", permission: [
            {screen: "InventoryAddInventory", access: [{key: IAccess.View, value: true}]},
            {screen: "InventoryInventories", access: [{key: IAccess.View, value: true},{key: IAccess.AddToCollateral, value: true},{key: IAccess.Edit4c, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "CollateralInventories", access: [{key: IAccess.View, value: true},{key: IAccess.RemoveFromCollateral, value: true},
                    {key: IAccess.UpdateStatus, value: true}, {key: IAccess.LightLed, value: true},{key: IAccess.DiamondMatch, value: true},
                    {key: IAccess.TransistRequest, value: true}, {key: IAccess.ExcelExport, value: true}, {key: IAccess.Edit4c, value: true}]
            },
            {screen: "AlertConfiguration", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true}, {key: IAccess.Delete, value: true}]},
            {screen: "Activity", access: [{key: IAccess.View, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "Sale", access: [{key: IAccess.View, value: true}]},
            {screen: "Remove", access: [{key: IAccess.View, value: true}]},
            {screen: "Consignment", access: [{key: IAccess.View, value: true}]},
            {screen: "ManageCompany", access: [{key: IAccess.View, value: true},{key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "ManageUser", access: [{key: IAccess.View, value: true},{key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "ManageDevices", access: [{key: IAccess.View, value: true},{key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "Business", access: [{key: IAccess.View, value: true},{key: IAccess.OpenBusiness, value: true},{key: IAccess.CloseBusiness, value: true}]},
            {screen: "SettingsDisplayConfig", access: [{key: IAccess.View, value: true}]},
            {screen: "DiamondMatchAction", access: [{key: IAccess.View, value: true},{key: IAccess.LightLed, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "DiamondMatchRules", access: [{key: IAccess.View, value: true},{key: IAccess.Add, value: true}]},
            {screen: "InventoryImportReview", access: [{key: IAccess.View, value: true}]},
            {screen: "InventoryInTransit", access: [{key: IAccess.View, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "Notifications", access: [{key: IAccess.View, value: true}]},
            {screen: "TransactionImport", access: [{key: IAccess.View, value: true}]},
            {screen: "TransactionImportReview", access: [{key: IAccess.View, value: true}]},
            {screen: "TransactionPriceIavUpdate", access: [{key: IAccess.View, value: true}]},
            {screen: "TransactionDiamondMatch", access: [{key: IAccess.View, value: true}]},
            {screen: "Reports", access: [{key: IAccess.View, value: true}]},
            {screen: "TransactionSale", access: [{key: IAccess.View, value: true}]},
            {screen: "TransactionConsignment", access: [{key: IAccess.View, value: true}]},
            {screen: "InventoryUnreferenced", access: [{key: IAccess.View, value: true}]},
            {screen: "InventoryIavUpdate", access: [{key: IAccess.View, value: true}]},
            {screen: "LedSelection", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "LogManagement", access: [{key: IAccess.View, value: true}]},
            {screen: "Setting", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "DisplayConfiguration", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "DeviceActivity", access: [{key: IAccess.View, value: true}]},
            {screen: "DiamondMatchRegistration", access: [{key: IAccess.View, value: true}]},
            {screen: "InventoryImportHistory", access: [{key: IAccess.View, value: true}]},
            {screen: "SettingDiamondMatch", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "SettingPermission", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "SettingConfiguration", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "LoanManagementSummary", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true},{key: IAccess.Add, value: true}]},
            {screen: "LoanManagementDetail", access: [{key: IAccess.View, value: true}]},
            {screen: "valuationPricingData", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}]},
            {screen: "valuationInfinityPricingMaster", access: [{key: IAccess.View, value: true},{key: IAccess.Add, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "Notifications", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "ValuationRapNetPricing", access: [{key: IAccess.View, value: true},{key: IAccess.Add, value: true}]},
            {screen: "masterCompanyType", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true}, {key: IAccess.Delete, value: true}]},
            {screen: "masterCompanySubType", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true}, {key: IAccess.Delete, value: true}]},
            {screen: "masterDeviceType", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true}, {key: IAccess.Delete, value: true}]},
            {screen: "masterRole", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true}, {key: IAccess.Delete, value: true}]},
            {screen: "DiamondMatchRegistrationFailure", access: [{key: IAccess.View, value: true}]}, 
            {screen: "AlertCategory", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true}, {key: IAccess.Delete, value: true}]}, 
            {screen: "AlertSubCategory", access: [{key: IAccess.View, value: true}, {key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true}, {key: IAccess.Delete, value: true}]},  
        ]
    }

    CompanyAdmin: IPermissionDefaultValues = {
        roleId: "",
        permission: [
            {screen: "InventoryAddInventory", access: [{key: IAccess.View, value: true}]},
            {screen: "Activity", access: [{key: IAccess.View, value: true},{key: IAccess.Status, value: true}, {key: IAccess.LightLed, value: true}, {key: IAccess.ExcelExport, value: true}]},
            {screen: "InventoryInventories", access: [{key: IAccess.View, value: true},{key: IAccess.AddToCollateral, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "CollateralInventories", access: [{key: IAccess.View, value: true},{key: IAccess.RemoveFromCollateral, value: true},{key: IAccess.UpdateStatus, value: true},
                    {key: IAccess.LightLed, value: true},{key: IAccess.DiamondMatch, value: true},{key: IAccess.TransistRequest, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "Sale", access: [{key: IAccess.View, value: true}]},
            {screen: "Remove", access: [{key: IAccess.View, value: true}]},
            {screen: "Consignment", access: [{key: IAccess.View, value: true}]},
            {screen: "InventoryImportReview", access: [{key: IAccess.View, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "InventoryInTransit", access: [{key: IAccess.View, value: true},{key: IAccess.ExcelExport, value: true}]},
           /* {screen: "InventoryReferenced", access: [{key: IAccess.ExcelExport, value: true}]},*/
            {screen: "DiamondMatchAction", access: [{key: IAccess.View, value: true},{key: IAccess.LightLed, value: true},{key: IAccess.ExcelExport, value: true}]},
            {screen: "ManageUser", access: [{key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "ManageCompany", access: [{key: IAccess.Edit, value: true}]},
            {screen: "ManageDevices", access: [{key: IAccess.Add, value: true}, {key: IAccess.Edit, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "Business", access: [{key: IAccess.View, value: true},{key: IAccess.OpenBusiness, value: true},{key: IAccess.CloseBusiness, value: true}]},
            {screen: "Notifications", access: [{key: IAccess.View, value: true}]},
            {screen: "LedSelection", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true},{key: IAccess.Delete, value: true}]},
            {screen: "DeviceActivity", access: [{key: IAccess.View, value: false}]},
            {screen: "DiamondMatchRegistration", access: [{key: IAccess.View, value: true}]},
            {screen: "Reports", access: [{key: IAccess.View, value: true}]},
            {screen: "InventoryImportHistory", access: [{key: IAccess.View, value: true}]},
            //{screen: "SettingDiamondMatch", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "DisplayConfiguration", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "SettingPermission", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]},
            {screen: "Notifications", access: [{key: IAccess.View, value: true},{key: IAccess.Edit, value: true}]}
        ]
    }


    async getDefaultValues(): Promise<any> {
        const { SpacecodeAdmin, CompanyAdmin, roleName} = this;

        if(roleName === Texts.SPACECODEADMIN) return  SpacecodeAdmin
        else if(roleName === Texts.COMPANYADMIN) return  CompanyAdmin;
        else return {};
    }
}
