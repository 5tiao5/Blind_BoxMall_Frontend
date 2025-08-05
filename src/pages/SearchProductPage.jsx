import React, { useState } from 'react';
import axios from 'axios';
import styles from './SearchProductPage.module.css';
import { Input, Button, message } from 'antd';
import {SearchOutlined} from "@ant-design/icons";

const SearchProductPage = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!keyword.trim()) {
            message.warning('请输入关键词');
            return;
        }

        const res = await axios.get('http://localhost:7002/product/search', {
            params: { keyword }
        });

        if (res.data.success) {
            setResults(res.data.data);
        } else {
            message.error(res.data.message || '搜索失败');
        }
    };

    const handleClick = (id) => {
        // 例如跳转到抽盒页面
        window.location.href = `/draw/${id}`;
    };

    return (
        <div className={styles.page}>
            <div className={styles.searchBar}>
                <Input
                    placeholder="请输入商品名称"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                    suffix={
                        <SearchOutlined
                            onClick={handleSearch}
                            style={{ color: '#888', cursor: 'pointer', fontSize: 18 }}
                        />
                    }
                />
                <Button type="primary" onClick={handleSearch}>搜索</Button>
            </div>

            <div className={styles.container}>
                {results.map(product => (
                    <div
                        key={product.id}
                        className={styles.card}
                        onClick={() => handleClick(product.id)}
                    >
                        <img src={product.image} alt={product.name} className={styles.image} />
                        <div className={styles.info}>
                            <h3>{product.name}</h3>
                            <p>{product.price} 元 / 抽</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchProductPage;
