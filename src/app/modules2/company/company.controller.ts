// // import * as faker from "faker";
// import * as Excel from 'exceljs'
// import { Application, Handler, Request, Response } from "express"
// import lo from "lodash"
// import mongoose from "mongoose"
// import path from 'path'
// import { Messages } from "../../constants"
// import { JsonResponse, JtSaveImage, TryCatch } from "../../helper"
// import { guard } from "../../helper/Auth"
// import { disPlayConfigindex } from "../../helper/displayConfigData"
// import { MongooseTransaction } from "../../helper/MongooseTransactions"
// import AddressBusiness from "../address/address.business"
// import { BaseController } from "../BaseController"
// import CompanySubTypeBusiness from "../company-sub-type/company-sub-type.business"
// import CompanyTypeBusiness from "../company-type/company-type.business"
// import CompanyBusiness from "./company.business"
// import { CompanyRepository } from "./company.repository"
// import { ICompany } from "./company.types"
// import { CompanyValidation } from "./company.validation"

// export class CompanyController extends BaseController<ICompany> {
//     constructor() {
//         super(new CompanyBusiness(), "company", true)
//         this.init()
//     }

//     register = (express: Application) => express.use('/api/v1/company', guard, this.router);

//     init() {
//         const validation: CompanyValidation = new CompanyValidation()
//         this.router.get("/", TryCatch.tryCatchGlobe(this.find))
//         this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
//         this.router.post("/", validation.createCompany, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.create))
//         this.router.post("/save-image", TryCatch.tryCatchGlobe(this.saveImage))
//         this.router.put("/", validation.updateCompany, TryCatch.tryCatchGlobe(this.update))
//         this.router.delete("/", MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.delete))
//         this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findById))
//         this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
//         this.router.get("/get-list", TryCatch.tryCatchGlobe(this.getListBC))
//         this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
//         //this.router.get("/searchBy", TryCatch.tryCatchGlobe(this.searchByKeyBC));
//         // this.router.get("/faker", TryCatch.tryCatchGlobe(this.generateFaker))
//         this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportReport));
//     }

//     async index(req: Request, res: Response): Promise<void> {
//         res.locals = { status: false, message: Messages.FETCH_FAILED };
//         let { data, page }: any = await new CompanyRepository().index(req.query)
//         res.locals = { status: true, page, data, message: Messages.FETCH_SUCCESSFUL };
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
//     }

//     async find(req: Request, res: Response): Promise<void> {
//         let populate = [{ path: 'addressId' }, { path: 'companyTypeId' }, { path: 'companySubTypeId' }, { path: 'parentId' }];
//         await new CompanyController().findBC(req, res, populate)
//     }

