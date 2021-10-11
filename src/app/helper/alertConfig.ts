// //@ts-expect-error
// import alertTypeModel from "../modules/alert-configuration/alert-type/alert-type.model";
// //@ts-expect-error
// import alertCategoryModel from "../modules/alert-configuration/alert-category/alert-category.model";
// //@ts-expect-error
// import alertConfigurationModel from "../modules/alert-configuration/alert-configuration.model";
// //@ts-expect-error
// import alertSubCategoryModel from "../modules/alert-configuration/alert-sub-category/alert-sub-category.model";
// //@ts-expect-error
// import alertLevelModel from "../modules/alert-configuration/alert-level/alert-level.model";
// import userModel from "../modules/user/user.model";
// import { IUser } from "../modules/user/user.types";
// import { BaseHelper } from "../modules/BaseHelper";
// //@ts-expect-error
// import userAlertModel from "../modules/user-alerts/user-alert.model";
// //@ts-expect-error
// import initMB from 'messagebird';
// import { Constant } from "../constants";
// import { userSocketModel } from "../model/userSocket";
// //@ts-expect-error
// import {io} from "../socket"

// //@ts-expect-error
// const messageBird = initMB(Constant.MessageBird_Token)


// export const alertConfig = async (message: string, category: string, subCategory: string, DATA: any, user: IUser['_id'], socketData: any): Promise<void|never> => {
//     const alertConfig = await alertConfigurationModel.aggregate([
//         {$lookup: {from: alertCategoryModel.collection.name, localField: 'category', foreignField: '_id', as: 'category'}},{$unwind: {path: "$category", preserveNullAndEmptyArrays: true}},
//         {$lookup: {from: alertSubCategoryModel.collection.name, localField: 'subCategory', foreignField: '_id', as: 'subCategory'}},{$unwind: {path: "$subCategory", preserveNullAndEmptyArrays: true}},
//         {$lookup: {from: alertLevelModel.collection.name, localField: 'level', foreignField: '_id', as: 'level'}},{$unwind: {path: "$level", preserveNullAndEmptyArrays: true}},
//         {$lookup: {from: alertTypeModel.collection.name, localField: 'type', foreignField: '_id', as: 'type'}},
//         {$match: {isDeleted: false, "category.category": category, "subCategory.subCategory": subCategory }},
//         {$lookup: {from: userModel.collection.name, localField: 'reciever', foreignField: '_id', as: 'reciever'}},
//         {$lookup: {from: userModel.collection.name, localField: 'cc', foreignField: '_id', as: 'cc'}},
//         {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
//         {$sort: {"updatedAt" :-1}},
//         {$limit: 1}
//         //@ts-expect-error
//     ]).then(data => data[0])

//     let ccEmail: any = [], recieverEmail: any = [], userIds: IUser['_id'][] = [], phoneNos: IUser['phone'][] = [] ;
//     alertConfig?.cc.forEach((user:IUser) => {ccEmail.push(user?.email); userIds.push(user._id); phoneNos.push(user.interNationalCode + user.phone)});
//     alertConfig?.reciever.forEach((user: IUser) => {recieverEmail.push(user?.email); userIds.push(user._id); phoneNos.push(user.interNationalCode + user.phone)});

//     let alertCheck = alertConfig?.type?.map(async (type: any) => {
//         if(type?.type === "Email")await new BaseHelper().emailSend('inventory_email',{DATA}, recieverEmail, ccEmail)
//         if(type?.type === "Web Notification") {
//             let userAlerts = {message, userIds, level:alertConfig?.level?.level, createdBy: user, updatedBy: user }
//             userIds.map( async user => {
//                 let socket = await userSocketModel.findOne({userId: user, isDeleted: false}).sort({createdAt: -1})                
//                 if(socket?.socketId) io.sockets?.connected[socket?.socketId]?.emit('refresh',socketData)
//             })
//             await userAlertModel.create(userAlerts)
//         }
//         if(type?.type === "Mobile sms") messageBird.messages.create({
//             originator : 'otp',
//             recipients : [...phoneNos],
//             body : `${message}`
//             //@ts-expect-error
//          }, (error, response) =>{ if(error) throw new Error("message sending failed")})    
//     })

// }
