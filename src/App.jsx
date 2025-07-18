import React, {useEffect, useState} from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {Avatar, Dropdown, Layout, Menu, Space} from 'antd';
import {
    HomeOutlined,
    AppstoreOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    LockOutlined, UserOutlined, LogoutOutlined,
} from '@ant-design/icons';

import LoginPage from './pages/login.jsx';
import RegisterPage from "./pages/register.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import { useNavigate, useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

const { Header, Content } = Layout;


export default function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUsername(localStorage.getItem('username'));
            setAvatar(localStorage.getItem('avatar'));
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setUsername('');  // 清除状态
        setAvatar('');    // 清除状态
        navigate('/login');
    };
    return (
        <Layout style={{ background: 'transparent', margin: 0, padding: 0 } }>
                <Header className={"custom-header"} style={{
                    padding: 0,
                    backgroundColor: 'white',
                    boxShadow: 'none',
                }}>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['/']} selectedKeys={[location.pathname]} className="custom-menu">
                        <Menu.Item
                            key="/login"
                            icon={<LockOutlined />}
                            onClick={() => {
                                const token = localStorage.getItem('token');
                                if (token) {
                                    // 已登录，跳转到首页或个人主页
                                    console.log(token);
                                    navigate('/home'); // 或者 navigate('/home')
                                } else {
                                    navigate('/login');
                                }
                            }}
                        >
                            登录
                        </Menu.Item>
                        <Menu.Item key="/home" icon={<HomeOutlined />}>
                            <Link to="/home">首页</Link>
                        </Menu.Item>
                        <Menu.Item key="/categories" icon={<AppstoreOutlined />}>
                            <Link to="/categories">分类</Link>
                        </Menu.Item>
                        <Menu.Item key="/about" icon={<InfoCircleOutlined />}>
                            <Link to="/about">抽盒机</Link>
                        </Menu.Item>
                        <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
                            <Link to="/cart">玩家秀</Link>
                        </Menu.Item>
                        <Menu.Item key="/profile" icon={<UserOutlined />}>
                            <Link to="/profile">个人主页</Link>
                        </Menu.Item>
                        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                            退出登录
                        </Menu.Item>
                        {username&& <Menu.Item
                            key="user"
                            style={{
                                marginLeft: 'auto',
                                cursor: 'default',
                                display: 'flex',
                                alignItems: 'center',
                                pointerEvents: 'none',
                            }}>
                            <Avatar size={40} src={avatar} />
                            <span
                                style={{
                                    marginLeft: 12,
                                    fontSize: 20,
                                    fontWeight: 500,
                                    color: '#5b9bd5',
                                }}
                            >{username}
                            </span>
                        </Menu.Item>}
                    </Menu>
                </Header>
            <Content style={{ padding: '0' }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<div>首页内容</div>} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={
                        <PrivateRoute>
                        <UserProfile />
                        </PrivateRoute>
                    } />
                    {/*<Route path="/categories" element={<Categories />} />*/}
                    {/*<Route path="/about" element={<About />} />*/}
                    {/*<Route path="/cart" element={<Cart />} />*/}
                </Routes>
            </Content>
            </Layout>

    );
}
