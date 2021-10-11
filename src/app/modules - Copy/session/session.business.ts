import {BaseBusiness} from '../BaseBusiness'
import {SessionRepository} from './session.repository'
import {ISession} from "./session.types";


class SessionBusiness extends BaseBusiness<ISession> {
    private _sessionRepository: SessionRepository;

    constructor() {
        super(new SessionRepository())
        this._sessionRepository = new SessionRepository();
    }
}


Object.seal(SessionBusiness);
export = SessionBusiness;