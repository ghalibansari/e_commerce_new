import { BaseRepository } from "../BaseRepository";
import { CityMd } from "./city.model";
import { ICity, IMCity } from "./city.types";

export class CityRepository extends BaseRepository<ICity, IMCity> {
    constructor() {
        super(CityMd, 'city_id', [''], ['created_at'], []);
    }
};