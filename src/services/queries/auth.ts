import api from "../utils/api";
import axios, { AxiosError } from 'axios';

interface ILoginReturn {
  data: { token: string } | null;
  isError: boolean;
  errorMessage: string;
}

interface IResponseData {
  token: string;
}

interface IReponseErrorData {
  message: string;
  status: 'error';
}

class Auth {
  public async login(username: string, password: string): Promise<ILoginReturn> {
    try {
      const response = await api.post('http://localhost:3333/auth/authenticate', { customId: username, password });

      const data = response.data as IResponseData;

      const token = data.token = `Bearer ${data.token}`;

      api.defaults.headers.common['Authorization'] = token;

      return { data, errorMessage: '', isError: false };
    } catch (error) {
      const genericErrorMessage = 'Erro inesperado. Tente novamente mais tarde';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<IReponseErrorData>;
        const { message } = axiosError.response?.data || { message: genericErrorMessage };

        return { data: null, isError: true, errorMessage: message };
      }

      return { data: null, isError: true, errorMessage: genericErrorMessage };
    }
  }
}

export default new Auth();
