import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";

const RegisterPage = () => {
    // const onFinish = (values) => {
    //     console.log('注册成功:', values);
    //     message.success('注册成功！');
    //     // TODO: 调用后端 API 完成注册逻辑
    // };
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const { username, phone, password } = values;

        try {
            const response = await axios.post('http://localhost:7002/user/register', {
                username,
                phone,
                password,
            });

            if (response.data.success) {
                message.success(response.data.message || '注册成功！');
                navigate('/login');
                //window.location.href = '/login'; // 成功后跳转登录页
            } else {
                message.error(response.data.message || '注册失败，请重试');
            }
        } catch (error) {
            console.error('请求错误:', error);
            message.error(
                error.response?.data?.message || '注册失败，请检查网络或稍后再试'
            );
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('注册失败:', errorInfo);
        message.error('请检查填写内容');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',overflowY: 'auto',maxHeight: '100%', }}>
            <Card
                title="注册新用户"
                style={{
                    width: 350,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderRadius: 10,
                    backdropFilter: 'blur(8px)',
                    maxHeight: '100%',
                    overflowY: 'auto',
                }}
            >
                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                        required={false}
                    >
                        <Input placeholder="用户名"/>
                    </Form.Item>

                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号' },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '请输入合法的手机号',
                            },
                        ]}
                        required={false}
                    >
                        <Input placeholder="手机号"/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                        hasFeedback
                        required={false}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="确认密码"
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: '请确认密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                },
                            }),
                        ]}
                        required={false}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            注册
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ textAlign: 'right' }}>
                            已有账号？<Link to="/login">去登录</Link>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;
