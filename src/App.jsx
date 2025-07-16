import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    AppstoreOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    LockOutlined,
} from '@ant-design/icons';

import LoginPage from './pages/login.jsx';
import RegisterPage from "./pages/register.jsx";


const { Header, Content } = Layout;


export default function App() {
    return (
        <BrowserRouter>
        <Layout style={{ background: 'transparent', margin: 0, padding: 0 } }>
                <Header className={"custom-header"} style={{
                    padding: 0,
                    backgroundColor: 'white',
                    boxShadow: 'none',
                }}>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['/']} selectedKeys={[location.pathname]} className="custom-menu">
                        <Menu.Item key="/login" icon={<LockOutlined />}>
                            <Link to="/login">登录</Link>
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
                    </Menu>
                </Header>
            <Content style={{ padding: '0' }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<div>首页内容</div>} />
                    <Route path="/register" element={<RegisterPage />} />
                    {/*<Route path="/categories" element={<Categories />} />*/}
                    {/*<Route path="/about" element={<About />} />*/}
                    {/*<Route path="/cart" element={<Cart />} />*/}
                </Routes>
            </Content>
            </Layout>


        </BrowserRouter>

    );
}
