import { ResponseData } from '../types/respone.type';
const response = (code: number, message: string, data: any = []): ResponseData => {
    return {
        code,
        message,
        ...(data?.data ? data : { data: data }),
    };
};

export default response;
