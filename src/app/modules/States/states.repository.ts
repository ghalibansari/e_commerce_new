import { BaseRepository } from "../BaseRepository";
import { StatesMd } from "./states.model";
import { IStates, IMStates  } from "./states.type";

export class StateRepository extends BaseRepository<IStates, IMStates> {
    constructor() {
        super(StatesMd, 'state_id', ['*'], ['created_at'], []);
    }
}