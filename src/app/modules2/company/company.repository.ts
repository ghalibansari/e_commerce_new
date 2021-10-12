import {BaseRepository} from "../BaseRepository";
import companyModel from "./company.model";
import {ICompany, ICompanySave} from "./company.types";
import mongoose, {ClientSession} from "mongoose";
import {IIndexProjection} from "../../interfaces/IRepository";
import {IUser} from "../user/user.types";
import userModel from "../user/user.model";
import {Texts} from "../../constants";
import companyTypeModel from "../company-type/company-type.model";
import companySubTypeModel from "../company-sub-type/company-sub-type.model";
import addressModel from "../address/address.model";
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";
import loanModel from "../loan/loan.model";
import aclModel from "../acl/acl.model";
import activityModel from "../activity/activity.model";
import activityHistoryModel from "../activity-history/activity-history.model";
import businessModel from "../business/business.model";
import alertModel from "../alert/alert.model";
import clientPriceModel from "../client-price/client-price.model";
import deviceModel from "../device/device.model";
import deviceLogModel from "../device-log/device-log.model";
import deviceCommandModel from "../device-command/device-command.model";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import diamondMatchRuleModel from "../diamond-match-rule/diamond-match-rule.model";
import diamondRegistrationModel from "../diamond-registration/diamond-registration.model";
import ledSelectionModel from "../led-selection/led-selection.model";
import loanHistoryModel from "../loan-history/loan-history.model";
import scheduleReportModel from "../schedule-report/schedule-report.model";
import movementActivityModel from "../movement-activity/movement-activity.model";
import permissionModel from "../permission/permission.model";
import rawActivityModel from "../raw-activity/raw-activity.model";
import skuModel from "../sku/sku.model";
import summaryModel from "../summary/summary.model";
import collateralAccountedReportModel from "../summary/collateralAccountedReport/collateralAccountedReport.model";
import collateralInceptionReportModel from "../summary/collateralInceptionReport/collateralInceptionReport.model";
import collateralRemovedReportModel from "../summary/collateralRemovedReport/collateralRemovedReport.model";
import collateralSoldReportModel from "../summary/collateralSoldReport/collateralSoldReport.model";
import collateralAddedReportModel from "../summary/collateralAddedReport/collateralAddedReport.model";
import CollateralUnAccountedReportModel from "../summary/collateralUnaccountedReport/collateralUnaccountedReport.model";
import currentCollateralReportModel from "../summary/currentCollateralReport/currentCollateralReport.model";
import dialyMatchReportModel from "../summary/dailyMatchReport/dialyMatchReport.model";
import diamondMatchReportModel from '../summary/daimondMatchReport/diamondMatchReport.model';
import transporterStorageReportModel from "../summary/transporterStorageReport/transporterStorageReport.model";
import consignmentModel from "../transaction/consignment/consignment.model";
import transactionDmModel from "../transaction/diamond-match/diamond-match.model";
import transactionIavChangeModel from '../transaction/iav-change/iav-change.model';
import transactionImportModel from "../transaction/import/import.model";
import transactionImportReviewModel from '../transaction/import-review/import-review.model';
import transactionSaleModel from "../transaction/sale/sale.model";
import transitModel from "../transit/transit.model";


export class CompanyRepository extends BaseRepository<ICompany> {
    constructor() {
        super(companyModel);
    }

