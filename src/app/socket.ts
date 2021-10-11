// import app from './app';
// import socketIo from "socket.io"
// import http from "http"
// import deviceModel from './modules/device/device.model';
// import registerDeviceModel from './modules/register-device/register-device.model';
// import jwt from "jsonwebtoken";
// import {AES} from "crypto-js";
// import {Constant, Errors, Messages} from './constants';
// import companyModel from './modules/company/company.model';
// import deviceCommandModel from './modules/device-command/device-command.model';
// import diamondMatchModel from './modules/diamond-match/diamond-match.model';
// import skuModel from './modules/sku/sku.model';
// import { ISku, skuDmStatusEnum } from './modules/sku/sku.types';
// import { IActivity } from './modules/activity/activity.types';
// import activityModel from './modules/activity/activity.model';
// import { IDiamondMatch } from './modules/diamond-match/diamond-match.types';
// import { IEvent } from './modules/events/events.types';
// import lo, { isObject, update } from "lodash"
// import { RawActivityRepository } from './modules/raw-activity/raw-activity.repository';
// import userModel from './modules/user/user.model';
// import { IRawActivity } from './modules/raw-activity/raw-activity.types';
// import { IUser } from './modules/user/user.types';
// import { SkuRepository } from "./modules/sku/sku.repository"
// import rfidModel from './modules/rfid/rfid.model';
// import logger from './helper/Logger'
// import {query} from "express";
// import { MongooseTransaction } from './helper/MongooseTransactions';
// import mongoose, { ClientSession } from 'mongoose';
// import transactionConsignmentModel from './modules/transaction/consignment/consignment.model';
// import { any, string } from 'joi';
// import { IDevice } from './modules/device/device.types';
// import diamondRegistrationModel from './modules/diamond-registration/diamond-registration.model';
// import deviceSocketLogModel from './modules/device-socket-log/device-socket-log.model';
// import { IDeviceSocketLog } from './modules/device-socket-log/device-socket-log.types';
// import alertMasterModel from './modules/alert-master/alert-master.model';
// import { alertStatusEnum } from './modules/alert/alert.types';
// import alertModel from './modules/alert/alert.model';
// import {startSession} from "mongoose";
// import { userSocketModel } from './model/userSocket';
// import { ErrorCodes } from './constants/ErrorCodes';


// let server = new http.Server(app);  //Todo write all socket separate from main logic and separate out socket service from main controllers.
// let io = socketIo(server)
// let devices: any

// io.on("connection", (socket: any) => {
//     devices = socket
//     io.sockets.connected[socket.id].emit('Welcome', "Your socket id : " + socket.id)
//     socket.emit("Welcome", "welcome to spacecode")

//     socket.on("userRegister", async (user: any) => {
//         let socketData = {}
//         try {
//             createSocketLog(user, 'userRegister')
//             const data = await userRegistier(user, socket.id)
//             console.log(socket.id, "============checking==========");
            
//             console.log(data);
            
//             // triggerLed(user, data)
//             // socket.token = data.token
//             // devices[socket.token] = socket
//             socketData = {body: data,  status: true }
//             if (data) io.sockets.connected[socket.id].emit('userRegister', socketData)
//         }
//         catch (err) { 
//             socketData = {body: user, message: err.message, status: false }   
//             io.sockets.connected[socket.id].emit('userRegister', socketData) 
//          }
//     })

//     socket.on("registerDevice", async (device: any) => {
//         let socketData = {}
//         try {
//             createSocketLog(device, 'registerDevice')
//             const data = await registerDevice(device)
//             triggerLed(device, data)
//             socket.token = data.token
//             devices[socket.token] = socket
//             socketData = {body: data, event_id: device.event_id, status: true }
//             if (data) io.sockets.connected[socket.id].emit('registerDevice', socketData)
//         }
//         catch (err) { 
//             socketData = {body: device, message: err.message, status: false }   
//             socket.emit('registerDevice', socketData) 
//          }
//     })

//     socket.on("accessDrawer", async (body: any) => {
//         let socketData
//         try {
//             socket.token = body.token
//             devices[socket.token] = socket
//             createSocketLog(body, 'accessDrawer')
//             if(!body.fingerPrint) throw new Error("fingerPrint is required")
//             const user = await getUser(body)
//             socketData = {body: user, event_id: body.event_id, status: true }
//             if (user) io.sockets.connected[socket.id].emit('accessedDrawer', socketData)
//         }
//         catch (err) { 
//             socketData = {body, message: err.message, status: false }   
//             socket.emit('accessedDrawer', socketData) 
//         }
//     })

//     socket.on("accessDrawerWithBadge", async (body: any) => {
//         let socketData = {}
//         try {
//             socket.token = body.token
//             devices[socket.token] = socket
//             createSocketLog(body, 'accessDrawerWithBadge')
//             if(!body.badgeId) throw new Error("badgeId is required")
//             const user = await getUser(body)
//             socketData = {body: user, event_id: body.event_id, status: true }
//             if (user) io.sockets.connected[socket.id].emit('accessedDrawer', socketData)
//         }
//         catch (err) { 
//             socketData = {body, message: err.message, status: false }   
//             socket.emit('accessedDrawer', socketData) 
//         }
//     })

