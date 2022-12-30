import api from "../utils/api";
import httpClient from "../utils/httpClient";

interface IResponseData {
  token: string;
}

interface IUserData {
  _id: string;
  customId: string;
  name: string;
}

interface IResponseData {
  token: string;
  user: IUserData & { contacts: IUserData[] };
}

class Auth {
  public logout() {
    api.defaults.headers.common['Authorization'] = '';
  }

  public async login(username: string, password: string) {
    const response = await httpClient<IResponseData>({
      method: 'post',
      url: '/auth/authenticate',
      data: { customId: username, password },
    });

    const { data, isError } = response;

    if (isError || !data) {
      return response;
    }

    const token = `Bearer ${data.token}`;

    api.defaults.headers.common['Authorization'] = token;

    return response;
  }
}

export default new Auth();
