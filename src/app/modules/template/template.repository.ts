import { BaseRepository } from '../BaseRepository';
import { TemplateMd } from './template.model';
import { IMTemplate, ITemplate } from "./template.types";

export class TemplateRepository extends BaseRepository<ITemplate, IMTemplate>{
    constructor() {
        super(TemplateMd, "template_id", ['*'], ['name'], [])
    }
}