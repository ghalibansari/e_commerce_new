import { createTransport, Transporter } from 'nodemailer';
import { v4 } from 'uuid';
import { EmailRepository } from '../modules/emailHistory/email.repository';
import { LoggerMd } from '../modules/logger/logger.model';
import { loggerLevelEnum } from '../modules/logger/logger.types';



type ISendMail = { to: string, cc?: string, bcc?: string, subject: string, html: string };
export class NotificationService {
    transporter: Transporter;
    from = 'temp@binaryinfocorp.com';

    constructor() {
        this.transporter = createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            auth: {
                user: this.from,
                pass: 'hTd88tpKnxdev$t'
            }
        })
    };

    email = async ({ to, cc, bcc, subject, html }: ISendMail) => {
        let success = false;
        try {
            let result = '';
            await this.transporter.sendMail({ from: this.from, to, cc, bcc, subject, html })
                .then(res => {
                    success = true;
                    result = JSON.stringify(res);
                })
                .catch(err => {
                    result = JSON.stringify(err);
                })
            await new EmailRepository().createOneBR({ newData: { from: this.from, to, cc, bcc, subject, html, success, result }, created_by: v4() })
        } catch (err: any) {
            LoggerMd.create({ stack: JSON.stringify(err.stack), level: loggerLevelEnum.api, message: JSON.stringify(err.message), updated_by: v4(), created_by: v4() }).catch((e: any) => console.log(e, " Failed logging"))
        }
        return success;
    }
};