//     socket.on("createRawActivity", async (body: any) => {
//         try {
//             createSocketLog(body, 'createRawActivity')
//             socket.token = body.token
//             devices[socket.token] = socket
//             const data = rawActivity(body)
//             io.sockets.connected[socket.id].emit('success','success')
//         }
//         catch (err) { io.sockets.connected[socket.id].emit('failure', err.message) }
//     })

//     socket.on("createRawActivityAsync", async (body: any) => {
//         try {
//             createSocketLog(body, 'createRawActivityAsync')
//             socket.token = body.token
//             devices[socket.token] = socket
//             rawActivity(body)
//             io.sockets.connected[socket.id].emit('success', 'Succcess')
//         }
//         catch (err) { io.sockets.connected[socket.id].emit('failure', err.message) }
//     })

//     socket.on("deviceCommand", async (device: any) => {
//         let socketData={};
//         try {
//             createSocketLog(device, 'deviceCommand')
//             const data = await createDeviceCommand(device)
//             socketData = {body: device, status: true }
//             socket.emit('deviceCommand', socketData)
//         }
//         catch (err) { 
//             socketData = {body: device, message: err.message, status: false }   
//             socket.emit('deviceCommand', socketData) 
//         }
//     })

//     socket.on("diamondMatchRegistration", async (body: any) => {
//         // const transaction: MongooseTransaction = new MongooseTransaction();
//         // let session = await transaction.startTransactionManually();
//         const mongoSession = await startSession()
//         mongoSession.startTransaction();
//         let socketData={};
//         try {
//             await Promise.all([
//                 await createSocketLog(body, 'diamondMatchRegistration'),
//                 await diamondMatch(body, mongoSession)
//             ])
//             .then(async() =>{
//                 socket.token = body.token;  devices[socket.token] = socket;
//                 socketData = {body: body, status: true };
//                 io.sockets.connected[socket.id].emit('diamondMatchRegistration', socketData) 
//                 await mongoSession.commitTransaction();
//             })
//             .catch(async(err) => {
//                 await mongoSession.abortTransaction();
//                 socketData = {body: body, message: err.message, status: false }
//                 io.sockets.connected[socket.id].emit('diamondMatchRegistration',socketData)
//             })
//             .finally(async() => await mongoSession.endSession())

//             // createSocketLog(body, 'diamondMatchRegistration')
//             // socket.token = body.token;
//             // devices[socket.token] = socket;
//             // await diamondMatch(body, session);
//             // socketData = {body: body, status: true };
//             // io.sockets.connected[socket.id].emit('diamondMatchRegistration', socketData);
//             // await transaction.commitTransactionManually(session)
//         } catch (error) {
//             // await transaction.abortTransactionManually(session)
//             socketData = {body: body, message: error.message, status: false }
//             io.sockets.connected[socket.id].emit('diamondMatchRegistration',socketData)
//         }
//     })

//     socket.on("diamondMatch", async (body: any) => {
//         const mongoSession = await startSession()
//         mongoSession.startTransaction();
//         let socketData={};        
//         try {
//             if(typeof body === 'string') body = await JSON.parse(body)
//             let [device, user] = await Promise.all([
//                 await deviceModel.findOne({ token : body.token }, '_id companyId').sort({ createdAt: -1 }),
//                 await userModel.findOne({ '_id': body.user, isDeleted: false },'_id'),
//                 await createSocketLog(body, 'diamondMatch')
//             ])
//             if (!device?._id) throw new Error("device not registered")
//             // user = (user)? user._id: null
//             socket.token = body.token;devices[socket.token] = socket
//             await diamondMatchWithActivity(body, (user)? user._id: null , mongoSession).then(async() =>{
//                 socket.token = body.token;  devices[socket.token] = socket;
//                 socketData = {body: body, status: true };                
//                 io.sockets.connected[socket.id].emit('diamondMatch', JSON.stringify(socketData))
//                 let deviceDetails = await deviceModel.find({ companyId: device?.companyId, isDeleted: false })
//                 await mongoSession.commitTransaction();
//                 if (body.status === "success") for (const device of deviceDetails) {
//                     let token = device?.token;
//                     if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_DIAMOND_MATCH, message: "DiamondMatch with activity", data: null});    
//                 }
//             })
//             .catch(async(err) => {
//                 await mongoSession.abortTransaction();
//                 socketData = {body: body, message: err.message, status: false }
//                 io.sockets.connected[socket.id].emit('diamondMatch',JSON.stringify(socketData))
//             })
//             .finally(async() => await mongoSession.endSession())

//             // await transaction.commitTransactionManually(session)
//             // socketData = {body: body, status: true }
//             // io.sockets.connected[socket.id].emit('diamondMatch', socketData)
//         } catch (error) {
//             // if(error.message !== 'diamond Match is not there') updateErrorDm(body, error.message)
//             await mongoSession.abortTransaction();
//             await mongoSession.endSession();
//             socketData = {body: body, message: error.message, status: false }
//             io.sockets.connected[socket.id].emit('diamondMatch', JSON.stringify(socketData))
//         }
//     })

//     socket.on("triggeredLed", async (body: any) => {
//         try {
//             createSocketLog(body, 'triggeredLed')
//             socket.token = body.token
//             devices[socket.token] = socket
//             triggeredLed(body)
//             io.sockets.connected[socket.id].emit('success', "success")
//         }
//         catch (err) { io.sockets.connected[socket.id].emit('failure', err.message) }
//     })

