import {BaseRepository} from "../BaseRepository";
import VerificationModel from "./verification.model";
import { IVerification } from "./verification.types";


export class VerificationRepository extends BaseRepository<IVerification> {
    constructor () {
        super(VerificationModel);
    }
}