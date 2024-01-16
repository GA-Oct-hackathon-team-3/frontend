
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { WEB_BASE_URL } from '../utilities/constants';
import * as usersAPI from '../utilities/users-api';


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [ token, setToken ] = useState('');

    useEffect(() => {
        const handleToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) logout();
            else {
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                if (payload.exp >= Date.now() / 1000) setToken(storedToken);
                else {
                    const newToken = await refreshTokens('web', storedToken);
                    localStorage.setItem('token', newToken);
                }
            }
        }

        handleToken();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch(`${WEB_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem('token', data.accessToken);
                setToken(data.accessToken);
                return true;
            }

            else return false;
        } catch (error) {
            console.error('Login error: ', error);
        }
    }

    const logout = async () => {
        const response = await usersAPI.logout();
        if (response && response.message === 'Cookie cleared') setToken('');
    }

    const refreshTokens = async (device, currentToken) => {
        return await usersAPI.refreshTokens(device, currentToken);
    }

    const contextValue = useMemo(() => ({
        token,
        login,
        logout,
    }), [token]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
      );
}