//     socket.on("ledTrigger", async (body: any) => {
//         try {
//             createSocketLog(body, 'ledTrigger')
//             socket.token = body.token
//             devices[socket.token] = socket
//             let data = ledTrigger(body)
//             io.sockets.connected[socket.id].emit('success', "success")
//         }
//         catch (err) { io.sockets.connected[socket.id].emit('failure', err.message) }
//     })

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });

// })

// const userRegistier = async (body: any, socketId: any): Promise<any> => {
//     const user = await userModel.findOne({email: body.email, isDeleted: false},'_id firstName email')
//     if(!user) throw Errors.INVALID_USER
//     const userSocket = await userSocketModel.findOne({userId: user?._id, isDeleted: false })
//     let userSocketUpdated = (!userSocket)? await userSocketModel.create({userId: user?._id, socketId, createdBy: user?._id, updatedBy: user?._id }) : 
//         await userSocketModel.findOneAndUpdate({userId: user?._id}, {socketId, updatedBy: user?._id }, {new: true})
//     return user
//     // return user

// }

// const createSocketLog = async (body: any, eventName: string): Promise<void> => {
//     let device, userData
//     if(body) device = (body.serialNumber) ? await deviceModel.findOne({ serialNumber: body.serialNumber }) : await deviceModel.findOne({ token: body.token })
//     if(body.user)  userData = userModel.findOne({ '_id': body.user, isDeleted: false }).select('_id')
//     //@ts-expect-error
//     let logData: IDeviceSocketLog = { deviceId: device?._id, eventName: eventName, eventBody: JSON.stringify(body), createdBy: userData?._id }
//     await deviceSocketLogModel.create(logData)
// }

// async function getUser(body: any): Promise<IUser> {
//     let user
//     let device = await deviceModel.findOne({ token : body.token }).sort({ createdAt: -1 })
//     if (!device?.token) throw new Error("Invalid Token")
//     if(body.fingerPrint) {
//         user = await userModel.findOne({ 'fingerPrint': {$elemMatch: {data : body.fingerPrint}}, isDeleted: false },'_id firstName lastName fingerPrint badgeId')
//         if(!user?._id) throw new Error("Invalid fingerPrint")
//         if(!device?.userIds.includes(user?._id)) throw new Error("user doesn't have access")
//     }
//     else {
//         user = await userModel.findOne({badgeId: body.badgeId},'_id firstName lastName fingerPrint badgeId')
//         if(!user?._id) throw new Error("Invalid badgeId")
//         if(!device?.userIds.includes(user?._id)) throw new Error("user doesn't have access")
//     }
//     return user
// }

// async function updateErrorDm(body: any, message: string): Promise<any> {
//     let rfid = await rfidModel.findOne({ rfid: String(body.tagNo), isDeleted: false }).sort({ createdAt: -1 })
//     let sku = await skuModel.findOne({ _id: rfid?.skuId, dmGuid: body.dmGuId })
//     if (!sku?._id) throw new Error("diamondMatch not registered")
//     let dmId: any = await diamondMatchModel.findOne({ skuId: sku._id, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
//     let errorLog = {message, createdBy: body.user, createdAt: new Date()}
//     if(dmId)await diamondMatchModel.findOneAndUpdate({skuId : sku?._id}, {$push: {error: errorLog}}, {new: true}).sort({ createdAt: -1 })
// }

// async function registerDevice(body: any): Promise<any>
// {
//     if(typeof body === 'string') body = await JSON.parse(body)
//     let token
//     let device = await deviceModel.findOne({serialNumber: body.serialNumber, isDeleted: false}).sort({createdAt:-1})
//     if (device?._id && device?.token) return device
//     if (device?._id && device?.companyId) {
//         //@ts-expect-error
//         const jwt_token_encrypt = await jwt.sign({ _id: device.companyId?._id, firstName: device.companyId?.name }, Constant.jwt_key)
//         const jwt_token = await AES.encrypt(jwt_token_encrypt, Constant.secret_key).toString()
//         token = jwt_token
//     }
//     else throw new Error("Invalid serialNumber")
//     let sort = { createdAt: -1 }
//     return deviceModel.findOneAndUpdate({serialNumber: body.serialNumber}, {token}, {new: true, sort});
// }

// async function triggeredLed(body: any): Promise<void>
// {
//     if (typeof body === 'string') body = await JSON.parse(body)
//     const transaction: MongooseTransaction = new MongooseTransaction();
//     let session = await transaction.startTransactionManually()
//     try {
//         let user = await checkDevice(body)
//         // let activity = []
//         let tags = body.info.map((value: any) => { if (value.status === true) return String(value.tagNumber) }).filter(Boolean);
//         let skuData = await rfidModel.find({ rfid: { $in: tags }, isDeleted: false }).sort({ createdAt: -1 }).populate([{ path: "skuId" }]).select({ "skuId._id": 1, "_id": 0 })
//         let data = await rfidModel.aggregate([
//             {$match: { rfid: { $in: tags }}},
//             {$lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
//             {$unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
//             {$group: {_id: null,"skuIds": { "$addToSet": "$skuId._id" }}},
//             {$project: {_id: 0,skuIds:1 }} 
//         ]).then(data => data[0])

