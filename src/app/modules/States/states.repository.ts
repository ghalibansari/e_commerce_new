import { BaseRepository } from "../BaseRepository";
import { StatesMd } from "./states.model";
import { IMStates, IStates } from "./states.types";

export class StateRepository extends BaseRepository<IStates, IMStates> {
    constructor() {
        super(StatesMd, 'state_id', ['*'], ['created_at'], []);
    }
}