//     async saveImage(req: Request, res: Response): Promise<void> {
//         res.locals = { status: false, message: Messages.CREATE_FAILED };
//         const data = await JtSaveImage({
//             image: req.body.image,
//             fileName: req.body.fileName,
//             path: 'Image/company/profile'
//         })
//         res.locals = { status: true, data: data.data, message: Messages.CREATE_SUCCESSFUL };
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.save-image`);
//     }

//     async findById(req: Request, res: Response): Promise<void> {
//         let populate = [{ path: 'addressId' }, { path: 'companyTypeId' }, { path: 'companySubTypeId' }];
//         await new CompanyController().findByIdBC(req, res, populate)
//     }

//     async create(req: Request, res: Response): Promise<void> {
//         const { body, mongoSessionNew: mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as any
//         await mongoSession.withTransaction(async () => res.locals.data = await new CompanyRepository().create(body, loggedInUserId, mongoSession))
//         res.locals.message = Messages.CREATE_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
//     }

//     async update(req: Request, res: Response): Promise<void> {
//         const CompanyBusinessInstance = new CompanyBusiness()
//         const AddressBusinessInstance = new AddressBusiness()
//         //@ts-expect-error
//         let { body, body: { _id, loggedInUser: { _id: loggedInUserId } } }: { body: ICompany } = req
//         let AddressToData = await CompanyBusinessInstance.findOneBB({ _id, isDeleted: false })
//         let AddressData = await AddressBusinessInstance.findOneBB({ _id: AddressToData?.addressId, isDeleted: false })
//         if (AddressToData && AddressData) {
//             await new CompanyController().checkIds(body);
//             //@ts-expect-error
//             body.address.updatedBy = loggedInUserId
//             //@ts-expect-error
//             await AddressBusinessInstance.findAndUpdateBB({ "_id": AddressToData.addressId }, body.address)
//             body.updatedBy = loggedInUserId;
//             body.contacts.forEach(contact => contact.updatedBy = loggedInUserId);
//             let data = await CompanyBusinessInstance.findAndUpdateBB({ _id }, body);
//             if (data) {
//                 res.locals.data = 1;
//                 res.locals.message = Messages.UPDATE_SUCCESSFUL
//             } else {
//                 res.locals.data = 0;
//                 res.locals.message = Messages.UPDATE_FAILED
//             }
//         } else {
//             res.locals.data = 0;
//             res.locals.message = Messages.UPDATE_FAILED
//         }
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
//     }

//     delete: Handler = async (req, res) => {
//         res.locals = { status: false, message: Messages.FAILED };   //Todo use generic failed msg every where in fallback value.
//         const { body, mongoSessionNew: session, body: { loggedInUser: { _id: loggedInUserId } } } = req as any
//         let R: any = {}
//         await session.withTransaction(async () => R = await new CompanyRepository().delete(req.query?._id as string, loggedInUserId, session))
//         if (R) res.locals = { status: true, data: 1, message: Messages.DELETE_SUCCESSFUL }
//         else res.locals = { status: false, data: 0, message: Messages.FAILED };
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.delete`);
//     }

//     async checkIds({ companyTypeId, companySubTypeId, parentId }: ICompany): Promise<void | never> {
//         mongoose.Types.ObjectId.createFromHexString(companyTypeId)
//         mongoose.Types.ObjectId.createFromHexString(companySubTypeId)
//         if (parentId) {
//             mongoose.Types.ObjectId.createFromHexString(parentId)
//             await new CompanyBusiness().findOneBB({ _id: parentId, isDeleted: false }).then(parentIdData => {
//                 if (!parentIdData?._id) throw new Error("Invalid ParentId")
//             })
//         }
//         let [companyTypeIdData, companySubTypeIdData] = await Promise.all([
//             new CompanyTypeBusiness().findOneBB({ _id: companyTypeId, isDeleted: false }),
//             new CompanySubTypeBusiness().findOneBB({ _id: companySubTypeId, isDeleted: false }),
//         ])
//         if (!companyTypeIdData?._id) throw new Error("Invalid CompanyTypeId")
//         if (!companySubTypeIdData?._id) throw new Error("Invalid CompanySubTypeId")
//     }

//     /*searchByKeyBC = async (req: Request, res: Response): Promise<void> => {
//         //@ts-expect-error
//         let { query: { searchBy: searchData } }: { query: { searchBy: string } } = req
//         console.log(searchData, 'search data==============================================================')
//         //let searchData = req.query.searchData
//         let cond = {}, pageSize = '', startIndex = Constant.startIndex
//         if (searchData ?.length && searchData[0] === '{' && searchData[searchData.length - 1] === '}') {
//             searchData = searchData.replace(/'/g, '"');
//             searchData = await JSON.parse(searchData)
//             //@ts-expect-error
//             cond[`${searchData.key}`] = { $regex: searchData.value, $options: "i" };//${searchData.value

//             let column = {
//                 [`${searchData.key}`]: 1                                            //return Cols
//             }
//             res.locals.data = await this.business.findBB(cond, column, {}, pageSize, startIndex)
//             res.locals.message = Messages.FETCH_SUCCESSFUL;
//             await JsonResponse.jsonSuccess(req, res, `{this.url}.findB`)
//         }
//         else {
//             res.locals.data = [];
//             res.locals.message = "Provide Search Data";
//             await JsonResponse.jsonSuccess(req, res, "search");
//         }
//     }*/

