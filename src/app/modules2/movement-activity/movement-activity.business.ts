import {BaseBusiness} from '../BaseBusiness'
import {MovementActivityRepository} from "./movement-activity.repository";
import {IMovementActivity} from "./movement-activity.types";


class MovementActivityBusiness extends BaseBusiness<IMovementActivity> {
    private _movementActivityRepository: MovementActivityRepository;

    constructor() {
        super(new MovementActivityRepository())
        this._movementActivityRepository = new MovementActivityRepository();
    }
}


Object.seal(MovementActivityBusiness);
export = MovementActivityBusiness;