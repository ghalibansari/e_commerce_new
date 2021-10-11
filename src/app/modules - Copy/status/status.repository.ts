import {BaseRepository} from "../BaseRepository";
import statusModel from "./status.model";
import {IStatus} from "./status.types"

export class StatusRepository extends BaseRepository<IStatus> {
    constructor(){
        super(statusModel)
    }
}