//         let activityData = await activityModel.updateMany({status: "LED TRIGGER", skuId: {$in: data.skuIds}}, {status: "LED TRIGGERED", updatedBy: user}, {new: true, session})
//         console.log(activityData);
        
                
//         // let skuObj: ISku[] = skuData.map((data: any) => data.skuId)
//         // for (const sku of skuObj) {
//         //     let dmId: any = await diamondMatchModel.findOne({ skuId: sku._id, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
//         //     dmId = (!dmId) ? null : dmId._id
//         //     let activityData = {
//         //         companyId: sku.companyId, skuId: sku._id, labsId: sku.labsId, iavId: sku.iavId,
//         //         userId: user, dmId, status: "LED", createdBy: user, updatedBy: user, comments: body.comments
//         //     }
//         //     activity.push(activityData)
//         // }
//         // let activityData = await activityModel.create(activity, { session })
//         await transaction.commitTransactionManually(session)
//         let socketData = {status: true, body}
//         if(body.token && devices[body.token]) devices[body.token].emit("triggeredLed", socketData)
//     } catch (error) {
//         await transaction.abortTransactionManually(session)
//         let socketData = {status: false, message: error.message, body}
//         if(body.token && devices[body.token]) devices[body.token].emit("triggeredLed", socketData)
//     }
// }

// async function createDeviceCommand(body: any): Promise<any>
// {
//     if(typeof body === 'string') body = await JSON.parse(body)
//     let [device, user] = await Promise.all([
//         deviceModel.findOne({ token : body.token }).sort({ createdAt: -1 }),
//         userModel.findOne({ '_id': body.user, isDeleted: false })
//     ])
//     if(!device) throw new Error("device not registered")
//     if(!device?.userIds.includes(body.user)) throw new Error("user doesn't have access")
//     if(!user) throw new Error("Invalid User")
//     body.companyId = user.companyId
//     body.deviceId = device._id
//     body.createdBy = body.updatedBy = user._id
//     return await deviceCommandModel.create(body)
// }

// async function checkDevice(body: any): Promise<IUser['_id']>
// {
//     if(typeof body === 'string') body = await JSON.parse(body)
//     let [device, user] = await Promise.all([
//         deviceModel.findOne({ token : body.token }).sort({ createdAt: -1 }),
//         userModel.findOne({ '_id': body.user, isDeleted: false }).select('_id')
//     ])
//     if (!device?._id) throw new Error("device not registered")
//     if(!device?.userIds.includes(body.user)) throw new Error("user doesn't have access")
//     if (!user?._id) throw new Error("Invalid User")
//     return user?._id
// }

// async function checkDmDevice(body: any): Promise<any>
// {
//     if(typeof body === 'string') body = await JSON.parse(body)
//     let [device, user] = await Promise.all([
//         deviceModel.findOne({ token : body.token }).sort({ createdAt: -1 }),
//         userModel.findOne({ '_id': body.user, isDeleted: false }).select('_id')
//     ])
//     if (!device?._id) throw new Error("device not registered")
//     if(user) return user?._id;
//     return null
// }

// async function ledTrigger(body: any): Promise<any> {
//     const transaction: MongooseTransaction = new MongooseTransaction();
//     let session = await transaction.startTransactionManually()
//     try {
//         if (typeof body === 'string') body = await JSON.parse(body)
//         let user = await checkDevice(body), serialNumber, socketData = []
//         let rfid: any = await rfidModel.find({ rfid: body.tagNo, isDeleted: false }, '_id')
//         rfid = rfid.map((sku: any) => sku._id)
//         let activity: any = []
//         let skuData = await skuModel.find({ rfId: rfid, isDeleted: false }).populate([{ path: "rfId" }])
//         for (const sku of skuData) {
//             let data: any = {}
//             if (!sku.reader || !sku.reader.serial) throw new Error("Stone not in cabinet")
//             data.serialNumber = sku.reader?.serial
//             // @ts-ignore
//             data.tag = sku.rfId?.rfid
//             data.drawer = sku.reader.drawer
//             let dmId: any = await diamondMatchModel.findOne({ skuId: sku._id, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
//             dmId = (!dmId) ? null : dmId._id
//             let activityData = {
//                 companyId: sku.companyId, skuId: sku._id, labsId: sku.labsId, iavId: sku.iavId,
//                 userId: user, dmId, status: "LED TRIGGER", createdBy: user, updatedBy: user, comments: body.comments
//             }
//             activity.push(activityData)
//             socketData.push(data)
//         }
//         await activityModel.create(activity)
//         let result = socketData.filter(function (a) {
//             var key = a.tag + '|' + a.drawer;
//             //@ts-expect-error
//             if (!this[key]) { this[key] = true; return true; }
//         }, Object.create(null));
//         // return result
//         await transaction.commitTransactionManually(session)
//         let responseData = {event_id : body.event_id, status: true, body: result}
//         if(body.token && devices[body.token]) devices[body.token].emit("triggerLed", responseData)
//     } catch (error) {
//         await transaction.abortTransactionManually(session)
//         let socketData = {event_id : body.event_id, message: error.message, status: false, body }
//         if(body.token && devices[body.token]) devices[body.token].emit("triggerLed", socketData)
//     }
// }

