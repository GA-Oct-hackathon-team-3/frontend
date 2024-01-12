
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { WEB_BASE_URL } from '../utilities/constants';


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [ token, setToken ] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) logout();
        else {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            if (payload.exp >= Date.now() / 1000) setToken(storedToken);
        }
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
        try {
            const response = await fetch(`${WEB_BASE_URL}/users/logout`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 200 || response.status === 204) {
                localStorage.removeItem('token');
                setToken('');
                return true;
            }

            else return false;
        } catch (error) {
            console.error('Logout error: ', error);
        }

    }

    const refreshTokens = async (device) => {
        const response = await fetch(`${WEB_BASE_URL}/users/refresh`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ device }),
            credentials: 'include'
        });

        // if server responds that either token are missing, run logout
        if (response.status === 403) {
            await logout();
        }

        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            console.log('this is old token: ', token);
            console.log('this is new token: ', data.accessToken);
        }
    }

    // const getToken = () => {
    //     const storedToken = localStorage.getItem('token')
    //     if (!token && storedToken) {
    //         const payload = JSON.parse(atob(storedToken.split('.')[1]));
    //         if (payload.exp >= Date.now() / 1000) setToken(storedToken);
    //     } else if (!token && !storedToken) {
    //         logout();
    //     }

    //     return storedToken;
    // }

    const contextValue = useMemo(() => ({
        token,
        login,
        refreshTokens,
        logout,
    }), [token]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
      );
}