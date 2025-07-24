import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DrawPage.module.css';
import logo from '/src/assets/boxlogo.png';
import axios from 'axios';

export default function DrawPage() {
    const { productId } = useParams();
    const [blindBoxes, setBlindBoxes] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:7002/product/${productId}`).then(res => {
            if (res.data.success) {
                setBlindBoxes(res.data.data.blindBoxItems || []);
            }
        });
    }, [productId]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {blindBoxes.map((box, index) => (
                    <div key={index} className={styles.box}>
                        {/* 左上角序号显示 */}
                        <div className={styles.serial}>{box.serialNumber}</div>

                        {/* 中央内容：已售出 or logo */}
                        {box.isDrawn ? (
                            <div className={styles.sold}>已售出</div>
                        ) : (
                            <img src={logo} alt="未抽" className={styles.logo} />
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.buttons}>
                <button className={styles.drawBtn}>一次抽多盒</button>
                <button className={styles.drawBtn}>随机选一盒</button>
            </div>
        </div>
    );
}