// // async function diamondMatch(body: any): Promise<IDiamondMatch>
// // {
// //     if(typeof body === 'string') body = await JSON.parse(body)
// //     let user = await checkDevice(body), activity, diamondMatch
// //     let rfId = await rfidModel.findOne({ rfid: body.stone, isDeleted: false }).sort({ createdAt: -1 })
// //     body.skuId = rfId?.skuId
// //     body.createdBy = body.updatedBy = user
// //     if (!rfId?._id) throw new Error("Invalid rfid")
// //     let skuData = await skuModel.findOne({ _id: body.skuId, isDeleted: false })
// //     if (!skuData) throw new Error("Invalid skuId")
// //     let dm = await diamondMatchModel.findOne({ skuId: body.skuId, isDeleted: false }).sort({ createdAt: -1 })
// //     let dmId = (dm)? dm.dmId : null
// //     let activityData = {
// //         companyId: skuData?.companyId, skuId: body.skuId, labsId: skuData?.labsId, iavId: skuData?.iavId,
// //         userId: user, dmId, status: body.status, createdBy: user, updatedBy: user, comments: body.comments
// //     }
// //     delete body.stone, delete body.serialNumber, delete body.token, delete body.fingerPrint
// //     if (dm?._id) {
// //         [activity, diamondMatch] = await Promise.all([
// //             //@ts-expect-error
// //             activityModel.create(activityData),
// //             diamondMatchModel.findOneAndUpdate({ skuId: body.skuId }, body, { new: true })
// //         ])
// //         return diamondMatch
// //     }
// //     console.log(body);

// //     [activity, diamondMatch] = await Promise.all([
// //         //@ts-expect-error
// //         activityModel.create(activityData),
// //         diamondMatchModel.create(body)
// //     ])
// //     return diamondMatch
// // }

// async function diamondMatchWithActivity(body: any,user: IUser['_id']|null, session: ClientSession): Promise<any> {
//     if (typeof body === 'string') body = JSON.parse(body)
//     let dmId
//     let rfid = await rfidModel.findOne({ rfid: String(body.tagNo), isDeleted: false }).sort({ createdAt: -1 })
//     let sku = await skuModel.findOne({ _id:rfid?.skuId})
//     if (!sku?._id) throw new Error("TagNo is Not assigned to Stones ")
//     // let dmId: any = await diamondMatchModel.findOne({ skuId: sku._id, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
//     let DmExists=await diamondMatchModel.findOne({skuId : sku?._id, status: "NOTMATCHED"});
//     if(!DmExists) DmExists = await diamondMatchModel.create({skuId : sku?._id,companyId: sku.companyId,createdBy:user,updatedBy:user})
//     if(body.status === "success")
//     {
//         dmId = await diamondMatchModel.updateMany({skuId : sku?._id, status: "NOTMATCHED"}, {status: "MATCHED" , actionType:body.actionType,foundDmGuid:body.foundDmGuid}, {new: true, session})
//         if(dmId.nModified === 0) throw new Error("Diamond Match Failed")
//         let activityData = {
//             companyId: sku.companyId, skuId: sku._id, labsId: sku.labsId, iavId: sku.iavId,
//             userId: user, dmId: DmExists._id, status: "MATCHED", createdBy: user, updatedBy: user, comments: body.comments
//         }
//         return await activityModel.create([activityData], {session}).then(activity => activity[0])    
//     }
//     if(body.status === "failure") {
//         let errorLog = {code: body.error.code, description: body.error.description, createdBy: body.user, createdAt: new Date()}
//         dmId = await diamondMatchModel.findOneAndUpdate({skuId : sku?._id, status: "NOTMATCHED"}, {$push: {error: errorLog},actionType:body.actionType,foundDmGuid:body.foundDmGuid}, {new: true, session}).sort({createdAt:-1})
//         if(!dmId)throw new Error("Diamond Match Failed")
//     }
// }

// async function diamondMatch(body: any, session: ClientSession): Promise<ISku|null|undefined> {
//     if (typeof body === 'string') body = JSON.parse(body)
//     let user = await checkDmDevice(body) , data: any;
//     let rfid = await rfidModel.findOne({ rfid: String(body.tagNo), isActive: true }).sort({ createdAt: -1 })
//     if (!rfid) throw new Error("tagNo not registered")
//     let sku = await skuModel.findOne({ _id: rfid?.skuId, isDeleted: false })
//     let update = { "dmGuid": body.dmGuId, "dmStatus": skuDmStatusEnum.COMPLETED, updatedBy: user }    
//     if(body.status === "success"){        
//         [data] = (body.actionType === "REGISTRATION") ? await Promise.all([
//             diamondRegistrationModel.create([{ skuId: rfid?.skuId, status: body.status, companyId: sku?.companyId, dmGuid: body.dmGuId, action: "REGISTRATION", createdBy: user, updatedBy: user }], {session}),
//             skuModel.findOneAndUpdate({ _id: rfid?.skuId }, update, { new: true, session })
//         ]) : await Promise.all([
//             diamondRegistrationModel.create([{ skuId: rfid?.skuId, companyId: sku?.companyId, status: body.status, dmGuid: body.dmGuId, action: "ALTER_REGISTRATION", createdBy: user, updatedBy: user }], {session}),
//         ]);
//         let alertType = await alertMasterModel.findOne({ status: 'DIAMOND MATCH REGISTRATION', alertType: "USERGENERATED" }, { createdAt: -1 })// to do alertType as Usergenerated
//         let activityData = {
//             companyId: sku?.companyId, skuId: sku?._id, labsId: sku?.labsId, iavId: sku?.iavId,
//             userId: user, status: alertStatusEnum.DIAMOND_MATCH_REGISTRATION, createdBy: user, updatedBy: user, comments: body.comments
//         };
//         const alertData = {userId: user, message: "DM registration", skuId: sku?._id, alertId: alertType?._id, status: alertStatusEnum.DIAMOND_MATCH_REGISTRATION, createdBy: user, updatedBy: user}
//         let [ activity , alert] = await Promise.all([
//             activityModel.create([activityData], { session }).then(activity => activity[0]),
//             alertModel.create([alertData], { session }).then(alert => alert[0])
//         ]);
//     }
//     else {
//         let errorLog = {code: body.error.code, description: body.error.description, createdBy: body.user, createdAt: new Date()};
//         data = await diamondRegistrationModel.create([{ skuId: rfid?.skuId,  companyId: sku?.companyId,dmGuid: body.dmGuId, status: body.status, action: body.actionType, error:errorLog,createdBy: user, updatedBy: user }], {session});
//     }
//     return data
// }


