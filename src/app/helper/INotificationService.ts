export interface IMailResponse {
    success: boolean;
    message?: string;
    item?: any;
    error?: any;
}

export interface IMailOptions {
    attachments?: object[];
    subject: string;
    templateName?: string;
    body?: string;
    htmlBody?: string;
    replace?: object;
    to?: string;
    cc?: string;
    bcc?: string;
}
