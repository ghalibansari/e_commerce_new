import { BaseRepository } from "../BaseRepository";
import { CityMd } from "./city.model"
import { IMCity, ICity } from "./city.types";

export class CityRepository extends BaseRepository<ICity, IMCity> {
    constructor() {
        super(CityMd, 'city_id', ['*'], ['created_at'], []);
    }
};