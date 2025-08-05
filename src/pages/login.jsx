import React from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import styles from './login.module.css'; // CSS Module
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useUser} from "../components/UserContext.jsx";

const LoginPage = () => {
    const navigate = useNavigate();
    const { updateUser } = useUser();
    const goToAdminVerify = () => {
        navigate('/admin-verify');
    };
    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:7002/user/login', {
                phone: values.phone,
                password: values.password,
            });

            const { success, message: msg, token } = response.data;

            if (success) {
                message.success(msg || '登录成功');
                localStorage.setItem('token', token);

                const res = await axios.get('http://localhost:7002/user/profile');
                if (res.data.success) {
                    const user = res.data.data;
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('avatar', user.avatar);
                    localStorage.setItem('introduction', user.introduction || '');
                    localStorage.setItem('address', user.address || '');
                    localStorage.setItem('balance', user.balance || 0);
                    updateUser(user);
                }

                window.location.href = '/home';
                navigate('/home');
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
        <div className={styles.loginPage}>
            <Card title="盲盒商城 登录" className={styles.loginCard}>
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
                        ]}
                    >
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
                        <Button type="primary" htmlType="submit" className={styles.loginButton}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>

                <div className={styles.registerLink}>
                    <Button
                        type="link"
                        className={styles.linkButton}
                        onClick={goToAdminVerify}
                    >
                        管理员登录
                    </Button>
                    <Link to="/register" className={styles.linkButton}>
                        去注册
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