// // async function diamondMatch(body: any): Promise<IDiamondMatch> {
// //     let user = await checkDevice(body)
// //     let skuData = await skuModel.findById({ _id: body.skuId })
// //     if (!skuData?._id) throw new Error("Invalid skuId")
// //     let dmId: any = await diamondMatchModel.findOne({ skuId: body.skuId, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
// //     dmId = (!dmId) ? null : dmId._id
// //     let activityData = {
// //         companyId: skuData?.companyId, skuId: body.skuId, labsId: skuData?.labsId, iavId: skuData?.iavId,
// //         userId: user, dmId, status: body.status, createdBy: user, updatedBy: user, comments: body.comments
// //     }
// //     let [activity, diamondMatch] = await Promise.all([
// //         //@ts-expect-error
// //         activityModel.create(activityData),
// //         diamondMatchModel.findOneAndUpdate({ _id: body._id }, body, { new: true })
// //     ])
// //     return diamondMatch

// // }

// async function rawActivity(body: any): Promise<void>
// {
//     const transaction: MongooseTransaction = new MongooseTransaction();
//     let session = await transaction.startTransactionManually();
//     try {
//         console.log("Raw Activity 1 ="+body);
//         console.log("type.............",typeof body);
//         if(typeof body === 'string') body = await JSON.parse(body);
//         body.user = await checkDevice(body)
//         body.companyId = await userModel.findOne({ '_id': body.user, isDeleted: false }).select('companyId').then(user => user?.companyId);
//         body.isTagValidated = true, body.isCountChecked = false;
//         body.createdBy = body.updatedBy = body.user;
//         body.timestamp = new Date(Number(body.timestamp));
//         body.transactionId = "SCMA-" + new Date().toISOString();
//         let totalStones = [];
//         console.log("eventInventory ..................................=  226");
//         console.log("totalStones 2 ="+body);//u r getting aeeror here no in logger
//         let match = { "reader.serial": body?.reader?.serial || 0, "reader.drawer": body?.reader?.drawer||0, isDeleted: false }
//         console.log("eventInventory ..................................=  228");
//         const eventIn = body.events.find((item: IEvent) => { return item.EventType === "IN" });
//         const eventOut = body.events.find((item: IEvent) => { return item.EventType === "OUT" });
//         const eventInventory = body.events.find((item: IEvent) => { return item.EventType === "INVENTORY" });
//         console.log("eventInventory ..................................=  232");
//         let previous_data = await new RawActivityRepository().findPrevious(match);
//         let oldInventory = (previous_data?.events) ? previous_data.events?.find((item: IEvent) => { return item.EventType === "INVENTORY" }) : { EventType: "INVENTORY", stones: [] };
//         totalStones.push(eventIn.stones); totalStones.push(oldInventory?.stones);
//         console.log("eventInventory ..................................=  237");
//         console.log("totalStones 4= "+body);
//         totalStones = totalStones?.filter((item: any) => eventOut?.stones?.indexOf(item) == -1);
//         if (eventInventory.stones.length === oldInventory?.stones.length + eventIn.stones.length - eventOut.stones.length) body.isCountChecked = true;
//         if (!lo.differenceBy(totalStones, eventInventory.stones)) body.isTagValidated = false;
//         else {
//             let count = await new SkuRepository().findCountBR({ 'tagId': { $in: eventInventory.stones } });
//             if (count !== eventInventory.stones.length) body.isTagValidated = false
//         }
//         console.log("eventInventory ..................................=  240");
//         let data = await new RawActivityRepository().create(eventIn, eventOut, eventInventory, body, session);
//         await transaction.commitTransactionManually(session);
//         let socketData = {event_id : body.event_id, status: true, data};
//         if(body.token && devices[body.token]) devices[body.token].emit("createRawActivity", socketData)
//     } catch (error) {
//         await transaction.abortTransactionManually(session);
//         let socketData = {event_id : body.event_id,  message: error.message, status: false, data:body };
//         if(body.token && devices[body.token]) devices[body.token].emit("createRawActivity", socketData)
//     }
// }

