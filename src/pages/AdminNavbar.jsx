// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppstoreAddOutlined, LogoutOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.clear();
        navigate('/app');
        window.dispatchEvent(new Event("storage"));
        //navigate(0);
    };

    return (
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item
                        key="create"
                        icon={<AppstoreAddOutlined />}
                        onClick={() => navigate('create')}
                    >
                        创建商品
                    </Menu.Item>
                    <Menu.Item
                        key="manage"
                        icon={<UnorderedListOutlined />}
                        onClick={() => navigate('/admin/products')}
                    >
                        管理商品
                    </Menu.Item>
                    <Menu.Item key="Admin-logout" icon={<LogoutOutlined />} onClick={logout}>
                        退出登录
                    </Menu.Item>
                </Menu>
    );
};

export default AdminLayout;
