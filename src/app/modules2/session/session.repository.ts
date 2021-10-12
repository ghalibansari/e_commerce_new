import {BaseRepository} from "../BaseRepository";
import sessionModel from "./session.model";
import {ISession} from "./session.types";


export class SessionRepository extends BaseRepository<ISession> {
    constructor () {
        super(sessionModel);
    }
}