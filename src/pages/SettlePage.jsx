import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SettlePage.module.css';

export default function SettlePage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [paid, setPaid] = useState(false);
    const [showResult, setShowResult] = useState(false); // 控制盲盒展示
    const navigate = useNavigate();

    useEffect(() => {
        // 获取订单信息（仅价格）
        axios.get('http://localhost:7002/order/all').then(res => {
            if (res.data.success) {
                const found = res.data.data.find(o => o.id === Number(orderId));
                if (found) setOrder(found);
            }
        });
    }, [orderId]);

    const handlePay = async () => {
        const res = await axios.post(`http://localhost:7002/order/pay/${orderId}`);
        if (res.data.success) {
            setPaid(true);
            // 再次拉取订单信息（确保盲盒信息有更新）
            const refreshed = await axios.get('http://localhost:7002/order/all');
            if (refreshed.data.success) {
                const found = refreshed.data.data.find(o => o.id === Number(orderId));
                if (found) setOrder(found);
            }

            // 播放动画 3 秒后展示结果
            setTimeout(() => setShowResult(true), 2000);
        } else {
            alert('支付失败');
        }
    };

    const handleBack = () => {
        if (order?.product?.id) {
            navigate(`/draw/${order.product.id}`, { replace: true });
            window.location.reload();
        }
    };

    if (!order) return <div>加载中...</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>订单结算</h2>
            {!paid ? (
                <>
                    <p className={styles.priceText}>请支付 ¥{order.product.price}</p>
                    <button onClick={handlePay} className={styles.payBtn}>确认支付</button>
                </>
            ) : !showResult ? (
                <div className={styles.animContainer}>
                    <img
                        src="/src/assets/box.gif"
                        alt="中奖动画"
                        className={styles.anim}
                    />
                    <div className={styles.animText}>正在揭晓结果...</div>
                </div>
            ) : (
                <div className={styles.card}>
                    <h3>🎉 支付成功，您抽中了：</h3>
                    <img src={order.blindBox.image} className={styles.image} alt="盲盒" />
                    <div className={styles.name}>{order.blindBox.name}</div>
                    <div>序号：{order.blindBox.serialNumber}</div>
                    <button onClick={handleBack} className={styles.backBtn}>返回抽盒页</button>
                </div>
            )}
        </div>
    );
}
