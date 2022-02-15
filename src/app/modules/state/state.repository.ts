import { BaseRepository } from "../BaseRepository";
import { StatesMd } from "./state.model";
import { IMStates, IStates } from "./state.types";

export class StateRepository extends BaseRepository<IStates, IMStates> {
    constructor() {
        super(StatesMd, 'state_id', ['*'], ['created_at'], []);
    }
}