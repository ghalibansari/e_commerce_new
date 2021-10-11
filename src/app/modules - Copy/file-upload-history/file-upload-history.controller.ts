import {BaseController} from "../BaseController";
import {Application} from "express";
import {JsonResponse, Upload, TryCatch} from "../../helper";
import {Messages} from "../../constants"
import FileUploadHistoryBusiness from "./file-upload-history.business";
import {IFileUploadHistory} from "./file-upload-history.types";

export class FileUploadHistoryController extends BaseController<IFileUploadHistory> {
    constructor() {
        super(new FileUploadHistoryBusiness(), "excelUpload");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/excelUpload', this.router)
    }

    init() {
        // const validation: UserValidation = new UserValidation();
        this.router.post("/", Upload.uploadFile('/uploads/excels').single("file"), TryCatch.tryCatchGlobe(this.upload))
    }

    async upload(req: any, res: any): Promise<void> {
        const path : string = req.file.path;
        const fileName : string = req.file.originalname
        console.log(req.file);
                
        res.locals.data = { fileName,path }
        res.locals.message = Messages.SUCCESSFULLY_UPLOADED_FILE;
        await JsonResponse.jsonSuccess(req, res, 'excelUpload');
    }
}