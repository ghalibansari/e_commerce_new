import {BaseBusiness} from '../../../BaseBusiness'
import { ColorMasterRepository } from './color-master.repository';
import { IColorMaster } from './color-master.types';


class ColorMasterBusiness extends BaseBusiness<IColorMaster>{
    private _colorMasterRepository: ColorMasterRepository;

    constructor() {
        super(new ColorMasterRepository())
        this._colorMasterRepository = new ColorMasterRepository();
    }
}


Object.seal(ColorMasterBusiness);
export = ColorMasterBusiness;