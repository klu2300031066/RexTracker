import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('rexUserName') || '';
    });

    useEffect(() => {
        localStorage.setItem('rexUserName', userName);
    }, [userName]);

    return (
        <UserContext.Provider value={{ userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
