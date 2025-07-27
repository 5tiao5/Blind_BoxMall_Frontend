import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DrawPage.module.css';
import logo from '/src/assets/boxlogo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DrawPage() {
    const { productId } = useParams();
    const [blindBoxes, setBlindBoxes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 获取盲盒状态
        axios.get(`http://localhost:7002/draw/${productId}`).then(res => {
            if (res.data.success) {
                setBlindBoxes(res.data.data || []);
            }
        });
    }, [productId]);

    const handleBoxClick = async (index) => {
        // 如果该盲盒已经抽中，则不允许再次抽取
        if (blindBoxes[index].isDrawn) {
            alert('该盲盒已被抽中');
            return;
        }

        // 请求后端标记该盲盒为已抽中
        const res = await axios.post('http://localhost:7002/draw/mark', {
            productId: productId,
            indexes: [index],
        });

        if (res.data.success) {
            // 更新前端状态，显示已抽中
            const updatedBlindBoxes = [...blindBoxes];
            updatedBlindBoxes[index].isDrawn = true;
            setBlindBoxes(updatedBlindBoxes);
        } else {
            console.log(res.data);
            alert('抽奖失败');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {blindBoxes.map((box, index) => (
                    <div key={index} className={styles.box} onClick={() => handleBoxClick(index)}>
                        {/* 左上角序号显示 */}
                        <div className={styles.serial}>{box.index + 1}</div>

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

            <div className={styles.detailButtonContainer}>
                <button
                    className={styles.detailButton}
                    onClick={() => navigate(`/product-detail/${productId}`)}
                >
                    ⬆️ 点击查看商品详情
                </button>
            </div>
        </div>
    );
}
