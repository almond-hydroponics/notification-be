

export interface IUser {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    salt?: string;
}

export interface IUserInputDTO {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
}