//     // async generateFaker(req: Request, res: Response): Promise<void> {
//     //     let {body:{loggedInUser:{_id:loggedInUserId}}, query:{numberOfRecordToBeGenerated}} = req
//     //     let NumberOfRecordToBeGenerated = numberOfRecordToBeGenerated || Constant.NumberOfRecordsToGenerate
//     //     let addresses = []
//     //     for(let i = 0; i<NumberOfRecordToBeGenerated; i++){
//     //         addresses.push({
//     //             address1: faker.address.streetName(),
//     //             address2: faker.address.streetAddress(),
//     //             city: faker.address.city(),
//     //             state: faker.address.state(),
//     //             country: faker.address.country(),
//     //             zipCode: parseInt(faker.address.zipCode()),
//     //             attributes: [{key: "keyExample", value: "valueExample"}],
//     //             createdBy: loggedInUserId,
//     //             updatedBy: loggedInUserId
//     //         })
//     //     }
//     //     //@ts-expect-error
//     //     let addressData = await new AddressBusiness().createBB(addresses)
//     //     let addressIds: any[] = []
//     //     //@ts-expect-error
//     //     addressData.forEach(address => addressIds.push(address._id))
//     //     let dataToBeInsert: any = []
//     //     for(let i = 0; i<NumberOfRecordToBeGenerated; i++){
//     //     dataToBeInsert.push({
//     //             name: faker.company.companyName(),
//     //             addressId: addressIds[i],
//     //             contacts: [{
//     //                 // countryCode: faker.address.countryCode(),
//     //                 number: faker.random.number(),
//     //                 altNumber: faker.random.number(),
//     //                 name: faker.name.findName(),
//     //                 email: faker.internet.email(),
//     //                 jobDescription: faker.name.jobDescriptor(),
//     //                 createdBy: loggedInUserId,
//     //                 updatedBy: loggedInUserId
//     //             }],
//     //             logoUrl: faker.internet.url(),
//     //             companyTypeId: "5ed8dd91865b7535d8eeb615",
//     //             companySubTypeId: "5efb6ed18f0011332c465025",
//     //             parentId: "5efb57ae4d321b4674c03d10",
//     //             attributes: [{key: "keyExample", value: "valueExample"}],
//     //             createdBy: loggedInUserId,
//     //             updatedBy: loggedInUserId,
//     //         })
//     //     }
//     //     res.locals.status = true
//     //     res.locals.data = await new CompanyBusiness().createBB(dataToBeInsert)
//     //     res.locals.message = Messages.CREATE_SUCCESSFUL
//     //     await JsonResponse.jsonSuccess(req, res, `{this.url}.faker`);
//     // }

//     async rollBack(actions: Promise<any>[], err: any): Promise<void | never> {
//         console.log('in rollback*************************************')
//         await Promise.all(actions).then((actions) => {
//             console.log(actions, 'in then]]]]]]]]]]**************************')
//             // throw new Error(err)
//         })
//     }

//     async filter(req: Request, res: Response): Promise<void> {
//         res.locals = { status: false, message: Messages.FETCH_FAILED }
//         let { body: { loggedInUser: { _id: loggedInUserId } } } = req
//         let data = await new CompanyRepository().filter(loggedInUserId)
//         res.locals = { status: true, message: Messages.FETCH_SUCCESSFUL, data }
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
//     }

//     async exportReport(req: Request, res: Response): Promise<void> {
//         let workbook = new Excel.Workbook();
//         req.query.displayConfig = [{ "key": "screen", "value": "ManageCompany" }]
//         let [company, displayconfig] = await Promise.all([
//             await new CompanyRepository().index(req.query),
//             await disPlayConfigindex(req)
//         ])
//         // console.log("---------------DB-----",data);
//         const headerData: any = [];
//         displayconfig[0].config.map((item: any) => {
//             if (item.isActive === true) headerData.push({ name: item.text, filterButton: true })
//         });
//         // let headerData = [{ name: "Company Name", filterButton: true }, { name: "Parent Company", filterButton: true }, { name: "Contact Name", filterButton: true }, { name: "Contact Email", filterButton: true }, { name: "Contatct Number", filterButton: true }, { name: "Contatct AlternateNumber", filterButton: true }, { name: "Job description", filterButton: true }, { name: "Address1", filterButton: true }, { name: "Address2", filterButton: true }, { name: "City", filterButton: true }, { name: "State", filterButton: true }, { name: "Country", filterButton: true }, { name: "Zip Code", filterButton: true }, { name: "CompanyType Code", filterButton: true }, { name: "CompanySubType Code", filterButton: true }]

