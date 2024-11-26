export interface IUser {
    email?: string;
    firstName: string;
    lastName: string;
    username?: string;
    profileImage?: string;
    wallet: string;
}

export interface PayLoad {
    userId: string;
    expires: Date;
    type: string;
}
