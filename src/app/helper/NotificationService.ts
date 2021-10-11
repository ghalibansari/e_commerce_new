// //@ts-expect-error
// import * as mailer from 'nodemailer';
// //@ts-expect-error
// import * as Mail from 'nodemailer/lib/mailer';
// import { IMailOptions, IMailResponse } from './INotificationService';
// // import juice = require("juice");
// // import * as juice from 'juice';
// //@ts-expect-error
// import {Environment, IMailConfig} from "../../configs/environments/environment";
// //@ts-expect-error
// import settingModel from "../modules/setting/setting.model";
// //@ts-expect-error
// import {ISetting} from "../modules/setting/setting.types";

// /**
//  * NotificationService
//  */
// export class NotificationService {

//     /**
//      *
//      * @param options
//      */
//     async sendEmail(options: IMailOptions): Promise<IMailResponse> {
        
//         return new Promise<IMailResponse> (
//             // @ts-ignore
//             async (resolve: (value?: IMailResponse) => void, rejects: (reason?: IMailResponse) => void): Promise<void> => {
//                 // create env object
//                 const env: Environment = new Environment();
//                 // get mail config based on current env
//                 // let mailConfig1: IMailConfig = env.getConfiguration().mailConfig;
//                 const setting = await settingModel.findOne()
//                 const {EmailHost: host, EmailPort: port, EmailFrom: fromEmail, EmailId: username, EmailPassword: password, EmailSecure: secure, MailSender: mailSender, EmailTo: toEmail} = setting as ISetting //Todo fix this proper mail structure in db as object.
//                 const mailConfig = {hostConfig :{host, port, secure, auth: {username, password}, tls: {rejectUnauthorized: false}}, mailSender, mailOption: {fromEmail, toEmail}}
//                 // get mail server based on mail configuration
//                 const server: Mail = await this.getEmailServer(mailConfig);
//                 // make default email options
//                 const mailOptions: Mail.Options = {
//                     from: mailConfig.mailOption.fromEmail,
//                     to: options.to,
//                     cc: options.cc,
//                     bcc: options.bcc,
//                     subject: options.subject,
//                     attachments: options.attachments,
//                 };

//                 // if template name is exist then choose pug template from views
//                 if (options.templateName) {
//                     // mailOptions.html = await this.getTemplate(options.template, options.replace);
//                     // mailOptions.text = htmlToText.fromString(mailOptions.html);
//                 }

//                 // if text body then assign as text
//                 if (options.body) {
//                     mailOptions.text = options.body;
//                 }

//                 // if html body then assign as html
//                 if (options.htmlBody) {
//                     mailOptions.html = options.htmlBody;
//                 }

//                 // logger.info(JSON.stringify(mailOptions));


//                 /**
//                  * sendMail
//                  */
//                 // @ts-ignore
//                 server.sendMail(mailOptions, (err: Error, info: mailer.SentMessageInfo) => {
//                     // logger.info(JSON.stringify(err));
//                     if (info) {
//                         // logger.info(JSON.stringify(info));
//                         resolve({
//                             success: true,
//                             item: info,
//                         });
//                     } else {
//                         rejects({
//                             success: false,
//                             error: err,
//                         });
//                     }
//                 });
//             });
//     }

//     /**
//      *
//      * @param template
//      */
//     // private async getTemplate(template : string, options: object = {}): Promise<string> {
//     //     const html: string = "";
//     //     return juice(html);
//     // }

//     /**
//      *
//      * @param mailConfig
//      */
//     private async getEmailServer(mailConfig: IMailConfig): Promise<Mail> {
//         // @ts-ignore   //Todo remove ts-ignore
//         return mailer.createTransport({
//             host: mailConfig.hostConfig.host,
//             port: mailConfig.hostConfig.port,
//             secure: mailConfig.hostConfig.secure,
//             auth: {
//                 user: mailConfig.hostConfig.auth.username,
//                 pass: mailConfig.hostConfig.auth.password,
//             },"tls": {
//                 "rejectUnauthorized": false
//             },
//             debug: true, // show debug output Todo modify it later
//             logger: true // log information in console Todo modify it later
//         });
//     }

// }