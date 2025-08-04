import React, { useEffect, useState } from 'react';
import { Upload, Input, Button, Select, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import styles from './PlayerShowCreatePage.module.css';

const PlayerShowCreatePage = ({ navigate }) => {
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [productId, setProductId] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:7002/product/all').then(res => {
            if (res.data.success) setProducts(res.data.data);
        });
    }, []);

    const handleUploadChange = ({ fileList }) => {
        // 手动设置每个文件的 url（用于显示）
        const newList = fileList.map(file => {
            if (file.response && file.response.success && file.response.url) {
                return {
                    ...file,
                    url: file.response.url,
                };
            }
            return file;
        });
        setFileList(newList);
    };

    const handleSubmit = async () => {
        if (!title.trim()) return message.warning('标题不能为空');
        if (fileList.length === 0) return message.warning('请上传至少一张图片');
        if (!productId) return message.warning('请选择一个关联商品');

        const imageUrls = fileList.map(f => f.url);
        const res = await axios.post('http://localhost:7002/playershow/create', {
            productId,
            title,
            content,
            images: imageUrls,
        });

        if (res.data.success) {
            message.success('发布成功');
            navigate('/playershow');
        } else {
            message.error(res.data.message || '发布失败');
        }
    };

    return (
        <Card className={styles.card}>
            <h2>发布玩家秀</h2>
            <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="标题（必填）"
                style={{ marginBottom: 10 }}
            />
            <Input.TextArea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="内容（可选）"
                rows={4}
                style={{ marginBottom: 10 }}
            />
            <Select
                value={productId}
                onChange={setProductId}
                placeholder="选择关联商品"
                style={{ width: '100%', marginBottom: 10 }}
                optionLabelProp="label"
            >
                {products.map(p => (
                    <Select.Option
                        key={p.id}
                        value={p.id}
                        label={p.name}
                    >
                        <div className={styles.optionItem}>
                            <img
                                src={p.image}
                                alt="商品图"
                                className={styles.optionImage}
                            />
                            <span className={styles.optionText}>{p.name}</span>
                        </div>
                    </Select.Option>
                ))}
            </Select>
            <Upload
                action="http://localhost:7002/upload/image"
                listType="picture-card"
                name="file"
                fileList={fileList}
                onChange={handleUploadChange}
                multiple
                accept="image/*"
            >
                {fileList.length < 9 && <UploadOutlined />}
            </Upload>
            <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
                发布
            </Button>
        </Card>
    );
};

export default PlayerShowCreatePage;
