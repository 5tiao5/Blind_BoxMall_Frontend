import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import axios from 'axios';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUsername(localStorage.getItem('username') || '');
        }
        axios.get('http://localhost:7002/product/all').then(res => {
            if (res.data.success) setProducts(res.data.data);
        });
    }, []);

    const handleClick = (productId) => {
        if (!username) {
            navigate('/login');
        } else {
            navigate(`/draw/${productId}`);
        }
    };

    return (
        <div className={styles.container}>
            {products.map(product => (
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
    );
}
