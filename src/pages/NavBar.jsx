import React, { useEffect, useState } from 'react';
import { Menu, Avatar } from 'antd';
import {
    HomeOutlined,
    AppstoreOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    LockOutlined,
    UserOutlined,
    LogoutOutlined, ProfileOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext.jsx'

export default function NavBarmy() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, clearUser } = useUser();
    const { username, avatar } = user;

    const logout = () => {
        clearUser();
        navigate('/login');
    };

    return (
        <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="custom-menu"
        >
            {!username && (
                <Menu.Item
                    key="/login"
                    icon={<LockOutlined />}
                    onClick={() => {
                        const token = localStorage.getItem('token');
                        if (token) {
                            navigate('/home');
                        } else {
                            navigate('/login');
                        }
                    }}
                >
                    登录
                </Menu.Item>
            )}
            {/*<Menu.Item key="/home" icon={<HomeOutlined />}>*/}
            {/*    <Link to="/home">首页</Link>*/}
            {/*</Menu.Item>*/}
            <Menu.Item key="/categories" icon={<AppstoreOutlined />}>
                <Link to="/categories">分类</Link>
            </Menu.Item>
            <Menu.Item key="/home" icon={<InfoCircleOutlined />}>
                <Link to="/home">抽盒机</Link>
            </Menu.Item>
            <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
                <Link to="/cart">玩家秀</Link>
            </Menu.Item>
            <Menu.Item key="/profile" icon={<UserOutlined />}>
                <Link to="/profile">个人主页</Link>
            </Menu.Item>
            <Menu.Item key="/orderlist" icon={<ProfileOutlined />}>
                <Link to="/order/list">订单管理</Link>
            </Menu.Item>
            {username && (
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                    退出登录
                </Menu.Item>
            )}
            {username && (
                <Menu.Item
                    key="user"
                    style={{
                        marginLeft: 'auto',
                        cursor: 'default',
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <Avatar size={40} src={avatar} />
                    <span
                        style={{
                            marginLeft: 12,
                            fontSize: 20,
                            fontWeight: 500,
                            color: '#5b9bd5',
                        }}
                    >
            {username}
          </span>
                </Menu.Item>
            )}
        </Menu>
    );
}
