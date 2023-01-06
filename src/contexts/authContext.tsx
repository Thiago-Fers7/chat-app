import Router from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { IUserData } from "../@types/user";
import auth from "../services/queries/auth";

interface IContextProps {
  setUser: (user: IUserData) => void;
  user: IUserData | null;
}

const AuthContext = createContext({} as IContextProps);

interface IAuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUserData | null>(null);

  function handleSetUser(userData: IUserData) {
    setUser(userData);
  }

  // useEffect(() => {
  //   async function handle() {
  //     const token = localStorage.getItem("@token");

  //     if (!token) {
  //       if (Router.pathname !== "/login") {
  //         Router.push("/login");
  //       }
  //       return;
  //     }

  //     const { data, isError } = await auth.loginWithToken(token);

  //     if (isError) {
  //       Router.push("/login");
  //       localStorage.removeItem("@token");
  //       return;
  //     }

  //     if (data) {
  //       setUser(data.user);
  //     }

  //     if (Router.pathname === "/login") {
  //       Router.push("/");
  //     }
  //   }

  //   handle();
  // }, []);


  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
