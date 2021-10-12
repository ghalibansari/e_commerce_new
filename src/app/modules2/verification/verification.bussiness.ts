import {BaseBusiness} from '../BaseBusiness'
import {VerificationRepository} from "./verification.repository";
import { IVerification } from './verification.types';


class VerificationBusiness extends BaseBusiness<IVerification> {
    private _verificationRepository: VerificationRepository;

    constructor() {
        super(new VerificationRepository())
        this._verificationRepository = new VerificationRepository();
    }
}


Object.seal(VerificationBusiness);
export = VerificationBusiness;