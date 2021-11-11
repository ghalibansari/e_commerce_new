
import { EmailRepository } from '../modules/emailHistory/email.repository';
import nodemailer from 'nodemailer';
import { v4 } from 'uuid';
// import juice = require("juice");
// import * as juice from 'juice';

// import { Environment, IMailConfig } from "../../configs/environments/environment";


type ISendMail = { to: string, cc?: string, bcc?: string, subject: string, html: string };
export class NotificationService {
    transporter: nodemailer.Transporter;
    from = '19tcs033.aman.a52@gmail.com';
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.from,
                pass: '7506983549'
            }
        })
    };

    sendMail = async ({ to, cc, bcc, subject, html }: ISendMail) => {
        let temp = {}
        await this.transporter.sendMail({ from: this.from, to, cc, bcc, subject, html })
        .then(res => {
            temp = {res}
            console.log("........", res)
            //@ts-expect-error
            new EmailRepository().createOneBR({newData: {to, cc, bcc, subject, body: html}, created_by: v4()})
        })
        .catch(err => {
            temp = {err}
            console.log("pppppppppp", err)
        })
    }
}