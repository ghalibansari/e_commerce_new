import {BaseBusiness} from '../../../BaseBusiness'
import { ColorRangeRepository } from './color-range.repository';
import { IColorRange } from './color-range.types';


class ColorRangeBusiness extends BaseBusiness<IColorRange>{
    private _colorRangeRepository: ColorRangeRepository;

    constructor() {
        super(new ColorRangeRepository())
        this._colorRangeRepository = new ColorRangeRepository();
    }
}


Object.seal(ColorRangeBusiness);
export = ColorRangeBusiness;