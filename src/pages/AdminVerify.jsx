import React, { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const AdminVerify = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleVerify = () => {
        const correctCode = 'mmx-181314-1'; // 写死的身份码
        if (code === correctCode) {
            localStorage.setItem('isAdmin', 'true');
            message.success('验证成功，欢迎管理员');
            //navigate('/product-create');
            window.location.href = '/create';
        } else {
            message.error('身份码错误');
        }
    };

    return (
        <Card title="管理员身份验证" style={{ maxWidth: 400, margin: '0 auto' }}>
            <Input.Password
                placeholder="请输入身份码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Button type="primary" block onClick={handleVerify}>
                验证
            </Button>
        </Card>
    );
};

export default AdminVerify;