// const triggerLed = async(body: any, data: IDevice) : Promise<void> => {
//     let activity = await activityModel.aggregate([
//         {$match: {status: "LED TRIGGER"}},
//         {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}}, {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
//         {$lookup: {from: 'rfids', localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId'}}, {$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true}},
//         {$match: {"skuId.reader.serial": body.serialNumber}},
//         {$sort: {createdAt: -1}}
//     ])
//     console.log(activity.length, "====>>>>>>>");
    
//     let array: any = [], socketData: any = [] ;
//     for (const item of activity) {
//         if(array.includes(String(item.skuId._id))) continue;
//         array.push(String(item.skuId._id));
//         let data: any = {};
//         data.serialNumber = item.reader?.serial;
//         data.tag = item.skuId.rfId.rfid;
//         data.comments = item.comments;
//         data.drawer = item.skuId.reader.drawer;
//         socketData.push(data)
//     }
//     if(socketData.length > 0 && devices[data.token]) devices[data.token].emit("triggerLed", socketData)
// }


// // export default class Server {
// //     server: http.Server
// //     io: SocketIO.Server;

// //     constructor(){
// //         this.server = new http.Server(app);
// //         this.io = socketIo(this.server)

// //         // this.io.on("connection", (socket: SocketIO.Socket) => {
// //         //     this.io.sockets.connected[socket.id].emit('Welcome', "Your socket id : " + socket.id)

// //         //     socket.on("registerDevice", async (device) => {
// //         //         try {
// //         //             const data = await this.registerDevice(device)
// //         //             if (data) socket.emit('success', data)
// //         //         }
// //         //         catch (err) {socket.emit('failure', err.message) }
// //         //     })

// //         //     socket.on("createRawActivity", async (rawActivity) => {
// //         //         try {
// //         //             const data = await this.rawActivity(rawActivity)
// //         //             if (data) socket.emit('success', data)
// //         //         }
// //         //         catch (err) { socket.emit('failure', err.message) }
// //         //     })

// //         //     socket.on("deviceCommand", async (device) => {
// //         //         try {
// //         //             const data = await this.createDeviceCommand(device)
// //         //             if (data) socket.emit('success', data)
// //         //         }
// //         //         catch (err) {socket.emit('failure', err.message) }
// //         //     })

// //         //     socket.on("diamondMatch", async (diamondMatch) => {
// //         //         try {
// //         //             const data = await this.diamondMatch(diamondMatch)
// //         //             if (data) socket.emit('success', data)
// //         //         }
// //         //         catch (err) {socket.emit('failure', err.message) }
// //         //     })

// //         //     socket.on("triggerLed", async (skuIds) => {
// //         //         try {
// //         //             const data = await this.ledTrigger(skuIds)
// //         //             if (data) socket.emit('success', data)
// //         //         }
// //         //         catch (err) { socket.emit('failure', err.message) }
// //         //     })

// //         //     socket.on('disconnect', () => {
// //         //         console.log('user disconnected');
// //         //     });
// //         // })

// //         /*io.of('/api/v1/register-device').on("connection", (socket: SocketIO.Socket) => {
// //             socket.emit("welcome", "Hello and welcome to the SpaceCode")
// //             socket.on("registerDevice", async (device) => {
// //                 try {
// //                     const data = await this.registerDevice(device)
// //                     if (data) socket.emit('success', data)
// //                 }
// //                 catch (err) {socket.emit('failure', err.message) }
// //             })
// //         })

// //         io.of('/api/v1/device-command').on("connection", (socket: SocketIO.Socket) => {
// //             socket.emit("welcome", "Hello and welcome to the SpaceCode")
// //             socket.on("deviceCommand", async (device) => {
// //                 try {
// //                     const data = await this.createDeviceCommand(device)
// //                     if (data) socket.emit('success', data)
// //                 }
// //                 catch (err) {socket.emit('failure', err.message) }
// //             })
// //         })

// //         io.of('/api/v1/diamond-match').on("connection", (socket: SocketIO.Socket) => {
// //             socket.emit("welcome", "Hello and welcome to the SpaceCode")
// //             socket.on("diamondMatch", async (diamondMatch) => {
// //                 try {
// //                     const data = await this.diamondMatch(diamondMatch)
// //                     if (data) socket.emit('success', data)
// //                 }
// //                 catch (err) {socket.emit('failure', err.message) }
// //             })
// //         })

// //         io.of('/api/v1/sku/ledTrigger').on("connection", (socket: SocketIO.Socket) => {
// //             socket.emit("welcome", "Hello and welcome to the SpaceCode")
// //             socket.on("triggerLed", async (skuIds) => {
// //                 try {
// //                     const data = await this.ledTrigger(skuIds)
// //                     if (data) socket.emit('success', data)
// //                 }
// //                 catch (err) { socket.emit('failure', err.message) }
// //             })
// //         })

// //         io.of('/api/v1/raw-activity').on("connection", (socket: SocketIO.Socket) => {
// //             socket.emit("welcome", "Hello and welcome to the SpaceCode")
// //             socket.on("createRawActivity", async (rawActivity) => {
// //                 try {
// //                     const data = await this.rawActivity(rawActivity)
// //                     if (data) socket.emit('success', data)
// //                 }
// //                 catch (err) { socket.emit('failure', err.message) }
// //             })*/
// //         // })

// //     }

