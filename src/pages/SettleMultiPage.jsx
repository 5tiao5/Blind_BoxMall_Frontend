import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './SettleMultiPage.module.css';
import gif from  '../assets/box.gif'
export default function SettleMultiPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [paid, setPaid] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const orderIds = new URLSearchParams(location.search)
        .get('orderIds') // ✅ 注意这里是 orderIds 而不是 orders
        ?.split(',')
        .map(id => Number(id))
        .filter(id => !isNaN(id));

    useEffect(() => {
        if (!orderIds || orderIds.length === 0) return;

        axios.get('http://localhost:7002/order/all').then(res => {
            if (res.data.success) {
                const allOrders = res.data.data;
                const filtered = allOrders.filter(o => orderIds.includes(o.id));
                setOrders(filtered);
            }
        });
    }, [location.search]);

    const handlePay = async () => {
        const res = await axios.post('http://localhost:7002/order/mutipay', orderIds);
        if (res.data.success) {
            setPaid(true);
            const refreshed = await axios.get('http://localhost:7002/order/all');
            if (refreshed.data.success) {
                const updatedOrders = refreshed.data.data.filter(o => orderIds.includes(o.id));
                setOrders(updatedOrders);
            }
            setTimeout(() => setShowResult(true), 2000); // 播放动画后显示
        } else {
            alert(res.data.message || '支付失败');
        }
    };

    const handleBack = () => {
        if (orders.length > 0) {
            navigate(`/draw/${orders[0].product.id}`, { replace: true });
            //window.location.reload();
        }
    };

    if (!orderIds || orderIds.length === 0) return <div className={styles.loading}>订单参数错误</div>;
    if (!orders || orders.length === 0) return <div className={styles.loading}>加载中...</div>;

    const totalPrice = orders.reduce((sum, o) => sum + (o.product?.price || 0), 0);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>🎁 多个订单结算</h2>

            {!paid ? (
                <>
                    <p className={styles.priceText}>总计需支付：{totalPrice}元</p>
                    <div className={styles.buttonGroup}>
                        <button className={styles.payBtn} onClick={handlePay}>确认支付</button>
                        <button className={styles.payBtn} onClick={handleBack}>暂不支付</button>
                    </div>
                </>
            ) : !showResult ? (
                <div className={styles.animContainer}>
                    <img src={gif} alt="抽奖中" className={styles.anim} />
                    <div className={styles.animText}>正在揭晓结果...</div>
                </div>
            ) : (
                <>
                    <h3>🎉 支付成功，您抽中了以下盲盒：</h3>
                    <div className={styles.cardContainer}>
                        {orders.map(order => (
                            <div className={styles.card} key={order.id}>
                                <img src={order.blindBox.image} alt="盲盒" className={styles.image} />
                                <div className={styles.name}>{order.blindBox.name}</div>
                                <div>序号：{order.blindBox.serialNumber}</div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.backBtn} onClick={handleBack}>返回抽盒页</button>
                </>
            )}
        </div>
    );
}
