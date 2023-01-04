export interface IUser {
  _id: string;
  customId: string;
  name: string;
}

export type IUserData = IUser & { contacts: IUser[] }
