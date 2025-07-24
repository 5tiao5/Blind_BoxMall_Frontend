import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: localStorage.getItem('username') || '',
        avatar: localStorage.getItem('avatar') || '',
    });

    // 修改用户信息时，同步更新 localStorage 和状态
    const updateUser = (newUser) => {
        localStorage.setItem('username', newUser.username || '');
        localStorage.setItem('avatar', newUser.avatar || '');
        setUser(newUser);
    };

    const clearUser = () => {
        localStorage.clear();
        setUser({ username: '', avatar: '' });
    };

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
