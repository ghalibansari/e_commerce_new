import {Model} from "mongoose";
import activityModel from "../activity/activity.model";
import addressModel from "../address/address.model";
import companyModel from "../company/company.model";
import deviceModel from "../device/device.model";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import labModel from "../lab/lab.model";
import rapPriceModel from "../rap-price/rap-price.model";
import roleModel from "../role/role.model";
import skuModel from "../sku/sku.model";
import userModel from "../user/user.model";
import iavModel from "../iav/iav.model";
import clientPriceModel from "../client-price/client-price.model";
import companyTypeModel from "../company-type/company-type.model";
import companySubTypeModel from "../company-sub-type/company-sub-type.model";
import deviceTypeModel from "../device-type/device-type.model";
import BusinessModel from "../business/business.model";


export class columnList{
    constructor(public modelName: string) {}

    async getList(): Promise<Object>{
        let data: any = {}
        let Config: any = [];

        const {modelName, moduleToObject} = this

        console.log(this.modelName);
        if(modelName === 'Activity')
        {
            const [activityId,companyId, userId, skuId, labsId, iavId,RapId,ClientPriceId, dmId, deviceId] = await Promise.all([
                await moduleToObject(activityModel),await moduleToObject(companyModel), await moduleToObject(userModel), await moduleToObject(skuModel),
                await moduleToObject(labModel), await moduleToObject(iavModel),await moduleToObject(rapPriceModel),await moduleToObject(clientPriceModel), await moduleToObject(diamondMatchModel), await moduleToObject(deviceModel)]
            )

            await this.prepareData("", activityId,Config);
            await this.prepareData("companyId.", companyId,Config);
            await this.prepareData("userId.", userId,Config);
            await this.prepareData("skuId.", skuId,Config);
            await this.prepareData("labsId.", labsId,Config);
            await this.prepareData("iavId.", iavId,Config);
            await this.prepareData("iavId.rapPriceId.", RapId,Config);
            await this.prepareData("iavId.clientPriceId.", ClientPriceId,Config);
            await this.prepareData("dmId.", dmId,Config);
            await this.prepareData("skuId.deviceId.", deviceId,Config);

        }

        else if(modelName === 'Sku'||modelName === 'InventoryImportReview'||modelName === 'InventoryInventories') {
            const [companyId, userId, skuId, labsId, iavId,RapId,ClientPriceId, dmId, deviceId] = await Promise.all([
                await moduleToObject(companyModel), await moduleToObject(userModel), await moduleToObject(skuModel),
                await moduleToObject(labModel), await moduleToObject(iavModel), await moduleToObject(rapPriceModel),await moduleToObject(clientPriceModel),await moduleToObject(diamondMatchModel), await moduleToObject(deviceModel)]
            )

            await this.prepareData("", skuId,Config);
            await this.prepareData("companyId.", companyId,Config);
            await this.prepareData("userId.", userId,Config);
            await this.prepareData("labsId.", labsId,Config);
            await this.prepareData("iavId.", iavId,Config);
            await this.prepareData("iavId.rapPriceId.", RapId,Config);
            await this.prepareData("iavId.clientPriceId.", ClientPriceId,Config);
            await this.prepareData("dmId.", dmId,Config);
            await this.prepareData("deviceId.", deviceId,Config);
        }
        else if(modelName === 'Company'|| modelName === 'ManageCompany') {

            const [companyId, addressId, companyTypeId, companySubTypeId,parentId] = await Promise.all([
                await moduleToObject(companyModel), await moduleToObject(addressModel),
                await moduleToObject(companyTypeModel), await moduleToObject(companySubTypeModel),
                await moduleToObject(companyModel)]
            )

            await this.prepareData("", companyId,Config);
            await this.prepareData("parentId.", parentId,Config);
            await this.prepareData("addressId.", addressId,Config);
            await this.prepareData("companyTypeId.", companyTypeId,Config);
            await this.prepareData("companySubTypeId.", companySubTypeId,Config);
        }
        else if(modelName === 'User'|| modelName === 'ManageUser') {

            const [userId,companyId, addressId, roleId] = await Promise.all([
                await moduleToObject(userModel), await moduleToObject(companyModel),
                await moduleToObject(addressModel), await moduleToObject(roleModel)]
            )

            await this.prepareData("", userId,Config);
            await this.prepareData("companyId.", companyId,Config);
            await this.prepareData("addressId.", addressId,Config);
            await this.prepareData("roleId.", roleId,Config);
        }
        else if(modelName === 'Device'|| modelName === 'ManageDevices') {

            const [deviceId,companyId, deviceTypeId] = await Promise.all([
                await moduleToObject(deviceModel),await moduleToObject(companyModel), await moduleToObject(deviceTypeModel)]
            )

            await this.prepareData("", deviceId,Config);
            await this.prepareData("companyId.", companyId,Config);
            await this.prepareData("deviceTypeId.", deviceTypeId,Config);
        }
        else if(modelName === 'Business') {

            const [businessId,companyId, lastOpenedBy, lastClosedBy] = await Promise.all([
                await moduleToObject(BusinessModel),await moduleToObject(companyModel), await moduleToObject(userModel), await moduleToObject(userModel)]
            )
            await this.prepareData("", businessId, Config);
            await this.prepareData("companyId.", companyId,Config);
            await this.prepareData("lastOpenedBy.", lastOpenedBy,Config);
            await this.prepareData("lastClosedBy.", lastClosedBy,Config);
        }
        return Config
    }

    async moduleToObject(module: Model<any>, key?: string, value?: string): Promise<Object> {
        let tempObject: any = {};
        let x = Object.keys(module['schema']['obj'])
        x.forEach(keys => {
            if(keys == key) tempObject[keys] = value
            else tempObject[keys] = keys
        })
        tempObject.createdAt = 'createdAt'
        tempObject.updatedAt = 'updatedAt'
        return tempObject;
    }

    async  prepareData(rootDoc: string, data: any,array :any) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            if(rootDoc.length==0){
                await this.mapValuesData(rootDoc, array, data[keys[i]], i);
            }
            else if(data[keys[i]]!=="createdBy" && data[keys[i]]!=="updatedBy" && data[keys[i]]!=="isDeleted"&& data[keys[i]]!=="isActive") {
                await this.mapValuesData(rootDoc, array, data[keys[i]], i);
            }
        }
    }

    async mapValuesData(rootDoc: string,array :any, keys :any, i :any) {
        let rows: any = {};

        rows.valKey = rootDoc + keys;
       /* rows.text = keys;
        rows.align = 'center';
        rows.sequence = array.length+1;
        rows.prefix = "";
        rows.postfix = "";
        rows.isActive=true;
        rows.isDeleted=false;*/
        if(rootDoc.includes('rapPriceId.')||rootDoc.includes('clientPriceId.'))
        {
            if(keys.includes('price'))
            {
                rows.valKey = rootDoc + keys;
                //rows.text = keys;
                array.push(rows);
            }
        }
        else if(!keys.includes('.')&& (keys.endsWith('Id')) && rootDoc.length==0)
        {

        }
        else
        {
            array.push(rows);
        }
    }

}