// //     async registerDevice(body: any): Promise<any> {
// //         let populate = [{path: 'companyId'}];
// //         let device = await deviceModel.findOne({serialNumber: body.serialNumber, isDeleted: false}).populate(populate)
// //         let registerDevice = await registerDeviceModel.findOne({serialNumber: body.serialNumber, isDeleted: false})
// //         if(registerDevice) return registerDevice
// //         if(device?._id && device?.companyId ) {
// //             //@ts-expect-error
// //             const jwt_token_encrypt = await jwt.sign({_id: device.companyId?._id, firstName:device.companyId?.name}, Constant.jwt_key)
// //             const jwt_token = await AES.encrypt(jwt_token_encrypt, Constant.secret_key).toString()
// //             body.token = jwt_token
// //         }
// //         else throw new Error("Invalid serialNumber")
// //         return await registerDeviceModel.create(body)
// //     }

// //     async createDeviceCommand(body: any): Promise<any> {
// //         body.createdBy = body.updatedBy =  await this.checkDevice(body)
// //         let [deviceData, companyData] = await Promise.all([
// //             deviceModel.findOne({_id: body.deviceId, isDeleted: false}),
// //             companyModel.findOne({_id: body.companyId, isDeleted: false})
// //         ])
// //         if(!deviceData?._id) throw new Error("Invalid deviceId")
// //         if(!companyData?._id) throw new Error("Invalid companyId")
// //         return await deviceCommandModel.create(body)
// //     }

// //     async checkDevice(body: any): Promise<IUser['_id']> {
// //         let serialNumber = (body.serialNumber)? body.serialNumber : body.reader.serial
// //         let [device, user] = await Promise.all([
// //             registerDeviceModel.findOne({ serialNumber }).sort({ createdAt: -1 }),
// //             userModel.findOne({'fingerPrint': body.fingerPrint, isDeleted: false}).select('_id')
// //         ])
// //         if (body.token !== device?.token) throw new Error("Invalid Token")
// //         if(!user?._id) throw new Error("Invalid User")
// //         return user?._id
// //     }

// //     async ledTrigger(body: any): Promise<IActivity[]> {
// //         let activity: any = []
// //         let user = await this.checkDevice(body)
// //         for (const skuId of body.skuIds) {
// //             let skuData: ISku| null = await skuModel.findOne({_id:skuId})
// //             let dmId: any = await diamondMatchModel.findOne({skuId, $or: [ { status: "MATCHED" }, { status: "NOTMATCHED" } ] }).sort({createdAt: -1}).select('_id').lean()
// //             dmId = (!dmId)? null: dmId._id
// //             let activityData = {companyId: skuData?.companyId, skuId, labsId: skuData?.labsId, iavId: skuData?.iavId,
// //                 userId: user, dmId, status: body.status, createdBy: user, updatedBy: user, comments: body.comments}
// //             activity.push(activityData)
// //         }
// //         //@ts-expect-error
// //         return await activityModel.create(activity)
// //     }

// //     async diamondMatch(body: any): Promise<IDiamondMatch> {
// //         let user = await this.checkDevice(body)
// //         let skuData = await skuModel.findById({_id:body.skuId})
// //         if (!skuData?._id) throw new Error("Invalid skuId")
// //         let dmId: any = await diamondMatchModel.findOne({skuId: body.skuId, $or: [ { status: "MATCHED" }, { status: "NOTMATCHED" } ] }).sort({createdAt: -1}).select('_id').lean()
// //         dmId = (!dmId)? null : dmId._id
// //         let activityData = {
// //             companyId: skuData?.companyId, skuId: body.skuId, labsId: skuData?.labsId, iavId: skuData?.iavId,
// //             userId: user, dmId, status: body.status, createdBy: user, updatedBy: user, comments: body.comments
// //         }
// //         let [activity, diamondMatch] = await Promise.all([
// //             //@ts-expect-error
// //             activityModel.create(activityData),
// //             diamondMatchModel.findOneAndUpdate({_id: body._id},body, {new:true})
// //         ])
// //         return diamondMatch

// //     }

// //     async rawActivity(body: any): Promise<IRawActivity> {
// //         body.user = await this.checkDevice(body)
// //         body.isTagValidated = true, body.isCountChecked = false
// //         body.createdBy = body.updatedBy = body.user
// //         body.transactionId = "SCMA-" + new Date().toISOString()
// //         let totalStones = [];
// //         let match = { "reader.serial": body.reader.serial, "reader.drawer": body.reader.drawer, isDeleted: false }
// //         const eventIn = body.events.find((item: IEvent) => { return item.EventType === "IN" });
// //         const eventOut = body.events.find((item: IEvent) => { return item.EventType === "OUT" });
// //         const eventInventory = body.events.find((item: IEvent) => { return item.EventType === "INVENTORY" });
// //         let previous_data =  await new RawActivityRepository().findPrevious(match)
// //         let oldInventory = (previous_data?.events) ? previous_data.events?.find((item: IEvent) => { return item.EventType === "INVENTORY" }) : { EventType: "INVENTORY", stones: [] }
// //         totalStones.push(eventIn.stones); totalStones.push(oldInventory?.stones);
// //         totalStones = totalStones.filter((item:any) => eventOut.stones.indexOf(item) == -1);
// //         return await new RawActivityRepository().create(eventIn,eventOut,body)
// //     }

// // }

// // export default new Server().server;

// export { server, io, devices }


