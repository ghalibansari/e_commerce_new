import {BaseBusiness} from '../BaseBusiness'
import {FileUploadHistoryRepository} from "./file-upload-history.repository";
import {IFileUploadHistory} from "./file-upload-history.types";


class FileUploadHistoryBusiness extends BaseBusiness<IFileUploadHistory> {
    private _fileUploadHistoryRepository: FileUploadHistoryRepository;

    constructor() {
        super(new FileUploadHistoryRepository())
        this._fileUploadHistoryRepository = new FileUploadHistoryRepository();
    }
}


Object.seal(FileUploadHistoryBusiness);
export = FileUploadHistoryBusiness;