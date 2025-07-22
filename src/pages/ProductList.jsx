import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';

export default function ProductList({ onEdit }) {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:7002/product/all'); // 你可能需要在后端添加一个获取全部商品的接口
        if (res.data.success) setProducts(res.data.data);
        console.log(res.data);
    };

    useEffect(() => { fetchProducts(); }, []);

    const deleteProduct = async (id) => {
        const res = await axios.post(`http://localhost:7002/product/delete/${id}`);
        if (res.data.success) {
            message.success('删除成功');
            fetchProducts();
        }
    };

    const columns = [
        { title: '名称', dataIndex: 'name' },
        { title: '价格', dataIndex: 'price' },
        { title: '描述', dataIndex: 'description' },
        {
            title: '操作',
            render: (_, record) => (
                <>
                    <Button onClick={() => onEdit(record)}>编辑</Button>
                    <Popconfirm title="确认删除？" onConfirm={() => deleteProduct(record.id)}>
                        <Button danger style={{ marginLeft: 8 }}>删除</Button>
                    </Popconfirm>
                </>
            )
        },
    ];

    return <Table rowKey="id" dataSource={products} columns={columns} />;
}
