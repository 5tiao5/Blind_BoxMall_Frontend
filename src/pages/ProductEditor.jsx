import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, Space, Card, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import BlindBoxItemEditor from './BlindBoxItemEditor';
import axios from 'axios';
import styles from './ProductEditor.module.css'; // 引入 CSS Module

export default function ProductEditor({ product, onBack }) {
    const [form] = Form.useForm();
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [imageUrl, setImageUrl] = useState(product?.image || '');
    const totalProbability = blindBoxes.reduce((sum, item) => sum + Number(item.probability || 0), 0);

    useEffect(() => {
        if (product?.id) {
            axios.get(`http://localhost:7002/product/${product.id}`).then((res) => {
                if (res.data.success) {
                    const data = res.data.data;
                    form.setFieldsValue(data);
                    setImageUrl(data.image);
                    setBlindBoxes(data.blindBoxItems || []);
                }
            });
        }
    }, [product]);

    const addBlindBox = () => setBlindBoxes([...blindBoxes, {
        name: '', image: '', probability: 0.1, serialNumber: ''
    }]);

    const updateBlindBox = (index, newItem) => {
        const updated = [...blindBoxes];
        updated[index] = newItem;
        setBlindBoxes(updated);
    };

    const handleImageUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('http://localhost:7002/upload/image', formData);
        if (res.data.success) {
            setImageUrl(res.data.url);
        }
    };

    const handleSubmit = async (values) => {
        const res = await axios.put('http://localhost:7002/product/update', {
            ...values,
            id: product.id,
            image: imageUrl,
            blindBoxItems: blindBoxes,
        });
        if (res.data.success) {
            message.success('保存成功');
            onBack();
        }
    };

    return (
            <Card title="编辑商品" extra={<Button onClick={onBack}>返回</Button>} className={styles.card}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="描述" name="description">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="价格" name="price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="抽奖规则" name="rules">
                        <Input.TextArea rows={2}/>
                    </Form.Item>
                    <Form.Item label="商品图片">
                        <Upload showUploadList={false} customRequest={handleImageUpload}>
                            <Button icon={<UploadOutlined />} className={styles.uploadButton}>上传图片</Button>
                        </Upload>
                        {imageUrl && <img src={imageUrl} alt="preview" className={styles.imagePreview} />}
                    </Form.Item>

                    <Form.Item label="盲盒内容" className={styles.blindBoxList}>
                        <div style={{ marginBottom: 12 }}>
                            当前盲盒总概率：{(totalProbability * 100).toFixed(2)}%
                            {totalProbability > 1 && (
                                <span style={{ color: 'red', marginLeft: 8 }}>（已超过 100%）</span>
                            )}
                        </div>
                        {blindBoxes.map((item, index) => (
                            <BlindBoxItemEditor
                                key={index}
                                index={index}
                                item={item}
                                onChange={(val) => updateBlindBox(index, val)}
                            />
                        ))}
                        <Button icon={<PlusOutlined />} onClick={addBlindBox} className={styles.addButton}>
                            添加盲盒项
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">保存修改</Button>
                    </Form.Item>
                </Form>
            </Card>
    );
}
