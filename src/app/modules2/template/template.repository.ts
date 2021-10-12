import  Template from './template.model';
import Recipient from "../recipient/recipient.model";
import {BaseRepository} from "../BaseRepository";
import templateModel from "./template.model";
import recipientModel from "../recipient/recipient.model";
import {ITemplate} from "./template.types";

export class TemplateRepository extends BaseRepository<ITemplate>{

    constructor() {
        super(templateModel);
    }

    // async getWithRecipientCountData(): Promise<object>{
        // let all_data = templateModel.findAll({
        //     include: [{model:Recipient,as:'recipient'}]
        // });
        // return Promise.resolve(all_data);
    // }

    // async getWithSlugName(slug:string): Promise<object>{
    //     let data = Template.find({
    //         include: [{model:Recipient,as:'recipient'}],
    //         where: {'slug':slug, 'template_isActive':1 }
    //     });
    //     return Promise.resolve(data);
    // }

    // async getWithSlugName(slug:string): Promise<object>{
    //     //@ts-expect-error
    //     let data = await recipientModel.templateModel.find();
    //     return Promise.resolve(data);
    // }
}