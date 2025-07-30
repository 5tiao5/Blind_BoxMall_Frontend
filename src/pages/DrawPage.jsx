import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DrawPage.module.css';
import logo from '/src/assets/boxlogo.png';
import axios from 'axios';

export default function DrawPage() {
    const { productId } = useParams();
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:7002/draw/${productId}`).then(res => {
            if (res.data.success) {
                setBlindBoxes(res.data.data || []);
            }
        });
    }, [productId]);

    const handleSelectOne = () => {
        setSelectMode(true); // 开启选择模式
    };

    const handleConfirmDraw = async () => {
        if (selectedIndex === null) {
            alert('请选择一个盲盒');
            return;
        }

        const res = await axios.post('http://localhost:7002/draw/mark', {
            productId,
            indexes: [selectedIndex],
        });

        if (res.data.success && res.data.data?.orderId) {
            navigate(`/settle/${res.data.data.orderId}`);
        } else {
            alert('抽奖失败');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {blindBoxes.map((box, index) => (
                    <div key={index} className={styles.box}>
                        <div className={styles.serial}>{index + 1}</div>

                        {box.isDrawn ? (
                            <div className={styles.sold}>已售出</div>
                        ) : (
                            <>
                                <img
                                    src={logo}
                                    alt="未抽"
                                    className={styles.logo}
                                    style={{ opacity: selectMode && selectedIndex === index ? 0.5 : 1 }}
                                />
                                {selectMode && !box.isDrawn && (
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedIndex === index}
                                        onChange={() => setSelectedIndex(index)}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.buttons}>
                <button className={styles.drawBtn} onClick={handleSelectOne}>
                    随机选一盒
                </button>
                {selectMode && (
                    <button className={styles.drawBtn} onClick={handleConfirmDraw}>
                        确认抽取
                    </button>
                )}
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
