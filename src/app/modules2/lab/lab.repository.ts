import {BaseRepository} from "../BaseRepository";
import labModel from "./lab.model";
import {ILab} from "./lab.types";


export class LabRepository extends BaseRepository<ILab> {
    constructor () {
        super(labModel);
    }
}