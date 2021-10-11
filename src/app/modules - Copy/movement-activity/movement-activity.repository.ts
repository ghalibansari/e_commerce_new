import {BaseRepository} from "../BaseRepository";
import {IMovementActivity} from "./movement-activity.types";
import movementActivityModel from "./movement-activity.model";


export class MovementActivityRepository extends BaseRepository<IMovementActivity> {
    constructor () {
        super(movementActivityModel);
    }
}