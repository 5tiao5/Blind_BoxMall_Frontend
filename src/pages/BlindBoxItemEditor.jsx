import React from 'react';
import { Input, InputNumber, Upload, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function BlindBoxItemEditor({ index, item, onChange }) {
    const uploadImage = async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('http://localhost:7002/upload/image', formData);
        if (res.data.success) {
            onChange({ ...item, image: res.data.url });
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: 6, marginBottom: 12 }}>
            <Input placeholder="盲盒名称" value={item.name} onChange={(e) => onChange({ ...item, name: e.target.value })} />
            <Upload showUploadList={false} customRequest={uploadImage}>
                <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
            {item.image && <img src={item.image} alt="盲盒图" style={{ maxWidth: 100 }} />}
            <Input placeholder="编号" value={item.serialNumber} onChange={(e) => onChange({ ...item, serialNumber: e.target.value })} />
            <InputNumber
                placeholder="概率"
                min={0.01}
                max={1}
                step={0.01}
                value={item.probability}
                onChange={(val) => onChange({ ...item, probability: val })}
            />
        </Space>
    );
}
