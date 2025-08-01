import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DrawPage.module.css';
import logo from '/src/assets/boxlogo.png';
import axios from 'axios';

export default function DrawPage() {
    const { productId } = useParams();
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [mode, setMode] = useState(null); // 'single' or 'multiple'
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:7002/draw/${productId}`).then(res => {
            if (res.data.success) {
                setBlindBoxes(res.data.data || []);
            }
        });
    }, [productId]);

    const handleSelectOne = () => {
        setMode('single');
        setSelectedIndexes([]); // 清空选择
    };

    const handleSelectMultiple = () => {
        setMode('multiple');
        setSelectedIndexes([]); // 清空选择
    };

    const toggleCheckbox = (index) => {
        if (blindBoxes[index].isDrawn) return;

        if (mode === 'single') {
            setSelectedIndexes([index]);
        } else if (mode === 'multiple') {
            setSelectedIndexes(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            );
        }
    };

    const handleConfirmDraw = async () => {
        if (selectedIndexes.length === 0) {
            alert('请选择盲盒');
            return;
        }

        try {
            const res = await axios.post('http://localhost:7002/draw/mark', {
                productId,
                indexes: selectedIndexes,
            });

            if (res.data.success && res.data.data) {
                const data = res.data.data;
                if (Array.isArray(data)) {
                    const orderIds = data.map(item => item.orderId);
                    navigate(`/settle-multi?orderIds=${orderIds.join(',')}`);
                } else {
                    navigate(`/settle/${data.orderId}`);
                }
            } else {
                alert('抽奖失败');
            }
        } catch (err) {
            alert('请求失败');
        }
    };
    const handleCancel = () => {
        setMode(null);
        setSelectedIndexes([]);
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
                                    style={{ opacity: selectedIndexes.includes(index) ? 0.5 : 1 }}
                                    onClick={() => toggleCheckbox(index)}
                                />
                                {mode && (
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedIndexes.includes(index)}
                                        onChange={() => toggleCheckbox(index)}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.buttons}>
                {mode !== 'multiple' && (
                    <button className={styles.drawBtn} onClick={handleSelectOne}>
                        随机选一盒
                    </button>
                )}
                {mode !== 'single' && (
                    <button className={styles.drawBtn} onClick={handleSelectMultiple}>
                        一次抽多盒
                    </button>
                )}
                {mode && (
                   <>
                    <button className={styles.drawBtn} onClick={handleConfirmDraw}>
                        确认抽取
                    </button>
                    <button className={styles.drawBtn} onClick={handleCancel}>
                        取消选择
                    </button>
                    </>
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
