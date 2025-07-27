// ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductDetailPage.module.css';
import axios from 'axios';

export default function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:7002/product/${productId}`).then(res => {
            if (res.data.success) {
                setProduct(res.data.data);
            }
        });
    }, [productId]);

    if (!product) return null;

    return (
        <div className={styles.container} style={{paddingTop: '50px'}}>
            <div className={styles.backButtonWrapper}>
                <div className={styles.backButton} onClick={() => navigate(`/draw/${productId}`)}>
                ⬇️ 返回抽盒界面
                </div>
            </div>

            <div className={styles.boxList}>
                {product.blindBoxItems.map((box, index) => (
                    <div key={index} className={styles.boxCard}>
                        <img src={box.image} className={styles.boxImage} />
                        <div className={styles.boxName}>{box.name}</div>
                    </div>
                ))}
            </div>

            <div className={styles.productDetail}>
                <img src={product.image} className={styles.productImage} />
                <h2 className={styles.productName}>商品名称：{product.name}</h2>
                <p className={styles.productDescription}>商品描述：{product.description}</p>
                <div className={styles.rules}><strong>抽奖规则：{product.rules}</strong></div>
            </div>
        </div>
    );
}
