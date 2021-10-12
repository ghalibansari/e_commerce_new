import {BaseBusiness} from '../BaseBusiness'
import {TemplateRepository} from "./template.repository";
import {ITemplate} from "./template.types";


class TemplateBusiness extends BaseBusiness<ITemplate> {
    private _templateRepository: TemplateRepository;

    constructor() {
        super(new TemplateRepository())
        this._templateRepository = new TemplateRepository();
    }
}


Object.seal(TemplateBusiness);
export = TemplateBusiness;