//         let requiredData = [];
//         // requiredData.push(arr);
//         //@ts-expect-error
//         for (const [i, element] of company.data.entries()) {
//             let arr: any[] = []
//             for (const item of displayconfig[0].config) {
//                 let valKey = item.valKey.split(".")
//                 if (item.isActive === false) continue
//                 if (valKey.includes("contacts")) (element.contacts[0][valKey[1]]) ? arr.push(element.contacts[0][valKey[1]]) : arr.push('');
//                 else if (valKey.length === 1 && valKey[0] === "isActive") (element.isActive === true) ? arr.push("Active") : arr.push("InActive");
//                 else (lo.get(element, valKey)) ? arr.push(lo.get(element, valKey)) : arr.push('')


//                 // if(valKey.length === 1) (element[valKey[0]])?arr.push(element[valKey[0]]) : arr.push('')
//                 // else if(valKey.length === 2 && valKey.includes("contacts")) (element.contacts[0][valKey[1]])? arr.push(element.contacts[0][valKey[1]]) : arr.push('')
//                 // else if(valKey.length === 2) (element[valKey[0]][valKey[1]])? arr.push(element[valKey[0]][valKey[1]]) : arr.push('')
//                 // else if(valKey.length === 3) (element[valKey[0]][valKey[1]][valKey[2]])? arr.push(element[valKey[0]][valKey[1]][valKey[2]]):arr.push('')
//                 // else if(valKey.length === 4) (element[valKey[0]][valKey[1]][valKey[2]][valKey[3]])? arr.push(element[valKey[0]][valKey[1]][valKey[2]][valKey[3]]): arr.push('')

//                 // if (item.text === "Country") arr.push(element.addressId?.country)
//                 // else if (item.text === "City") arr.push(element.addressId?.city)
//                 // else if (item.text === "Contact Person") arr.push(element.contacts[0]?.name)
//                 // else if (item.text === "Contact Number") arr.push(element.contacts[0]?.number)
//                 // else if (item.text === "Job Description") arr.push(element.contacts[0]?.jobDescription)
//                 // else if (item.text === "Email") arr.push(element.contacts[0]?.email)
//                 // else if (item.text === "Company Type") arr.push(element.companyTypeId?.code)
//                 // else if (item.text === "Parent Company") arr.push(element.parentId?.name)
//                 // else if (item.text === "Created By") arr.push(element.createdBy?.firstName)
//                 // else arr.push(element[item.valKey]);
//             }
//             ;
//             // arr = [data[i].name, data[i].parentId?.name, data[i].contacts[0]?.name, data[i].contacts[0]?.email, data[i].contacts[0]?.number, data[i].contacts[0]?.altNumber, data[i].contacts[0]?.jobDescription, data[i].addressId?.address1, data[i].addressId?.address2, data[i].addressId?.city, data[i].addressId?.state,
//             // data[i].addressId?.country, data[i].addressId?.zipCode, data[i].companyTypeId?.code, data[i].companySubTypeId?.code];
//             requiredData.push(arr);
//         }

//         let worksheet = workbook.addWorksheet('Company Export')
//         await new CompanyBusiness().exportExcel(worksheet, headerData, requiredData)
//         let fileName = 'CompanyExport.xlsx'
//         await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
//         res.download(path.join(__dirname, `${fileName}`), (err) => {
//             if (err) {
//                 if (err) {
//                     res.status(400).json({ status: 400, success: false, message: err })
//                 }
//                 console.log("DownloadError", err);
//             }
//         })
//     }
// }