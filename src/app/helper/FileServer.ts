
interface IJtDownload {
    fileName: string;
    path: string;
    url: string;
}

interface IJtSaveImage {
    fileName: string;
    path: string;
    image: string;
}

interface IJtDownloadResponse { //Todo make JT response wait less...
    fileName: string;
    url: string;
}


// const JtDownload = async(args: IJtDownload):Promise<AxiosPromise<IJtDownloadResponse>> => axios.post(Constant.JT_Download_URL, args);

// const JtSaveImage = async(args: IJtSaveImage):Promise<AxiosPromise<IJtDownloadResponse>> => axios.post(Constant.JT_Company_save_image, args);

export { IJtDownload, IJtDownloadResponse, IJtSaveImage };
