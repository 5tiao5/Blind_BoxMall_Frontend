import React from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import './login.css';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
const LoginPage = () => {
    // const onFinish = (values) => {
    //     console.log('登录成功:', values);
    //     message.success('登录成功');
    //     // 这里可以调用后端接口进行登录验证
    // };
    //
    // const onFinishFailed = (errorInfo) => {
    //     console.log('登录失败:', errorInfo);
    //     message.error('请检查输入');
    // };
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:7002/user/login', {
                phone: values.phone,
                password: values.password,
            });

            const { success, message: msg, token } = response.data;

            if (success) {
                message.success(msg || '登录成功');
                localStorage.setItem('token', token); // 保存 token
                navigate('/home'); // 跳转到首页
            } else {
                message.error(msg || '用户名或密码错误');
            }
        } catch (error) {
            console.error('请求错误:', error);
            message.error('登录失败，服务器异常');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('登录失败:', errorInfo);
        message.error('请检查输入');
    };

    return (
        <div className="login-page">
            <Card title="登录" style={{
                width: 300,
                backgroundColor: 'rgba(255, 255, 255, 0.6)', // 半透明白色
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // 阴影美化
                borderRadius: 10,
                backdropFilter: 'blur(8px)', // 可选：背景模糊玻璃效果
            }}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号' },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '请输入合法的中国手机号',
                            },
                        ]}>
                        <Input placeholder="手机号" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password placeholder="密码" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <Link to="/register">去注册</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
