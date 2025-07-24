import {Button, Card, Form, Input, InputNumber, message, Space, Upload} from "antd";
import React, {useState} from "react";
import axios from "axios";
import styles from "./CreateProductPage.module.css";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";

const CreateProductPage = () => {
    const [form] = Form.useForm();
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const totalProbability = blindBoxes.reduce((sum, item) => sum + Number(item.probability || 0), 0);

    const handleAddBlindBox = () => {
        setBlindBoxes([...blindBoxes, { name: '', image: '', probability: 0, serialNumber: '' }]);
    };

    const handleBlindBoxChange = (index, field, value) => {
        const updated = [...blindBoxes];
        updated[index][field] = value;
        setBlindBoxes(updated);
    };

    const handleImageUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('http://localhost:7002/upload/image', formData);
        if (res.data.success) {
            setImageUrl(res.data.url);
            message.success('图片上传成功');
        } else {
            message.error('上传失败');
        }
    };

    const handleBlindBoxImageUpload = async ({ file }, index) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('http://localhost:7002/upload/image', formData);
        if (res.data.success) {
            const updated = [...blindBoxes];
            updated[index].image = res.data.url;
            setBlindBoxes(updated);
            message.success('盲盒图片上传成功');
        } else {
            message.error('上传失败');
        }
    };

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            image: imageUrl,
            blindBoxItems: blindBoxes,
        };
        if (totalProbability > 1) {
            message.error('盲盒概率总和不能超过 100%');
            return;
        }
        const res = await axios.post('http://localhost:7002/product/create', payload);
        if (res.data.success) {
            message.success('商品创建成功');
            form.resetFields();
            setBlindBoxes([]);
            setImageUrl('');
        } else {
            message.error('创建失败');
        }
    };

    return (
        <Card title="创建商品及盲盒内容" className={styles.container}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="商品名称" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="商品描述" name="description">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item label="价格" name="price" rules={[{ required: true }]}>
                    <InputNumber min={0} addonAfter="元" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="抽奖规则" name="rules">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item label="商品图片">
                    <Upload showUploadList={false} customRequest={handleImageUpload}>
                        <Button icon={<UploadOutlined />}>上传商品图片</Button>
                    </Upload>
                    {imageUrl && <img src={imageUrl} alt="product" className={styles.previewImage} />}
                </Form.Item>

                <Form.Item label="盲盒列表">
                    <Button type="dashed" onClick={handleAddBlindBox} icon={<PlusOutlined />}>
                        添加盲盒项
                    </Button>
                </Form.Item>
                <div className={styles.probabilityTotal}>
                    当前盲盒总概率：{(totalProbability * 100).toFixed(2)}%
                    {totalProbability > 1 && (
                        <span style={{ color: 'red', marginLeft: 10 }}>（已超过 100%）</span>
                    )}
                </div>
                {blindBoxes.map((item, index) => (
                    <Card
                        key={index}
                        type="inner"
                        title={`盲盒项 #${index + 1}`}
                        className={styles.blindBoxCard}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input
                                placeholder="盲盒名称"
                                value={item.name}
                                onChange={(e) => handleBlindBoxChange(index, 'name', e.target.value)}
                            />
                            <Upload
                                showUploadList={false}
                                customRequest={(options) => handleBlindBoxImageUpload(options, index)}
                            >
                                <Button icon={<UploadOutlined />}>上传盲盒图片</Button>
                            </Upload>
                            {item.image && <img src={item.image} alt="box" className={styles.blindBoxImage} />}
                            <Input
                                placeholder="编号"
                                value={item.serialNumber}
                                onChange={(e) => handleBlindBoxChange(index, 'serialNumber', e.target.value)}
                            />
                            <InputNumber
                                min={0.01}
                                max={1}
                                step={0.01}
                                value={item.probability}
                                onChange={(value) => handleBlindBoxChange(index, 'probability', value)}
                                placeholder="抽中概率"
                            />
                        </Space>
                    </Card>
                ))}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        创建商品
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateProductPage;
