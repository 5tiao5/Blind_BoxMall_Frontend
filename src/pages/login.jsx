import React from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import './login.css';
const LoginPage = () => {
    const onFinish = (values) => {
        console.log('登录成功:', values);
        message.success('登录成功');
        // 这里可以调用后端接口进行登录验证
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
                        name="username"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input placeholder="用户名" />
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
            </Card>
        </div>
    );
};

export default LoginPage;
