"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const multerr = require('multer');
const fs = __importStar(require("fs"));
class Upload {
    static uploadFile(upload_path = "/uploads") {
        try {
            const storage = multerr.diskStorage({
                destination: function (req, file, cb) { cb(null, __dirname + "../../../public" + upload_path); },
                filename: function (req, file, cb) { cb(null, Date.now() + '_' + file.originalname); }
            });
            return multerr({ storage });
        }
        catch (error) {
            console.log(error);
        }
    }
    static removeFile(fileDetails) {
        fileDetails.forEach(fileDetail => {
            fs.unlink(__dirname + '/../../public' + fileDetail.path + '/' + fileDetail.name, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info('File doesn\'t exist, won\'t remove it.');
                }
                else if (err) {
                    console.error("Error occurred while trying to remove file");
                }
                else {
                    console.info(`${fileDetail.name} removed`);
                }
            });
        });
    }
}
exports.Upload = Upload;
//# sourceMappingURL=Upload.js.map