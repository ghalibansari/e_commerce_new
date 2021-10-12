import {enumAlignment, IDefaultValues} from "./diaplay-configuration.types";

export class defaultColumnList {
    constructor(public modelName: string){}

    InventoryInventories: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "dmStatus", text: "DM Registration Status", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneRegistration", text: "Diamond Registration Required", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "pwvImport", text: "PWV Import", align: enumAlignment.right, sequence: 15, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Infinity Price", align: enumAlignment.right, sequence: 16, preFix: "$", postFix: "", isActive:false, isDeleted:false},
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 17, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 18, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 19, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 23, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "deviceId.name", text: "Device", align: enumAlignment.left, sequence: 25, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rfIdStatus", text: "Rfid Status", align: enumAlignment.left, sequence: 26, preFix: "", postFix: "", isActive:true, isDeleted:false},

    ];

    InventorySold: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "dmStatus", text: "DM Registration Status", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneRegistration", text: "Diamond Registration Required", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "pwvImport", text: "PWV Import", align: enumAlignment.right, sequence: 15, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Infinity Price", align: enumAlignment.right, sequence: 16, preFix: "$", postFix: "", isActive:false, isDeleted:false},
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 17, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 18, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 19, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 23, preFix: "", postFix: "", isActive:true, isDeleted:false},
        // {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedBy.firstName", text: "Sold By", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Sold Date", align: enumAlignment.left, sequence: 25, preFix: "", postFix: "", isActive:true, isDeleted:false},

    ]

    InventoryRemoved: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "dmStatus", text: "DM Registration Status", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneRegistration", text: "Diamond Registration Required", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "pwvImport", text: "PWV Import", align: enumAlignment.right, sequence: 15, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        /*{valKey: "iavId.clientPriceId.price", text: "Infinity Price", align: enumAlignment.left, sequence: 16, preFix: "$", postFix: "", isActive:false, isDeleted:false},*/
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 17, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 18, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 19, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 23, preFix: "", postFix: "", isActive:true, isDeleted:false},
        // {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedBy.firstName", text: "Removed By", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Removed Date", align: enumAlignment.left, sequence: 25, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ]

    InventoryConsignment: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "dmStatus", text: "DM Registration Status", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneRegistration", text: "Diamond Registration Required", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "pwvImport", text: "PWV Import", align: enumAlignment.right, sequence: 15, preFix: "$", postFix: "", isActive:true, isDeleted:false},
      /*  {valKey: "iavId.clientPriceId.price", text: "Infinity Price", align: enumAlignment.left, sequence: 16, preFix: "$", postFix: "", isActive:false, isDeleted:false},*/
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 17, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 18, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 19, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 23, preFix: "", postFix: "", isActive:true, isDeleted:false},
        // {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedBy.firstName", text: "Consignment By", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Consignment Date", align: enumAlignment.left, sequence: 25, preFix: "", postFix: "", isActive:true, isDeleted:false},

    ]

    Activity: IDefaultValues[] = [
        {valKey: "companyId.addressId", text: "SkuId", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.weight", text: "Weight", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "skuId.shape", text: "Shape", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.colorCategory", text: "Color", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.clarity", text: "Clarity", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
    /*    {valKey: "TBD", text: "Cut", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
    */    {valKey: "skuId.clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 9, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 10, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 11, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 12, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "dmId.createdAt", text: "Last Diamond Match", align: enumAlignment.left, sequence: 14, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "dmId.status", text: "Diamond Match", align: enumAlignment.left, sequence: 15, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.rfId.rfid", text: "RFID", align: enumAlignment.left, sequence: 16, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Report Type", align: enumAlignment.left, sequence: 17, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Report Number", align: enumAlignment.left, sequence: 18, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 19, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:false, isDeleted:false},
        // {valKey: "skuId.deviceId.name", text: "Device", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.deviceId.name", text: "Device", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];

    ManageCompany: IDefaultValues[] = [
        {valKey: "name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "addressId.country", text: "Country", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "addressId.city", text: "City", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "contacts.name", text: "Contact Person", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "contacts.number", text: "Contact Number", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "contacts.jobDescription", text: "Job Description", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "contacts.email", text: "Email", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyTypeId.shortDescription", text: "Company Type", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "parentId.name", text: "Parent Company", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "isActive", text: "Status", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 13, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];

    ManageUser: IDefaultValues[] = [
        {valKey: "firstName", text: "First Name", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "lastName", text: "Last Name", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "email", text: "Email", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "roleId.shortDescription", text: "User Type", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "Company Name", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "lastLogin", text: "Last Login", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false}

    ];

    ManageDevices: IDefaultValues[] = [
        {valKey: "serialNumber", text: "Serial No", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "name", text: "Name", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "deviceTypeId.code", text: "Device Code", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "description", text: "Description", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false}

    ];

    Business: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        // {valKey: "updatedAt", text: "Last Open Date", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "lastOpenedAt", text: "Last Open At", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "lastClosedBy.firstName", text: "Last Close By", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "lastClosedAt", text: "Last Close At", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "lastOpenedBy.firstName", text: "Last Open By", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "openColleteralCount", text: "Open Collateral Count", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "openMissingCount", text: "Open Missing Count", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "openSoldCount", text: "Open Sold Count", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "closeColleteralCount", text: "Close Collateral Count", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "closeMissingCount", text: "Close Missing Count", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "closeSoldCount", text: "Close Sold Count", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:false, isDeleted:false},
    ];

    SettingsDisplayConfig: IDefaultValues[] = [
        {valKey: "config.valkey", text: "DB Field", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "screen", text: "Display", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "config.align", text: "Alignment", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "config.preFix", text: "PreFix", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "config.postFix", text: "PostFix", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "config.isActive", text: "Status", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];

    DiamondMatchAction: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.rfId.rfid", text: "Tag#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.weight", text: "Weight", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 6, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "skuId.iavId.clientPriceId.price", text: "Client Price", align: enumAlignment.right, sequence: 7, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 8, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 9, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.labsId.lab", text: "LAB", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "skuId.labsId.labReportId", text: "Lab ID", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 13, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];

    DiamondMatchRules: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.contacts.name", text: "Name", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.contacts.jobDescription", text: "JobDescription", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.contacts.email", text: "email", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.contacts.number", text: "number", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "param.regularCycle", text: "Regular Cycle Duration (in days)", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "param.premiumCycle", text: "PremiumCycle Duration (in days)", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "param.premiumPercent", text: "Premium %", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "param.randomPercent", text: "Random %", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "param.threshold", text: "Threshold (in Stones)", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "effectiveDate", text: "Effective Date", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 13, preFix: "", postFix: "", isActive:true, isDeleted:false}

    ];

    DiamondMatchRegistration: IDefaultValues[] = [
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive: false, isDeleted: false},
        {valKey: "dmGuid", text: "DM GUID", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive: false, isDeleted: false},
        {valKey: "stoneRegistration", text: "DM Registration Required", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 12, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 15, preFix: "", postFix: "%", isActive: true, isDeleted: false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 16, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 17, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 18, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 19, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive: false, isDeleted: false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 13, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];



    InventoryImportReview: IDefaultValues[] = [
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive: false, isDeleted: false},
        {valKey: "dmStatus", text: "DM Registration Status", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "stoneRegistration", text: "DM Registration Required", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 12, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "pwvImport", text: "PWV Import", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 16, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 17, preFix: "", postFix: "%", isActive: true, isDeleted: false},
        {valKey: "variation1", text: "Variation1", align: enumAlignment.left, sequence: 18, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "finalVariation", text: "Final Variation", align: enumAlignment.left, sequence: 19, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 20, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 23, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "skuInfinityPriceId.price", text: "Infinity Price", align: enumAlignment.right, sequence: 17, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "comments", text: "Comments", align: enumAlignment.left, sequence: 25, preFix: "", postFix: "", isActive:true, isDeleted:false},

    ];



    InventoryInTransit: IDefaultValues[] = [
        {valKey: "transitTime", text: "Transist Date", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "returnTime", text: "Return Date", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
      /*  {valKey: "isSchedule", text: "Scheduled", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false}, */
        {valKey: "comments", text: "Comments", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];

    Notifications: IDefaultValues[] = [
        {valKey: "status", text: "", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "userId.firstName + userId.lastName", text: "", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "message", text: "", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];

    TransactionImport: IDefaultValues[] = [
        {valKey: "transactionId", text: "Voucher#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "fileName", text: "Filename", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "totalStones", text: "Total", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "importedStones", text: "Imported", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "notImportedStones", text: "Not Imported", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "pendingReviewStones", text: "Pending Review", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rejectedStones", text: "Rejected", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "priceChangedStones", text: "Price Changed", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneRegistration", text: "Pending DmRegistration", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},       
        {valKey: "readyCollateralStones", text: "Ready to be Collateral", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "collateralStones", text: "Colleteral In", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Imported By", align: enumAlignment.left, sequence: 13, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date", align: enumAlignment.left, sequence: 14, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 15, preFix: "", postFix: "", isActive:false, isDeleted:false},
      /*  {valKey: "rapaportDate", text: "Rapaport Value Date", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},*/
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence:16, preFix: "", postFix: "", isActive:true, isDeleted:false},
       /* {valKey: "approvedBy.firstName", text: "Approved By", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false}*/
    ];

    TransactionDiamondMatch: IDefaultValues[] = [
        {valKey: "transactionId", text: "Voucher#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Imported By", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        /* {valKey: "approvedBy.firstName", text: "Approved By", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false}*/
    ];

   /* TransactionImportReview: IDefaultValues[] = [
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "movementStatus", text: "Status", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientShape", text: "Client Shape", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientRefId", text: "Client Refid", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinityShape", text: "Infinity Shape", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorSubCategory", text: "Color SubCategory", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "dmGuid", text: "GUID", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "gradeReportColor", text: "Grade Report Color", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labShape", text: "Lab Shape", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Lab Name", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Lab Report#", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];*/

    TransactionPriceIavUpdate: IDefaultValues[] = [
        {valKey: "transactionId", text: "TransactionId", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Updated By", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Created Date", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:false, isDeleted:false},
        /*{valKey: "", text: "Old IAV", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},*/
        {valKey: "rapaportDate", text: "Rapaport Date", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "newIav", text: "Discount", align: enumAlignment.right, sequence: 6, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        /*{valKey: "approvedBy.firstName", text: "Approved By", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false}*/
    ];

    TransactionDetail: IDefaultValues[] = [
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientShape", text: "Client Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinityShape", text: "Infinity Shape", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorSubCategory", text: "Color SubCategory", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "dmGuid", text: "GUID", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "gradeReportColor", text: "Grade Report Color", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 9, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "labShape", text: "Lab Shape", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 13, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Lab Name", align: enumAlignment.left, sequence: 14, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Lab Report#", align: enumAlignment.left, sequence: 15, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 16, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rfIdStatus", text: "Rfid Status", align: enumAlignment.left, sequence: 17, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "collateralStatus", text: "Collateral Status", align: enumAlignment.left, sequence: 18, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:false, isDeleted:false},
       /* {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 16, preFix: "", postFix: "", isActive:true, isDeleted:false},*/
       /* {valKey: "performedBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 18, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 19, preFix: "", postFix: "", isActive:true, isDeleted:false},*/
        /*{valKey: "createdAt", text: "DateTime", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},*/
    ];

    Reports: IDefaultValues[] = [
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];

    TransactionSale: IDefaultValues[] = [
        {valKey: "transactionId", text: "Voucher Id", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Imported By", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date & Time", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Created Date", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rapaportDate", text: "Rapaport Value Date", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "approvedBy.firstName", text: "Approved By", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];

    TransactionConsignment: IDefaultValues[] = [
        {valKey: "transactionId", text: "Voucher Id", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Imported By", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Date & Time", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Created Date", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rapaportDate", text: "Rapaport Value Date", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "status", text: "Status", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
       /* {valKey: "approvedBy.firstName", text: "Approved By", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false}
   */ ];

    InventoryUnreferenced: IDefaultValues[] = [
        {valKey: "skuId.infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Status", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Client Shape", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Client RefId", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Infinity Shape", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Color Type", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Color SubCategory", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "GUID", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Grade Report Color", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Discount", align: enumAlignment.right, sequence: 10, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "", text: "Lab Shape", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Clarity", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Color", align: enumAlignment.left, sequence: 13, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Date", align: enumAlignment.left, sequence: 14, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Created By", align: enumAlignment.left, sequence: 15, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Company", align: enumAlignment.left, sequence: 16, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Lab Name", align: enumAlignment.left, sequence: 17, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "", text: "Lab Report#", align: enumAlignment.left, sequence: 18, preFix: "", postFix: "", isActive:true, isDeleted:false}
    ];

    InventoryIavUpdate: IDefaultValues[] = [
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 9, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 10, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 11, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 12, preFix: "", postFix: "%", isActive: true, isDeleted: false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "iavId.effectiveDate", text: "Effective Date", align: enumAlignment.left, sequence: 14, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 15, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 16, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 17, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 18, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 19, preFix: "", postFix: "", isActive: false, isDeleted: false},
    ];

    RawActivity: IDefaultValues[] = [
        {valKey: "transactionId", text: "TransactionId", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "reader.serial", text: "Serial", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "reader.drawer", text: "Drawer", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "user.firstName", text: "User", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "deviceId.name", text: "Device", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "inCount", text: "In", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "outCount", text: "OUT", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "inventoryCount", text: "Inventory", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
       /* {valKey: "isTagValidated", text: "IsTagValidated", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "isCountChecked", text: "IsCountChecked", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},*/
        {valKey: "createdAt", text: "Date/Time", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Created Date", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:false, isDeleted:false},

       // {valKey: "events", text: "Events", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];

    RawActivityDetail: IDefaultValues[] = [
        {valKey: "transactionId", text: "TransactionId", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        // {valKey: "tagId", text: "TAG#", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.weight", text: "Weight", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.colorType", text: "Color Type", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.colorRapnet", text: "Color", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.clarity", text: "Clarity", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "tagId.skuId.dmStatus", text: "DM Registration Status", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.stoneRegistration", text: "Diamond Registration Required", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.pwvImport", text: "PWV Import", align: enumAlignment.right, sequence: 15, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.iavId.clientPriceId.price", text: "Infinity Price", align: enumAlignment.right, sequence: 16, preFix: "$", postFix: "", isActive:false, isDeleted:false},
        {valKey: "tagId.skuId.iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 17, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 18, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 19, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        // {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},
        // {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagId.skuId.stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "reader.serial", text: "Serial", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "reader.drawer", text: "Drawer", align: enumAlignment.left, sequence: 23, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "user.firstName", text: "User", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "deviceId.name", text: "Device", align: enumAlignment.left, sequence: 25, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "event", text: "Status", align: enumAlignment.left, sequence: 26, preFix: "", postFix: "", isActive:true, isDeleted:false},
        /* {valKey: "isTagValidated", text: "IsTagValidated", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
         {valKey: "isCountChecked", text: "IsCountChecked", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},*/
        {valKey: "createdAt", text: "Date/Time", align: enumAlignment.left, sequence: 27, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Created Date", align: enumAlignment.left, sequence: 28, preFix: "", postFix: "", isActive:false, isDeleted:false},

        // {valKey: "events", text: "Events", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];

    SettingDiamondMatch: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "diamondMatchRegistration", text: "DiamondMatch", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "ltv", text: "LTV(%)", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "isOpenBusiness", text: "Business Type", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive: true, isDeleted: false},
    ];

    LoanManagementSummary: IDefaultValues[] = [
        {valKey: "companyName", text: "Company Name", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "stones", text: "No of Stones", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "loanAmount", text: "Loan Amount", align: enumAlignment.right, sequence: 3, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityCollateralValue", text: "Infinity Collateral Value", align: enumAlignment.right, sequence: 4, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "clientCollateralValue", text: "Client Collateral Value", align: enumAlignment.right, sequence: 5, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "borrowingBase", text: "Borrowing Base", align: enumAlignment.right, sequence: 6, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "collateralShortfall", text: "Collateral Shortfall", align: enumAlignment.right, sequence: 7, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "ltv", text: "LTV", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "%", isActive: true, isDeleted: false},
    ];

    ValuationPricingDataWhite: IDefaultValues[] = [
        {valKey: `infinityPriceMasterId.caratRangeMasterId.fromCarat - infinityPriceMasterId.caratRangeMasterId.toCarat`, text: "Carat", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.clarityMasterId.clarity", text: "Clarity", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.colorMasterId.color", text: "Color", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.rapNetPrice.min", text: "Rapnet Price Min", align: enumAlignment.right, sequence: 4, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.rapNetPrice.max", text: "Rapnet Price Max", align: enumAlignment.right, sequence: 5, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.rapNetPrice.avg", text: "Rapnet Price Avg", align: enumAlignment.right, sequence: 6, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.rapPrice.min", text: "Rap Price Min", align: enumAlignment.right, sequence: 7, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.rapPrice.max", text: "Rap Price Max", align: enumAlignment.right, sequence: 8, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.rapPrice.avg", text: "Rap Price Avg", align: enumAlignment.right, sequence: 9, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "price", text: "Infinity Price", align: enumAlignment.right, sequence: 10, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "effectiveDate", text: "Effective Date", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive: true, isDeleted: false},
    ];

    LoanManagementDetail: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientShape", text: "Shape", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "weight", text: "Weight", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "ct", isActive:true, isDeleted:false},
        {valKey: "colorType", text: "Color Type", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "colorRapnet", text: "Color", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "gemlogistStatus", text: "Gemologist Status", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "dmStatus", text: "DM Registration Status", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneRegistration", text: "Diamond Registration Required", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.lab", text: "Lab", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "labsId.labReportId", text: "Lab#", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Client $/CT", align: enumAlignment.right, sequence: 13, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.pwv", text: "PWV", align: enumAlignment.right, sequence: 14, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "pwvImport", text: "PWV Import", align: enumAlignment.right, sequence: 15, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.clientPriceId.price", text: "Infinity Price", align: enumAlignment.right, sequence: 16, preFix: "$", postFix: "", isActive:false, isDeleted:false},
        {valKey: "iavId.rapPriceId.price", text: "Rap Price", align: enumAlignment.right, sequence: 17, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "iavId.iav", text: "Discount", align: enumAlignment.right, sequence: 18, preFix: "", postFix: "%", isActive:true, isDeleted:false},
        {valKey: "iavId.drv", text: "DRV", align: enumAlignment.right, sequence: 19, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 20, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 21, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "rfId.rfid", text: "TAG#", align: enumAlignment.left, sequence: 22, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinityRefId", text: "Infinity#", align: enumAlignment.left, sequence: 23, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "stoneStatus", text: "Stone Status", align: enumAlignment.left, sequence: 24, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "infinity.price", text: "Infinity Price", align: enumAlignment.right, sequence: 25, preFix: "$", postFix: "", isActive:true, isDeleted:false},
        {valKey: "contribution", text: "Contribution", align: enumAlignment.left, sequence: 26, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];

    DiamondMatchSelection: IDefaultValues[] = [
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "tagCount", text: "Tag Count", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "lifeTime", text: "Lifetime", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "comments", text: "Comments", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedBy.firstName", text: "Updated By", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];

    ValuationRapNetPricing: IDefaultValues[] = [
        {valKey: "clarity", text: "Clarity", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "color", text: "Color", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "price", text: "Price", align: enumAlignment.right, sequence: 3, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rapNetAvgPrice", text: "Rapnet Avg Price", align: enumAlignment.right, sequence: 4, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rapNetAvgPriceDiscount", text: "Rapnet Avg Price Discount", align: enumAlignment.right, sequence: 5, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rapNetBestPrice", text: "Rapnet Best Price", align: enumAlignment.right, sequence: 6, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rapNetBestPriceDiscount", text: "Rapnet Best Price Discount", align: enumAlignment.right, sequence: 7, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "shape", text: "Shape", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "rapNetDiscount", text: "Rapnet Discount", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "weightRange.fromWeight", text: "Carat Min", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "weightRange.toWeight", text: "Carat Max", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "effectiveDate", text: "Effective Date", align: enumAlignment.left, sequence: 12, preFix: "", postFix: "", isActive: true, isDeleted: false},
    ];

    ReportsExcelReport: IDefaultValues[] = [
        {valKey: "createdAt", text: "Report Date", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "_id", text: "Report", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "companyId.name", text: "Company", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive: true, isDeleted: false},
    ];

    LogManagement: IDefaultValues[] = [
        {valKey: "module", text: "Module", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "url", text: "URL", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "level", text: "Level", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdAt", text: "Created Date", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
    ];

    ValuationPricingDataOffWhite: IDefaultValues[] = [
        {valKey: "infinityPriceMasterId.caratRangeMasterId.fromCarat - infinityPriceMasterId.caratRangeMasterId.toCarat", text: "Carat", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "ct", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.clarityMasterId.clarity", text: "Clarity", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.colorMasterId.color", text: "Color", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.clientPrice.min", text: "Client Price Min", align: enumAlignment.right, sequence: 4, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.clientPrice.max", text: "Client Price Max", align: enumAlignment.right, sequence: 5, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "infinityPriceMasterId.clientPrice.avg", text: "Client Price Avg", align: enumAlignment.right, sequence: 6, preFix: "$", postFix: "", isActive: true, isDeleted: false},
        {valKey: "price", text: "Infinity Price", align: enumAlignment.right, sequence: 7, preFix: "", postFix: "", isActive: true, isDeleted: false},
        {valKey: "effectiveDate", text: "Effective Date", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive: true, isDeleted: false},
    ];

    AlertConfiguration: IDefaultValues[] = [
        {valKey: "category.category", text: "Category", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "subCategory.subCategory", text: "SubCategory", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "type.type", text: "Type", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "level.level", text: "Level", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "reciever.firstName", text: "Reciver", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:false, isDeleted:false},
        {valKey: "cc.firstName", text: "CC", align: enumAlignment.left, sequence: 6, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "frequency", text: "Frequency", align: enumAlignment.left, sequence: 7, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "schedule", text: "Schedule", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "message", text: "Message", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 10, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 11, preFix: "", postFix: "", isActive:false, isDeleted:false},

        /* {valKey: "approvedBy.firstName", text: "Approved By", align: enumAlignment.left, sequence: 9, preFix: "", postFix: "", isActive:true, isDeleted:false}*/
    ];

    DiamondMatchRegistrationFailure: IDefaultValues[] = [
        {valKey: "skuId.clientRefId", text: "SKU#", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "companyId.name", text: "company", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "error.code", text: "ErrorCode", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "error.description", text: "ErrorDescription", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "Created By", align: enumAlignment.left, sequence: 5, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 8, preFix: "", postFix: "", isActive:false, isDeleted:false},
    ];

    AlertCategory: IDefaultValues[] = [
        {valKey: "category", text: "Category", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "createdBy", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:false, isDeleted:false},
    ];

    AlertSubCategory: IDefaultValues[] = [
        {valKey: "subCategory", text: "subCategory", align: enumAlignment.left, sequence: 1, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "alertCategoryId.category", text: "Category", align: enumAlignment.left, sequence: 2, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "createdBy.firstName", text: "createdBy", align: enumAlignment.left, sequence: 3, preFix: "", postFix: "", isActive:true, isDeleted:false},
        {valKey: "updatedAt", text: "Updated Date", align: enumAlignment.left, sequence: 4, preFix: "", postFix: "", isActive:false, isDeleted:false},
    ];

    async getList(): Promise<IDefaultValues[]>{
        const {modelName, Activity, InventoryInventories, ManageUser, ManageDevices, ManageCompany, Business, Notifications, DiamondMatchRules,
            TransactionImport, SettingsDisplayConfig,InventoryImportReview, TransactionDetail, TransactionPriceIavUpdate, Reports, InventoryIavUpdate,
            TransactionDiamondMatch, DiamondMatchAction,InventoryInTransit, TransactionSale, TransactionConsignment, RawActivity,RawActivityDetail,
            DiamondMatchRegistration, SettingDiamondMatch, LoanManagementSummary, ValuationPricingDataWhite, DiamondMatchSelection,
            ValuationRapNetPricing, ReportsExcelReport, LogManagement, ValuationPricingDataOffWhite, LoanManagementDetail, InventoryRemoved,
            InventorySold, InventoryConsignment, AlertConfiguration, DiamondMatchRegistrationFailure, AlertSubCategory, AlertCategory} = this

        if(modelName === 'Activity') return Activity;   //Todo implement switch properly throughout the project inseatd of else if...
        else if(modelName === 'RawActivity') return RawActivity;
        else if(modelName === 'AlertSubCategory') return AlertSubCategory;
        else if(modelName === 'AlertCategory') return AlertCategory;
        else if(modelName === 'InventoryInventories') return InventoryInventories;
        // else if(modelName === 'InventoryAddInventory') return InventoryAddInventory; //Todo recheck please
        else if(modelName === 'InventoryImportReview') return InventoryImportReview;
        else if(modelName === 'InventoryIavUpdate') return InventoryIavUpdate;
        else if(modelName === 'InventoryInTransit') return InventoryInTransit;
       // else if(modelName === 'InventoryUnreferenced') return InventoryUnreferenced;
        else if(modelName === 'DiamondMatchAction') return DiamondMatchAction;
        else if(modelName === 'TransactionPrice') return TransactionPriceIavUpdate;
        else if(modelName === 'DiamondMatchRules') return DiamondMatchRules;
        else if(modelName === 'TransactionImport') return TransactionImport;
        else if(modelName === 'TransactionDiamondMatch'||modelName === 'TransactionImportReview' ||modelName === 'TransactionSale'
            ||modelName === 'TransactionConsignment'|| modelName === 'TransactionTransist') return TransactionDiamondMatch;
        else if(modelName === 'TransactionImportDetail'||modelName === 'TransactionImportReviewDetail'
            ||modelName === 'TransactionDiamondMatchDetail'||modelName === 'TransactionSaleDetail'||modelName === 'TransactionConsignmentDetail'
            ||modelName === 'TransactionTransistDetail' || modelName==='TransactionPriceDetail') return TransactionDetail;
        // else if(modelName === 'CollateralLoan') return CollateralLoan;   //Todo recheck please
        else if(modelName === 'Notifications') return Notifications;
        else if(modelName === 'RawActivityDetail') return RawActivityDetail;
        else if(modelName === 'InventorySold') return InventorySold;
        else if(modelName === 'InventoryRemoved') return InventoryRemoved;
        else if(modelName === 'InventoryConsignment') return InventoryConsignment;
        // else if(modelName === 'Reports') return Reports;     //Todo recheck please
        else if(modelName === 'Business') return Business;
        else if(modelName === 'ManageCompany') return ManageCompany;
        else if(modelName === 'ManageUser') return ManageUser;
        else if(modelName === 'ManageDevices') return ManageDevices;
        else if(modelName === 'SettingsDisplayConfig') return SettingsDisplayConfig;
        else if(modelName === 'DiamondMatchRegistration') return DiamondMatchRegistration;
        else if(modelName === 'SettingDiamondMatch') return SettingDiamondMatch
        else if(modelName === 'LoanManagementSummary') return LoanManagementSummary
        else if(modelName === 'ValuationPricingDataWhite') return ValuationPricingDataWhite
        else if(modelName === 'DiamondMatchSelection') return DiamondMatchSelection
        else if(modelName === 'ValuationRapNetPricing') return ValuationRapNetPricing
        else if(modelName === 'ReportsExcelReport') return ReportsExcelReport
        else if(modelName === 'LogManagement') return LogManagement
        else if(modelName === 'LoanManagementDetail') return LoanManagementDetail
        else if(modelName === 'ValuationPricingDataOffWhite'||modelName === "ValuationPricingDataFancy") return ValuationPricingDataOffWhite
        else if(modelName === 'AlertConfiguration') return AlertConfiguration;
        else if(modelName === 'DiamondMatchRegistrationFailure') return DiamondMatchRegistrationFailure;

        // else if(modelName === 'SettingsEmailSetup') return SettingsEmailSetup;      //Todo recheck please
        // else if(modelName === 'SettingsPDFTemplate') return SettingsPDFTemplate;     //Todo recheck please
        // else if(modelName === 'SettingsReports') return SettingsReports;     //Todo recheck please
        else return [];
    }
}