    index = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false};
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
            // 'iavId.isDeleted': false,
            // 'iavId.rapPriceId.isDeleted': false
        };
        let sort = {}, projection: IIndexProjection = {"createdBy.password": 0, "updatedBy.password": 0}

        /*  if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
              sorter = sorter.replace(/'/g, '"')
              sorter = await JSON.parse(sorter)
              sort = { [`${sorter.key}`] : `${sorter.value}`}
          }*/
        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            //const {key, value} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if (v == 'asc') v = 1;
            if (v == 'desc') v = -1;
            sort = {[k]: v}
        } else sort = {createdAt: -1, updatedAt: -1};

        if (search) {
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [
                {'name': _S}, {'contacts.name': _S}, {'contacts.email': _S}, {'addressId.address1': _S}, {'addressId.address2': _S}
                //{'contacts.number': {$regex: /^5535/, $options: "i"}}, // ToDo Need to find Solution for Integer search
            ]
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({key: k, value: v}: any) => {
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                } else if (k === '_id') cond[k] = mongoose.Types.ObjectId(v)
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) {
                    v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val));
                    secondCond[k] = {$in: v}
                } else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) {
                    v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val));
                    cond[k] = {$in: v}
                } else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if (k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if (column && column[0] == '[' && column[column.length - 1] == ']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for (const col of column) projection[col] = 1
        }

        const aggregate = [
            // {$match: cond},
            {
                $lookup: {
                    from: 'companies',
                    localField: 'parentId',
                    foreignField: '_id',
                    as: 'parentId'
                }
            }, {$unwind: {path: "$parentId", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'addressId'
                }
            }, {$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'companytypes',
                    localField: 'companyTypeId',
                    foreignField: '_id',
                    as: 'companyTypeId'
                }
            }, {$unwind: {path: "$companyTypeId", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'companysubtypes',
                    localField: 'companySubTypeId',
                    foreignField: '_id',
                    as: 'companySubTypeId'
                }
            }, {$unwind: {path: "$companySubTypeId", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            }, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'updatedBy',
                    foreignField: '_id',
                    as: 'updatedBy'
                }
            }, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
            // {$unset: ["createdBy.password", "updatedBy.password"]};
        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["createdBy.password", "updatedBy.password"]}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({_id: userId}).populate([{path: 'roleId'}])
        //need to add these conditions
        let cond: any = {}
        // @ts-expect-error
        if (user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["_id"] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await companyModel.aggregate([   //Todo remove all sting in from fields in lookup joints.
            {$match: {...cond, "isDeleted": false}},
            // { $match: { "isDeleted": false } },
            {$lookup: {from: 'companytypes', localField: 'companyTypeId', foreignField: '_id', as: 'companyTypeId'}},
            {$unwind: {path: "$companyTypeId", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'companysubtypes',
                    localField: 'companySubTypeId',
                    foreignField: '_id',
                    as: 'companySubTypeId'
                }
            },
            {$unwind: {path: "$companySubTypeId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'addresses', localField: 'addressId', foreignField: '_id', as: 'addressId'}},
            {$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
            {
                $group: {
                    _id: null,
                    "companyTypes": {"$addToSet": "$companyTypeId"},
                    "companySubTypes": {"$addToSet": "$companySubTypeId"},
                    "city": {"$addToSet": "$addressId.city"},
                    "state": {"$addToSet": "$addressId.state"},
                    "country": {"$addToSet": "$addressId.country"}
                }
            },
            {
                $project: {
                    _id: 0,
                    "companyTypes.shortDescription": 1,
                    "companyTypes._id": 1,
                    "companySubTypes.shortDescription": 1,
                    "companySubTypes._id": 1,
                    "city": 1,
                    "state": 1,
                    "country": 1
                }
            }
        ]).then(data => data[0])

        return data
    }

    create = async (newData: ICompanySave, loggedInUserId: IUser['_id'], session: ClientSession): Promise<ICompany> => {
        let contactEmails: string[] = [];
        for (const contact of newData.contacts) {
            contact.createdBy = contact.updatedBy = loggedInUserId;
            contactEmails.push(contact.email)
        }

        const [, contactEmailData] = await Promise.all([
            await this.checkIds(newData),
            await companyModel.find({'contacts.email': {$in: contactEmails}}).select('_id').lean()
        ])
        if (contactEmailData?.length) throw new Error('contact email already exists')

        //@ts-expect-error
        newData._id = await mongoose.Types.ObjectId()
        newData.createdBy = newData.updatedBy = loggedInUserId;
        newData.address.createdBy = newData.address.updatedBy = loggedInUserId
        //@ts-expect-error
        newData.address._id = newData.addressId = await mongoose.Types.ObjectId()
        const loanAndLtv = {companyId: newData._id, createdBy: loggedInUserId, updatedBy: loggedInUserId}

        const [companyData] = await Promise.all([
            await companyModel.create([newData], {session}).then(([data]) => data),
            // await loanModel.create([loanAndLtv], {session}),
            await addressModel.create([newData.address], {session}),
            await companyClientSettingModel.create([loanAndLtv], {session})
        ])
        return companyData
    }

    delete = async (_id: ICompany['_id'], loggedInUserId: IUser['_id'], session: ClientSession): Promise<number> => {
        const deleted = await companyModel.updateOne({_id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session});
        deleted.nModified && await Promise.all([
            await aclModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await activityModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await activityHistoryModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await alertModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await businessModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await clientPriceModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await companyClientSettingModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await deviceModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await deviceCommandModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await deviceLogModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await diamondMatchModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await diamondMatchRuleModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await diamondRegistrationModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await ledSelectionModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await loanModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await loanHistoryModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await movementActivityModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await permissionModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await rawActivityModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await scheduleReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await skuModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await summaryModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await collateralAccountedReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await collateralAddedReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await collateralInceptionReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await collateralRemovedReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await collateralSoldReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await CollateralUnAccountedReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await currentCollateralReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await dialyMatchReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await diamondMatchReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transporterStorageReportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await consignmentModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transactionDmModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transactionIavChangeModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transactionImportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transactionImportReviewModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transactionSaleModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transactionImportModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await transitModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
            await userModel.updateMany({companyId: _id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session}),
        ])
        return deleted.nModified
    }

    async checkIds({companyTypeId, companySubTypeId, parentId}: ICompany): Promise<void | never> {
        let face: {[x: string]: {}[]} = {
            companyTypeID: [
                {$limit: 1}, {$project: {_id: 1}},
                {$lookup: {
                    from: companyTypeModel.collection.name, as: 'companyType', let: {},
                    pipeline: [
                        {$match: {$expr: {$eq: ['$_id', mongoose.Types.ObjectId(companyTypeId)]}}},
                        {$match: {isDeleted: false}}, {$project: {_id: 1}}
                    ]
                }}
            ],
            companySubTypeID: [
                {$limit: 1}, {$project: {_id: 1}},
                {$lookup: {
                    from: companySubTypeModel.collection.name, as: 'companySubType', let: {},
                    pipeline: [
                        {$match: {$expr: {$eq: ['$_id', mongoose.Types.ObjectId(companySubTypeId)]}}},
                        {$match: {isDeleted: false}}, {$project: {_id: 1}}
                    ]
                }}
            ]
        };

        if (parentId) {
            face['parentID'] = [
                {$match: {$expr: {$eq: ['$_id', mongoose.Types.ObjectId(parentId)]}}},
                {$match: {isDeleted: false}}, {$project: {_id: 1}}
            ]
        }

        const [{companyTypeID, companySubTypeID, parentID}] = await companyModel.aggregate([{$facet: face}])
        const [{companyType: [companyType]}] = companyTypeID
        const [{companySubType: [companySubType]}] = companySubTypeID

        if (!companyType?._id) throw new Error("Invalid CompanyTypeId")
        if (!companySubType?._id) throw new Error("Invalid CompanySubTypeId")
        if (parentId) {
            const [parent] = parentID
            if (!parent?._id) throw new Error("Invalid ParentId")
        }
    }
}