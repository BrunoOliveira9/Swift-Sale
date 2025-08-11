import React, { createContext, useContext, useState, useEffect } from 'react';
import { GenericCrudService } from '../crud/generic-crud.ts';
import showToast from '../../components/toast/Toast.jsx';

interface Login {
    username: string;
    password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (data: Login) => Promise<boolean>;
  logout: () => Promise<void>;
}

const defaultAuthContextValue: AuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  setIsAuthenticated: () => {},
  login: () => Promise.resolve(false),
  logout: () => Promise.resolve(),
};

const authService = new GenericCrudService();

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await authService.getAction<{ authenticated: boolean }>('/auth/status');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (data: Login): Promise<boolean> => {
    try {
      await authService.create('/auth/login', data);
      setIsAuthenticated(true);
        showToast('success', 'Login realizado', 'Bem-vindo ao sistema!');
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      if(error.response){
        showToast('error', 'Erro de login', 'Usuário ou senha inválidos');
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.postAction('/auth/logout');
      setIsAuthenticated(false);
      showToast('info', 'Sessão encerrada', 'Você foi desconectado com sucesso.');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    setIsAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};