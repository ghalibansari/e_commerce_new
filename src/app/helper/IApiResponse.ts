export interface ISuccessResponse{
    status: boolean;
    message?: string;
    errorCode?: string;
    page?: object;
    header?: object;
    data: object|[];
}

export interface ISuccessAuthResponse{
    success: boolean;
    message?: string;
    data: object;
}

export interface ISuccessValidation{
    success: boolean;
    message?: string;
    data: object;
}