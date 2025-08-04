import React, { useEffect, useState } from 'react';
import { Card, Avatar, Upload, Input, Button, message, Form, List } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useUser} from "../components/UserContext.jsx";
const UserProfile = () => {
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState({});
    const [orders, setOrders] = useState([]);
    const { updateUser } = useUser();
    const fetchUserInfo = async () => {
        const res = await axios.get('http://localhost:7002/user/profile');
        if (res.data.success) {
            const newData = res.data.data;
            setUserInfo(res.data.data);
            updateUser({
                username: newData.username,
                avatar: newData.avatar,
            });
            form.setFieldsValue(res.data.data);
        }
    };

    const fetchOrders = async () => {
        const res = await axios.get('http://localhost:7002/order/my');
        if (res.data.success) {
            setOrders(res.data.orders || []);
        }
    };

    const handleAvatarUpload = async (info) => {
        const formData = new FormData();
        formData.append('file', info.file);
        const res = await axios.post('http://localhost:7002/upload/image', formData);
        if (res.data.success) {
            const avatarUrl = res.data.url;
            setUserInfo({ ...userInfo, avatar: avatarUrl });
            await axios.post('http://localhost:7002/user/update', { avatar: avatarUrl });
            message.success('头像上传成功');
        } else {
            message.error('上传失败');
        }
    };

    const handleSave = async (values) => {
        const res = await axios.post('http://localhost:7002/user/update', values);
        if (res.data.success) {
            console.log(values);
            message.success('信息更新成功');
            fetchUserInfo();
        } else {
            message.error('更新失败');
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchOrders();
    }, []);

    return (
        <Card title="个人主页" style={{ maxWidth: 600, margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)',}}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Avatar size={100} src={userInfo.avatar} />
                <Upload showUploadList={false} customRequest={handleAvatarUpload}>
                    <Button icon={<UploadOutlined />} style={{ marginTop: 10 }}>
                        上传头像
                    </Button>
                </Upload>
                <div style={{ marginTop: 10, fontSize: 18 }}>用户名:{userInfo.username}</div>
            </div>

            <Form layout="vertical" form={form} onFinish={handleSave}>
                <Form.Item label="个人简介" name="introduction">
                    <Input.TextArea rows={2} placeholder="写点关于你自己..." />
                </Form.Item>
                <Form.Item label="收货地址" name="address">
                    <Input placeholder="请输入收货地址" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">保存修改</Button>
                </Form.Item>
            </Form>

            <div style={{ marginTop: 20 }}>
                <strong>账户余额：</strong>{userInfo.balance ?? 0} 元
            </div>

            <div style={{ marginTop: 20 }}>
                {/*<strong>我的订单：</strong>*/}
                {/*<List*/}
                {/*    dataSource={orders}*/}
                {/*    renderItem={(item) => (*/}
                {/*        <List.Item>*/}
                {/*            订单号：{item.id} | 金额：{item.total} 元 | 状态：{item.status}*/}
                {/*        </List.Item>*/}
                {/*    )}*/}
                {/*/>*/}
            </div>
        </Card>
    );
};

export default UserProfile;
