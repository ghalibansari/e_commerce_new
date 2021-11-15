// // import { NotificationService, IMailOptions } from "../helper";

import mjml2html from 'mjml'
import { NotificationService } from "../helper/NotificationService"
import { TemplateRepository } from "./template/template.repository"
import { templateTypeEnum } from "./template/template.types"

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
type IEmail = { template_name: string, to: string, cc?: string, bcc?: string, subject?: string, html?: string, paramsVariable: { [x: string]: string | number } }
export class BaseHelper {    //Todo remove any from params
    sendEmail = async ({ template_name, to, cc, bcc, subject, html, paramsVariable = {} }: IEmail) => {

        const template = await new TemplateRepository().findOneBR({ where: { type: templateTypeEnum.email, name: template_name } });

        if (!template) throw new Error('Template not found');

        template.params.forEach(p => {
            if (!paramsVariable[p]) throw new Error(`Key ${p} is not found in ParamsVariable.`);
            template.body = template.body.replace(new RegExp(`{{${p}}}`, 'g'), `${paramsVariable[p]}`);
            template.subject = template.subject.replace(new RegExp(`{{${p}}}`, 'g'), `${paramsVariable[p]}`);
            template.title = template.title.replace(new RegExp(`{{${p}}}`, 'g'), `${paramsVariable[p]}`);
        });

        const mjml = mjml2html(template.body);

        cc ||= '';
        bcc ||= '';
        html ||= mjml.html
        subject ||= template.subject

        template.to?.forEach(t => { to = to.concat(', ', t) });
        template.cc?.forEach(c => { cc = cc!.concat(', ', c) });
        template.bcc?.forEach(b => { bcc = bcc!.concat(', ', b) });

        const mail = await new NotificationService().email({ to, subject, cc, bcc, html })
        return mail;
    }
};