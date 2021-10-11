import {json, Request, Response} from "express";
import {Messages} from '../constants';
import {JsonResponse} from "./JsonResponse";
// import * as multerr from "multer" ;
const multerr = require('multer');
import * as fs from "fs";


export class Upload{
    /**
     * tryCatchGlobe
     */
    static uploadFile(upload_path: string = "/uploads")  {
        try {
            const storage =  multerr.diskStorage ({
                destination : function ( req: Request , file: any , cb: any ) { cb ( null , __dirname+"../../../public"+upload_path ) },
                filename : function ( req: Request , file: any , cb: any ) { cb ( null ,Date.now()+'_'+file.originalname ) }
            });
            // const fileFilter = (req: any, file: any, cb: any) => {
            //     if (
            //         file.mimetype === "application/vnd.ms-excel" ||
            //         file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            //     ) { cb(null, true); }
            //     else {
            //         cb(("Only Excel file can be uploaded"), false); // if validation failed then generate error
            //         // let res: any
            //         // res.locals.data = {};
            //         // res.locals.message = Messages.UPLOAD_FILE_TYPE_ERROR;
            //         // JsonResponse.jsonError(req, res, 'upload');
            //     }
            // };            
            return multerr({ storage })
        }
        catch(error) { console.log (error) }
    }

    static removeFile( fileDetails: {path: string, name: string}[]){
        fileDetails.forEach(fileDetail => {
            fs.unlink(__dirname + '/../../public' + fileDetail.path + '/' + fileDetail.name, function (err) {
                if(err && err.code == 'ENOENT') { console.info('File doesn\'t exist, won\'t remove it.') }  // file doesn't exist
                else if  (err) { console.error("Error occurred while trying to remove file") }   // other errors, e.g. maybe we don't have enough permission
                else { console.info(`${fileDetail.name} removed`); }
            });
        });
    }
}
