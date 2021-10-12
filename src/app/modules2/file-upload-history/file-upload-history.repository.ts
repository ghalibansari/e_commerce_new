import {BaseRepository} from "../BaseRepository";
import fileUploadHistoryModel from "./file-upload-history.model";
import {IFileUploadHistory} from "./file-upload-history.types";


export class FileUploadHistoryRepository extends BaseRepository<IFileUploadHistory> {
    constructor () {
        super(fileUploadHistoryModel);
    }
}