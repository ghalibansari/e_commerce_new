// import {BaseRepository} from "../BaseRepository";
// import skuHistoryModel from "./sku.model";
// import {ISku} from "./sku.types";
// import mongoose, {ClientSession} from "mongoose";
// import labModel from "../lab/lab.model";
// import companyModel from "../company/company.model";
// import iavModel from "../iav/iav.model";
// import faker from "faker"
// import clientPriceModel from "../client-price/client-price.model";
// import rfidModel from "../rfid/rfid.model";
// import rapPriceModel from "../rap-price/rap-price.model";
// import {IRapPrice} from "../rap-price/rap-price.types";
// import {IIav} from "../iav/iav.types";
// import {IClientPrice} from "../client-price/client-price.types";
// import {SkuHistoryValidation} from "./sku.validation";
// import {IRfid} from "../rfid/rfid.types";
// import alertMasterModel from "../alert-master/alert-master.model";
// import alertModel from "../alert/alert.model";
// import activityModel from "../activity/activity.model";
// import diamondMatchModel from "../diamond-match/diamond-match.model";
// import {IActivity} from "../activity/activity.types";
// import verificationModel from "../verification/verification.model";
// import Moment from 'moment'
// import {BaseHelper} from "../BaseHelper";
// import {Messages} from "../../constants/Messages";
// import {IEvent} from "../events/events.types";
// import rawActivityModel from "../raw-activity/raw-activity.model";
// import transactionImportModel from "../transaction/import/import.model";
// import {ITransactionImport} from "../transaction/import/import.types";
// import transactionImportReviewModel from "../transaction/import-review/import-review.model";
// import transactionConsignmentModel from "../transaction/consignment/consignment.model";
// import transactionSaleModel from "../transaction/sale/sale.model";
// import {ICompany} from "../company/company.types";
// import {devices} from "../../socket"
// import {IUser} from "../user/user.types";
// import {IIndexProjection} from "../../interfaces/IRepository";
// import userModel from "../user/user.model";
// import deviceModel from "../device/device.model";
//
//
// export class SkuHistoryRepository extends BaseRepository<ISku> {
//     constructor () {
//         super(skuHistoryModel)
//     }
//
//     index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object> => {
//         let cond: any = {'isDeleted': false};
//         let secondCond: any = { //Todo add isDeleted condition here in every table
//             // 'labsId.isDeleted': false,
//             // 'companyId.isDeleted': false,
//         };
//         let sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}
//
//         if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
//             sorter = sorter.replace(/'/g, '"');
//             sorter = await JSON.parse(sorter)
//             sort = { [`${sorter.key}`] : `${sorter.value}`}
//         }
//         else sort = { createdAt: 'desc', updatedAt: 'desc'};
//
//         if(search){
//             search = JSON.parse(search)
//             const _S = {$regex: search, $options: "i"}
//             secondCond['$or'] = [{'rfId.rfid': _S}, {'labsId.labReportId': _S}, {'clientRefId': _S}, {'infinityRefId': _S}]
//         }
//         if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
//             filters = filters.replace(/'/g, '"')
//             filters = JSON.parse(filters)
//             filters.forEach(({key: k, value: v}: any) => {
//                 if(k === 'startDate' || k === 'endDate') {
//                     if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
//                     if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v)
//                     if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v)
//                 }
//                 else if(k==='stoneRegistered')
//                 {
//                     if(v ==='REGISTERED') cond['dmGuid'] = {"$ne": ""}
//                     else cond['dmGuid'] = {"$eq": ""}
//                 }
//                 else if(k==='labsId.labReportId') secondCond[k] = v
//                 else if(k==='weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
//                 else if(k==='iavId.drv' || k==='iavId.iav' || k==='iavId.pwv') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
//                 else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
//                 else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
//                 else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
//                 else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
//                 else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
//                 else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
//             })
//         }
//         if(sliders && sliders[0]=='{' && sliders[sliders.length-1]=='}') {
//             sliders = JSON.parse(sliders)
//             if(sliders.weight) cond.weight = {"$gte": sliders.weight[0], "$lte": sliders.weight[1]}
//             if(sliders.drv) secondCond['iavId.drv'] = {"$gte": sliders.drv[0], "$lte": sliders.drv[1]}
//             if(sliders.iav) secondCond['iavId.iav'] = {"$gte": sliders.iav[0],"$lte": sliders.iav[1]}
//             if(sliders.pwv) secondCond['iavId.pwv'] = {"$gte": sliders.pwv[0],"$lte": sliders.pwv[1]}
//             if(sliders.labReportId) secondCond['labsId.labReportId'] = sliders.labReportId
//             //@ts-expect-error
//             if(sliders.parentId) secondCond['companyId.parentId'] = mongoose.ObjectId(sliders.parentId)
//         }
//
//         if(column && column[0]=='[' && column[column.length-1]==']'){
//             column = column.replace(/'/g, '"')
//             column = JSON.parse(column)
//             projection = {}
//             for(const col of column) projection[col] = 1
//         }
//
//         const aggregate = [
//             {$match: cond},
//             {$lookup: {from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId'}},
//             {$unwind: {path: "$labsId", preserveNullAndEmptyArrays: true}},
//             {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
//             {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
//             {$lookup: {from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId'} },
//             {$unwind: {path: "$iavId", preserveNullAndEmptyArrays: true}},
//             {$lookup: {from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'rapPriceId'}},
//             {$unwind: {path: "$rapPriceId", preserveNullAndEmptyArrays: true}},
//             {$lookup: {from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'clientPriceId'}},
//             {$unwind: {path: "$clientPriceId", preserveNullAndEmptyArrays: true}},
//             {$lookup: {from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId'}},
//             {$unwind: {path: "$rfId", preserveNullAndEmptyArrays: true}},
//             {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
//             {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
//             {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
//             {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
//             {$project: {"createdBy.password": 0, "updatedBy.password": 0}},
//             {$match: secondCond},
//             {$set: {"iavId.rapPriceId": "$rapPriceId"}},
//             {$set: {"iavId.clientPriceId": "$clientPriceId"}},
//             {$unset: ["rapPriceId","clientPriceId"] },
//             {$project: projection},
//             {$unset: ["createdBy.password", "updatedBy.password"]}
//         ]
//         const {data, page} = await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
//         let header = {totalStone: page.filterCount, totalCarats: 0, totalValue: 0}
//         //@ts-expect-error
//         data.forEach(({weight, iavId}: ISku) => {header.totalCarats = header.totalCarats + parseFloat(weight ?? 0); header.totalValue = header.totalValue + parseFloat(iavId?.pwv ?? 0)})
//         return {header, page, data}
//     }
//
//     skuLabUpdate = async (newData: any, session: ClientSession) => {
//         console.log(newData,'.........................................')
//         await skuHistoryModel.findOne()
//         await rfidModel.findOne()
//         await labModel.findOne()
//         await iavModel.findOne()
//         await labModel.findOne()
//     }
//
//    /* findBR = async (cond: object = {}, column:object = {}, sortObj: object = {}, limit: number, startIndex: number = 1, populate: object[]=[], sliders = {}): Promise<ISku[]> =>
//     {
//         let skuCond = Object.assign(cond)
//         //@ts-expect-error
//         if(sliders?.weight) skuCond.weight = {"$gte": sliders.weight[0],"$lte": sliders.weight[1]}
//
//         console.log("SkU"+skuCond);
//         console.log(populate);
//
//         let data=await skuModel.find(skuCond, column).sort(sortObj).limit(limit).skip(startIndex).populate(populate).lean()
//
//         console.log("SkU"+skuCond);
//         let result: any[] = []
//         let newData: any[] = []
//         newData=data.map(async data=> {
//
//                 let iavData: any = {};
//                 let rfidData: any = {};
//
//             let iavCon = {skuId: data._id}
//             //@ts-expect-error
//             if(sliders?.drv) iavCon.drv = {"$gte": sliders.drv[0],"$lte": sliders.drv[1]}
//             //@ts-expect-error
//             if(sliders?.iav) iavCon.iav = {"$gte": sliders.iav[0],"$lte": sliders.iav[1]}
//             //@ts-expect-error
//             if(sliders?.pwv) iavCon.pwv = {"$gte": sliders.pwv[0],"$lte": sliders.pwv[1]}
//
//                 let populate = [{path: 'rapPriceId'}, {path: 'clientPriceId'}];
//
//                 iavData = await iavModel.findOne(iavCon).sort({"createdAt": -1}).lean()
//                     //@ts-expect-error
//                     .then(async (Data:IIav) =>
//                     {
//
//                         let Val={}
//                         //@ts-expect-error
//                         if(sliders?.vc) Val= {"price": {"$gte": sliders.vc[0],"$lte": sliders.vc[1]}}
//
//                         if (data.colorType === colorTypeEnum.WHITE) {
//                             //@ts-expect-error
//                             Data.price=await rapPriceModel.findOne(Val).sort({"createdAt": -1}).select('price').lean();
//
//                         } else {
//                             //@ts-expect-error
//                             Data.Price=await clientPriceModel.findOne(Val).sort({"createdAt": -1}).select('price').lean();
//                         }
//
//                         return Data;
//                     })
//
//                 console.log("Iav Data"+iavData);
//                 rfidData = await rfidModel.findOne({skuId: data._id}).sort({"createdAt": -1})
//
//                 if (rfidData != null) {
//                     data.rfid = rfidData.rfid;
//                 }
//
//                 if (iavData != null) {
//                     //data.iav=iavData;
//                     data.iav = iavData.iav;
//                     //@ts-expect-error
//                     data.drv = iavData.drv;
//                     //@ts-expect-error
//                     data.pwv = iavData.pwv;
//                     //@ts-expect-error
//                     data.price = iavData?.price?.price;
//                 }
//
//             /!*if (iavData != null) {
//                 //@ts-expect-error
//                 data.iav = iavData;
//                 //@ts-expect-error
//                 data.price = iavData?.price;
//             }*!/
//
//
//                 // console.log(data);
//                 result.push(data);
//             }
//         );
//
//
//             /!*let populateData = [{path: 'rapPriceId'},{path:'clientPriceId'}];
//             let iavData: IIav[] = await iavModel.find(cond).populate(populateData).sort({"createdAt": -1})
//             console.log(iavData.length);
//             // console.log(iavData,'??????????????????????????????????????????????');
//             let skuIdData: ISku['_id'][] = []
//             await iavData.forEach(async (iav) => await skuIdData.push(iav.skuId))
//             skuIdData = [...new Set(skuIdData)]
//             console.log(skuIdData,'????????????????????????')
//             let skuIdResponseData: any[] = []
//             skuIdData.map(async (skuId) => {
//                 await skuModel.find({_id: skuId}).lean()
//                     .then(sku => {
//                         console.log('ssssss',sku,'zzzzzzzz')
//                         //@ts-except-error
//                         skuIdResponseData.push(sku)
//                     });
//             })
//             let zzz = await Promise.all(skuIdData)
//             let data=await skuModel.find(cond, column).sort(sortObj).limit(limit).skip(startIndex).populate(populate).lean()
//
//             // console.log('======',zzz,'>>>>>>>>>>',skuIdResponseData)
//             let result: any[] = []
//             let newData: any[] = []
//             newData=data.map(async data=>{
//
//                 let rfidData : any ={};
//
//                 rfidData = await rfidModel.findOne({skuId: data._id}).sort({"createdAt": -1})
//
//                 if(data.colorType === colorTypeEnum.WHITE) {
//
//                     if(iavData!==undefined && iavData!==null)
//                     {
//                         //@ts-expect-error
//                         if(iavData.rapPriceId != null)
//                         {
//                             //@ts-expect-error
//                             data.price=iavData.rapPriceId.price;
//                         }
//                     }
//                 }
//                 else
//                 {
//                     if(iavData!==undefined && iavData!==null) {
//
//                         //@ts-expect-error
//                         if(iavData.clientPriceId != null)
//                         {  //@ts-expect-error
//                             data.price = iavData.clientPriceId.price;
//                         }
//
//                     }
//                 }
//
//                 if(rfidData!=null)
//                 {
//                     data.rfid=rfidData.rfid;
//                 }
//
//                 if(iavData!=null)
//                 {
//                     //@ts-expect-error
//                     //data.iav=iavData;
//                     data.iav=iavData.iav;
//                     //@ts-expect-error
//                     data.drv=iavData.drv;
//                     //@ts-expect-error
//                     data.pwv=iavData.pwv;
//                 }
//
//
//                 console.log(data);
//                 result.push(data);
//
//             })*!/
//
//             await  Promise.all(newData);
//             return result;
//     }
//
//     findCountBR = async (cond: object = {}, sliders = {}): Promise<number> => {
//         //@ts-expect-error
//         if(sliders?.weight) cond.weight = {"$gte": sliders.weight[0],"$lte": sliders.weight[1]}
//         return skuModel.countDocuments(cond);
//     }*/
//
//     async import( transactionBody: any, body: any, user: any, session: ClientSession) : Promise<any> {
//         let rapaport = await rapPriceModel.findOne({}).sort({createdAt: -1})
//         if(rapaport?.createdAt) transactionBody.rapaportDate = rapaport.createdAt
//         let resultData = [], skuIds: ISku['_id'][] = [], count : number = 1
//         let transaction = await transactionImportModel.create([transactionBody], {session}).then(transaction => transaction[0])
//
//         for (let importData of body) {
//             let cond: any = {};
//             cond['clientRefId'] = importData.ref;
//             cond['companyId'] = importData.companyId;
//            let data: any = await new SkuHistoryValidation().skuImpoValidation(importData)
//             if(data) {
//                 importData.error = data;
//                 importData.importStatus="NOTINSERTED";
//                 resultData.push(importData)
//                 continue
//             }
//
//             await skuHistoryModel.findOne(cond).then(async (skuInfinityRefIdData) =>
//             {
//                 if(skuInfinityRefIdData) importData.importStatus="DUPLICATE";
//                 else
//                 {
//                     if (importData.lab === "GIA") importData = await this.checkValidation(importData, user)
//                     if (importData.lab === "GIA" && importData.isCalculationValidated) {
//                         importData = await this.createAll(importData, user, transaction, count, session)
//                         importData.importStatus="INSERTED";
//                         skuIds.push(importData.skuId)
//                         count++
//                     }
//                     else if (importData.lab === "GIA") importData.importStatus="NOTINSERTED";
//                     else {
//                         importData.isCalculationValidated = false
//                         importData.isCalculationValidated = true
//                         importData = await this.createAll(importData, user, transaction, count, session)
//                         importData.importStatus="INSERTED";
//                         skuIds.push(importData.skuId)
//                         count++
//                     }
//                 }
//
//             })
//             resultData.push(importData)
//         }
//         transaction.status = "Completed",transaction.skuIds = skuIds
//         await transactionImportModel.updateMany({ transactionId: transaction.transactionId }, transaction, {session})
//         return resultData
//     }
//
//     groupBy = async (key: string[], companyId?: ICompany['_id']): Promise<any> => {
//         let data: {[key: string]: string}[] = []
//         const returnData = key.map(key => {
//             let aggregate = []
//             if(companyId) aggregate.push({$match: {companyId: mongoose.Types.ObjectId(companyId)}})
//             aggregate.push({"$group" : {_id: `$${key}`}}, {$set: {[key]: '$_id'}}, {$project: {_id: 0}})
//             return skuHistoryModel.aggregate(aggregate);
//         })
//         await Promise.all(returnData).then(async returnData => await returnData.forEach(dot => dot.forEach(dog => data.push(dog))))
//         return data;
//     };
//
//     async createAll (importData: any, user: any, transaction: ITransactionImport, count: number, session: ClientSession): Promise<any>{
//         let labData = await labModel.create([{"lab":importData.lab, "labReportId": importData.reportNumber, "labReportPath": importData.pdf ,
//                 labReportDate : new Date(importData.reportDate), ...user}], {session})
//         importData.labId = labData[0]._id; importData.status='ACTIVE'; importData.movementStatus="ARRIVAL";
//         importData.skuId = await this.createSku(importData, user, count, session)
//         let [clientPriceId, iavId, rfid] = await Promise.all([
//             this.createClientPrice(importData, user, session),
//             this.createIav(importData, user, session),
//             this.createRfidTags(importData, user, session),
//             // this.createImportReview(importData, transaction, user, session )
//         ])
//         importData = {...importData, clientPriceId, iavId}
//         await skuHistoryModel.findOneAndUpdate({_id: importData.skuId} , {iavId: importData.iavId, rfId: rfid}, {session})
//         return importData
//     }
//
//     async createImportReview(body: any, transaction: ITransactionImport, user: any, session: ClientSession): Promise<void> {
//         let transactionImportReviewData = {transactionId: transaction.transactionId, skuId: body.skuId, status: "IMPORTED", ...user }
//         await transactionImportReviewModel.create([transactionImportReviewData],{session})
//     }
//
//     async createSku(body: any, user :any, count: number, session: ClientSession): Promise<ISku['_id']> {
//         let populate = [{path: 'addressId'}];
//         let company = await companyModel.findOne({_id: body.companyId}).populate(populate)
//         //@ts-expect-error
//         let companyName = company.name.slice(0, 3).toUpperCase()
//         console.log(companyName);
//         //@ts-expect-error
//         let companyLoc = company.addressId.address1.slice(0,3).toUpperCase()
//         console.log(companyLoc);
//         //@ts-expect-error
//         let companyId = company._id.toString().slice(0,6).toUpperCase()
//         console.log(companyId);
//         let CompanyTotalCount = await companyModel.countDocuments({}) + 1
//         let InfinityTotalCount = await skuHistoryModel.countDocuments({}) + count
//         let YYMM = new Date().getFullYear().toString().slice(2,4) + ("0" + new Date().getMonth().toString())
//         let infinityRefId =  YYMM +"-" + companyId + "-" + companyName+ "-"  + companyLoc + "-" + CompanyTotalCount+ "-"+ faker.random.number(1-10000)  //ToDo Needs to Check
//         console.log(infinityRefId, "=================>>>>>>>>>>>>>>>> + infinityRefId");
//
//         let skuData = {labsId: [body.labId], companyId: body.companyId, clientRefId: body.ref, infinityShape: body.shape,
//             clientShape : body.shape, labShape: body.shape, shape: body.shape, weight : body.caratWeight,
//             colorCategory: body.color, colorSubCategory: body.color, gradeReportColor: body.color,
//             colorRapnet: body.color, clarity: body.clarity, measurement: body.measurement, colorType: body.stoneType,
//             status: body.status, movementStatus: body.movementStatus, dmGuid: faker.random.alphaNumeric(5),
//             pwvImport: body.pwvImport, infinityRefId, ...user
//         }
//         let sku = await skuHistoryModel.create([skuData], {session})
//         return sku[0]._id
//     }
//
//     async createClientPrice(body: any, user :any, session: ClientSession): Promise<IClientPrice['_id']> {
//         let clientPriceData = {companyId: body.companyId, skuId: body.skuId, shape: body.shape,
//             clarity: body.clarity, color: body.color, weight:  body.caratWeight, price: Number(body.fixedValueCarat),
//             pwvImport: Number(body.pwvImport), ...user}
//         let clientPrice: IClientPrice[] = await clientPriceModel.create([clientPriceData], {session})
//         return clientPrice[0]._id
//     }
//
//     async createIav(body: any ,user :any, session: ClientSession): Promise<IIav['_id']> {
//         let iavData: any = {...user}
//         if(body.rapPriceId)iavData.rapPriceId =  body.rapPriceId;
//         if(body.clientPriceId)iavData.clientPriceId =  body.clientPriceId;
//         iavData.iav = Number(body.iav.replace(',','')).toFixed(5);
//         iavData.drv = Number(body.drv.replace(',','')).toFixed(2);
//         iavData.pwv = Number(body.pwv.replace(',','')).toFixed(2);
//         iavData.skuId = body.skuId;
//         iavData.iavAverage = Number(body.iav);
//         let iav: IIav[] = await iavModel.create([iavData], {session}); // need to check session for this
//         return iav[0]._id
//     }
//
//     async createRfidTags(body: any ,user :any, session: ClientSession): Promise<IRfid['_id']> {
//         let rfidData = {skuId: body.skuId, rfid: body.tag, ...user}
//         let rfId: any = await rfidModel.create([rfidData], {session});
//         return rfId[0]._id
//     }
//
//     async checkValidation(body: any, user: any): Promise<any> {
//         body.isCalculationValidated = true;
//         body.caratWeight = Number(body.caratWeight)
//         if(body.stoneType=='White')
//         {
//             if(body.caratWeight > 5) body.caratWeight = 5.00;
//             if(body.shape!=='Round') body.shape='Pear';
//
//             let price: any =await rapPriceModel.aggregate([
//                 {'$match': {'weightRange.fromWeight': {'$lte': body.caratWeight}, 'weightRange.toWeight': {'$gte': body.caratWeight}, 'shape': body.shape, 'clarity': body.clarity, 'color': body.color}},
//                 {'$sort': {'_id': -1}}, {'$limit': 1}])
//
//             console.log(body.rap +"=="+ price[0]?.price);
//             if (body.rap !== price[0]?.price) return body
//             if (body.drv !== (body.caratWeight * price[0]?.price).toFixed(2)) return body
//             if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) return body
//             body.priceId = price[0]?._id
//         }
//         else
//         {
//             console.log(body.drv +"!=="+(body.caratWeight * body.fixedValueCarat).toFixed(2));
//             if (body.drv !== (body.caratWeight * body.fixedValueCarat).toFixed(2)) return body
//             if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) return body
//         }
//         return body
//     }
//
//     async updateStatus(body: any, user: any, session: ClientSession): Promise<Number> {
//         let transactionId, companyId
//         if (body.status === "CONSIGNMENT") transactionId = "CN-" + new Date().toISOString()
//         else transactionId = "SL-" + new Date().toISOString()
//         let alertStatus = ["IN","OUT","SOLD","MISSING","CONSIGNMENT"]
//         // let transaction = await transactionModel.create([transactionBody], {session}).then(transaction => transaction[0])
//         for (const skuId of body.skuIds) {
//             let sku = await skuHistoryModel.findById({ _id: skuId }).lean()
//             if (!sku?._id) throw new Error("Invalid SkuId")
//             companyId = sku?.companyId
//             let status = (body.status === "SOLD" && sku.isCollateral) ? "COLLATERAL_SOLD" : body.status;
//             let activity = await this.createActivity(skuId, user, status, session)
//             if(alertStatus.includes(body.status)){
//                 let alertType = await alertMasterModel.findOne({ status: body.status }, { createdAt: -1 })// to do alertType as Usergenerated
//                 if (!alertType) continue
//                 let alertData = {
//                     userId: user.createdBy, message: "working good", skuId, alertId: alertType?._id, status: body.status,
//                     ...user
//                 }
//                 await alertModel.create([alertData], { session })
//             }
//         }
//         // transaction.status = "Completed",transaction.skuIds = body.skuIds
//         let transactionBody = { transactionId, companyId, status: "Completed", skuIds: body.skuIds, ...user }
//         console.log(transactionBody);
//
//         await skuHistoryModel.updateMany({ "_id": body.skuIds }, { "movementStatus": body.status }, { session })
//         console.log("========>>>>>>>");
//
//         if (body.status === "CONSIGNMENT") await transactionConsignmentModel.create([transactionBody], { session })
//         else await transactionSaleModel.create([transactionBody], { session })
//         return body.skuIds.length
//     }
//
//     async createActivity(skuId: ISku['_id'], user :any, status: any, session: ClientSession, comments?: any): Promise<IActivity|null> {
//         let skuData: ISku| null = await skuHistoryModel.findOne({_id:skuId})
//         let dmId: any = await diamondMatchModel.findOne({skuId, $or: [ { status: "MATCHED" }, { status: "NOTMATCHED" } ] }).sort({createdAt: -1}).select('_id').lean()
//         if(!dmId) dmId = null
//         let activityData = {companyId: skuData?.companyId, skuId, labsId: skuData?.labsId, iavId: skuData?.iavId,
//             userId: user.createdBy, dmId, status: status, ...user}
//         if(comments) activityData = {...activityData, comments: comments}
//         let activity = await activityModel.create([activityData], {session}).then(activity => activity[0])
//         return activity;
//     }
//
//     // async ledTrigger(body: any, user: any, session: ClientSession): Promise<IActivity[]> {
//     //     let activity: any = []
//     //     for (const skuId of body.skuIds) {activity.push(await this.createActivity(skuId, user, body.status, session, body.comments)) }
//     //     let data = await this.getComplete(activity)
//     //     if(data.registerDevice && data.registerDevice.token && devices){
//     //         let token = data.registerDevice.token
//     //         if(token && devices[token]) devices[token].emit("triggerLed", data.activityData)
//     //     }
//     //     return activity
//     // }
//
//     async ledTrigger(body: any, user: any, session: ClientSession): Promise<any> {
//         let socketData: any = [],  tagInfo: any = {}, serialNumber, registerDevice
//         let populate = [{path: "rfId"}]
//         let skuData = await skuHistoryModel.find({_id: body.skuIds}).populate(populate)
//         for (const sku of skuData) {
//             let data: any = {}
//             serialNumber = sku.reader.serial
//             //@ts-expect-error
//             data.tag = sku.rfId.rfid
//             data.comments = body.comments
//             data.drawer = sku.reader.drawer
//             socketData.push(data)
//         }
//         if(serialNumber) registerDevice = await deviceModel.findOne({serialNumber})
//         let token = registerDevice?.token
//         if(!token || !devices[token]) throw new Error(Messages.DEVICE_IS_NOT_LOGGED_IN)
//         devices[token].emit("triggerLed", socketData)
//         return {status: true, message: Messages.DEVICE_TRIGGERED_SUCCESSFULLY}
//     }
//
//     async getComplete(activity: any): Promise<any> {
//         let activityData: any = [], serialNumber, registerDevice
//         for (const item of activity) {
//             let sku = await skuHistoryModel.findOne({_id: item.skuId}, 'rfId').populate([{path: 'rfId'}])
//             //@ts-expect-error
//             let rawActivity: any = await rawActivityModel.findOne({"events.EventType":"IN", "events.stones":sku?.rfId.rfid},{reader: 1, _id: 0}).sort({createdAt: -1})
//             if(rawActivity){
//                 serialNumber = rawActivity?.reader.serial
//                 //@ts-expect-error
//                 rawActivity = {...rawActivity?.reader, "tag": sku?.rfId.rfid}
//                 delete rawActivity.$init
//                 delete rawActivity.serial
//                 activityData.push(rawActivity)
//             }
//         }
//         if(serialNumber) registerDevice = await deviceModel.findOne({serialNumber})
//         return {activityData, registerDevice}
//     }
//
//     async updateMany(sendEmail: any, verificationMatch: any, verifyToBeInserted: any ,loggedInUserEmail: string,session: ClientSession): Promise<any> {
//         const verify: any = await verificationModel.findOne(verificationMatch).sort({ createdAt: -1 })   //Todo add Ip here
//         console.log(verify);
//         if (verify && Moment(verify?.createdAt).add(10, 'minutes').format() > Moment().format()) return {status: true, message: Messages.OTP_IS_ALREADY_SENT}
//         await new BaseHelper().emailSend('otp_mail', sendEmail, loggedInUserEmail)
//         const verifyData = await verificationModel.create([verifyToBeInserted],{session}).then(verifyData => verifyData[0])
//         if (verifyData) return {status: true, message: Messages.OTP_SENT_SUCCESSFULLY}
//     }
//
//     async deleteManyVerify(query: any, verificationMatch: any, updateVerification:any, session: ClientSession): Promise<any> {
//         let skuIds = JSON.parse(query.skuIds)
//         const verify = await verificationModel.findOne(verificationMatch).sort({ updatedAt: -1 })
//
//         if (verify && verify.otp == query.otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
//             let updatedSkuData = await skuHistoryModel.updateMany({ "_id": skuIds }, { isDeleted: true, isActive: false }, {new: true, session})
//             if (updatedSkuData.nModified === 0) return {status: false, message: Messages.UPDATE_FAILED}
//             await verificationModel.updateMany({ _id: verify._id }, updateVerification, {session})
//             return {status: true, message: Messages.UPDATE_SUCCESSFUL, data: updatedSkuData}
//         } else return {status: false, message: Messages.INVALID_OTP}
//     }
//
//     async unReferencedAssets(): Promise<any> {
//         let unReferencedAssets = [],sku: ISku|null = null, unReferencedAssetsObj: any = {}
//         let rawActivityData = await rawActivityModel.findOne({}).sort({createdAt: -1})
//         const eventInventory = rawActivityData?.events.find((item: IEvent) => { return item.EventType === "INVENTORY" });
//         //@ts-expect-error
//         for (const stone of eventInventory?.stones) {
//             let rfids = await rfidModel.findOne({rfid: stone, isDeleted: false}).sort({createdAt: -1})
//             // if(rfid) sku = await skuModel.findOne({rfId: rfid?._id, isDeleted: false})
//             if(!rfids){
//                 let reader = await rawActivityModel.findOne({"events.EventType":"IN", "events.stones": stone},{reader: 1, _id: 0}).sort({createdAt: -1});
//                 unReferencedAssetsObj = {...reader?.reader, stone}
//                 delete unReferencedAssetsObj.$init
//                 unReferencedAssets.push(unReferencedAssetsObj)
//             }
//         }
//         return unReferencedAssets
//     }
//
//     async updateCollateral(body: any, update: any, user: any, session:ClientSession): Promise<void> {
//         let status = (body.isCollateral)? "COLLATERAL_ADDED": "COLLATERAL_REMOVED"
//         let skuData = await skuHistoryModel.find({_id: {"$in": body.skuIds }})
//         for (const sku of skuData) {
//             if(body.dmCheck && (!sku?.dmGuid || sku?.dmGuid === "")) throw new Error("stones not yet registrered")
//             await skuHistoryModel.findOneAndUpdate({"_id": sku._id, isDeleted: false}, update, {session})
//             await this.createActivity(sku._id, user, status, session)
//         }
//     }
//
//     async filter(userId: IUser['_id']): Promise<any> {
//         let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
//         //need to add these conditions
//         let cond: any = {}
//         //@ts-expect-error
//         if(user.roleId.shortDescription != 'SPACECODEADMIN') cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);
//
//         let data = await skuHistoryModel.aggregate([
//             { $match: { ...cond, "isDeleted": false } },
//             { $match: { "isDeleted": false } },
//             { $lookup: { from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId' } },
//             { $unwind: { path: "$labsId", preserveNullAndEmptyArrays: true } },
//             { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
//             { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
//             { $lookup: { from: 'devices', localField: 'deviceId', foreignField: '_id', as: 'deviceId' } },
//             { $unwind: { path: "$deviceId", preserveNullAndEmptyArrays: true } },
//             { $lookup: { from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId' } },
//             { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
//             { $lookup: { from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'rapPriceId' } },
//             { $unwind: { path: "$rapPriceId", preserveNullAndEmptyArrays: true } },
//             { $lookup: { from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'clientPriceId' } },
//             { $unwind: { path: "$clientPriceId", preserveNullAndEmptyArrays: true } },
//             { $set: { "iavId.rapPriceId": "$rapPriceId" } },
//             { $set: { "iavId.clientPriceId": "$clientPriceId" } },
//             { $unset: ["rapPriceId", "clientPriceId"] },
//             {
//                 $group: {
//                     _id: null,
//                     "uniqueWeight": { "$addToSet": "$weight" },
//                     "color": { "$addToSet": "$colorCategory" },
//                     "company": { "$addToSet": "$companyId" },
//                     "status": { "$addToSet": "$movementStatus" },
//                     "shape": { "$addToSet": "$shape" },
//                     "clarity": { "$addToSet": "$clarity" },
//                     "colorType": { "$addToSet": "$colorType" },
//                     "labs": { "$addToSet": "$labsId" },
//                     "uniqueIav": { "$addToSet": "$iavId.iav" },
//                     "uniquePwv": { "$addToSet": "$iavId.pwv" },
//                     "uniqueDrv": { "$addToSet": "$iavId.drv" },
//                     "uniqueRapPrices": { "$addToSet": "$iavId.rapPriceId.price" },
//                     "uniqueClientPrices": { "$addToSet": "$iavId.clientPriceId.price" },
//                     "devices": { "$addToSet": "$deviceId" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0, "company.name": 1, "company._id": 1, "labs.lab": 1, "uniqueWeight": 1,
//                     "color": 1, "status": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
//                     "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1, "devices.name": 1, "devices._id": 1
//                 }
//             }
//         ]).then(data => data[0])
//
//         return data
//     }
//
//     async getByTag(tagNo: any): Promise<ISku[]> {
//         tagNo = tagNo.replace(/'/g, '"')
//         tagNo = JSON.parse(tagNo)
//
//         let rfId = await rfidModel.find({ rfid: { "$in": tagNo } }).select('_id')
//         //@ts-expect-error
//         rfId = rfId.map(rfid => rfid._id)
//         console.log(rfId);
//
//         return await skuHistoryModel.aggregate([
//             { $match: { rfId: { "$in": rfId }, "isDeleted": false } },
//             { $lookup: { from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId' } },
//             { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
//             { $project: { "deviceId": 0, "labsId": 0, "iavId": 0, "companyId": 0, } }
//         ])
//     }
//
//     async getSkuFromTime( date: any): Promise<any>{
//         if (date) {
//             date = date.replace(/'/g, '"')
//             let cond = { createdAt: { "$gt": new Date(date)}, isDeleted: false }
//             return await skuHistoryModel.aggregate([
//                 { $match: cond },
//                 { $project: { "deviceId": 0, "labsId": 0, "iavId": 0, "companyId": 0 } }
//             ])
//         }
//         return skuHistoryModel.aggregate([{ $project: { "deviceId": 0, "labsId": 0, "iavId": 0, "companyId": 0 } }])
//     }
//
// }