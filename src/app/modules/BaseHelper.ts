// // import { NotificationService, IMailOptions } from "../helper";

// import { IMailOptions } from "app/helper";
// import { NotificationService } from "app/helper/NotificationService";
// import * as _ from "lodash";
// import { TemplateRepository } from "./template/template.repository";
// import




// // import TemplateBusiness from "../modules2/template/template.business";
// // import TemplateBusiness from "../modules2"
// // import { IRecipient } from "../modules2/recipient/recipient.types";


// /*
// * This class use for common functionality which need accesses repo
// * */
// export class BaseHelper {    //Todo remove any from params
//     async emailSend(slugName: string = '', params: object = {}, to: string = '', cc: string = '', bcc: string = '', attachments: object[] = []) {
//         const mail: NotificationService = new NotificationService();
//         ////@ts-expect-error
//         new TemplateRepository();
//         if (slugName) {
//             ////@ts-expect-error
//             const template = await new TemplateRepository().findOneBR({ 'slug': slugName, isActive: true, isDeleted: false })

//             //@ts-expect-error
//             const recipients = await new RecipientRepository().findBR({ 'templateId': template._id }, {}, {}, 9999, 0, []) //Todo find reverse populate in mongo
//             let emailDetails = template
//             ////@ts-expect-error
//             emailDetails.recipient = recipients
//             ////@ts-expect-error
//             const emailParams: object = _.split(emailDetails.params, ',');
//             ////@ts-expect-error
//             let option: IMailOptions = { subject: emailDetails.subject, htmlBody: emailDetails.body, to: to + ',', cc: cc + ',', bcc: bcc + ',', attachments }
//             ////@ts-expect-error
//             _.forEach(emailParams, function (value) {
//                 ////@ts-expect-error
//                 option.subject = option.subject.replace(new RegExp(value, 'g'), params[value]);
//                 // @ts-ignore   //Todo remove ts-ignore
//                 option.htmlBody = option.htmlBody.replace(new RegExp(value, 'g'), params[value]);
//             });
//             ////@ts-expect-error
//             if (emailDetails.recipient) {
//                 ////@ts-expect-error
//                 _.forEach(emailDetails.recipient, function (value) {
//                     if (value.type == 1) { option.cc += value.email + ", " }
//                     else if (value.type == 2) { option.bcc += value.email + ", " }
//                     else if (value.type == 3) { option.to += value.email + ", " }
//                 });
//             }
//             try { return await mail.sendEmail(option) }
//             catch (error) { return error }
//         }
//         else { return { success: true } }
//     }

// }
