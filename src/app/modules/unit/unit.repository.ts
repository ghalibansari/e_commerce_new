import {BaseRepository} from "../BaseRepository";
import UnitMd from "./unit.model";
import { IUnit, IMUnit } from "./unit.types";


export class UnitRepository extends BaseRepository<IUnit, IMUnit> {
    constructor () {
        super(UnitMd, "unit_id", ['brand_id', 'name', 'shortName', 'description', 'status'], [['created_on', 'DESC']])
    }
}