import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './OrderListPage.module.css';
import {message} from "antd"; // 你可以用已有样式或创建一个新的 CSS Module

export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const fetchOrders = async (page) => {
        const res = await axios.get('http://localhost:7002/order/page', {
            params: {
                page,
                pageSize
            },
        });
        if (res.data.success) {
            setOrders(res.data.data);
            setTotalPages(res.data.totalPages);
        }
    };

    const handlePay = async (id) => {
        const res = await axios.post(`http://localhost:7002/order/pay/${id}`);
        if (res.data.success) {
            //alert('支付成功');
            message.success('支付成功');
            await fetchOrders(page);
        } else {
            alert(res.data.message || '支付失败');
        }
    };

    const handleCancel = async (id) => {
        const res = await axios.post(`http://localhost:7002/order/cancel`, [id]);
        if (res.data.success) {
            //alert('订单已取消');
            message.success('订单已取消');
            await fetchOrders(page);
        } else {
            alert(res.data.message || '取消失败');
        }
    };

    const handleRefund = async (id) => {
        const res = await axios.post(`http://localhost:7002/order/refund`, [id]);
        if (res.data.success) {
            //alert('退款成功');
            message.success('退款成功');
            await fetchOrders(page);
        } else {
            alert(res.data.message || '退款失败');
        }
    };
    const handleConfirm = async (id) => {
        const res = await axios.post(`http://localhost:7002/order/confirm/${id}`,null);
        if (res.data.success) {
            //alert('退款成功');
            message.success('收货成功');
            await fetchOrders(page);
        } else {
            alert(res.data.message || '收货失败');
        }
    };
    return (
        <div className={styles.container}>
            <h2>📦 我的订单</h2>
            {orders.length === 0 ? (
                <p>暂无订单</p>
            ) : (
                <ul className={styles.orderList}>
                    {orders.map(order => (
                        <li key={order.id} className={styles.orderItem}>
                            <div>
                                <strong>商品：</strong>{order.product.name}（¥{order.product.price}）
                            </div>
                            <div><strong>状态：</strong>{translateStatus(order.status)}</div>

                            {(order.status === 'paid'||order.status==='completed') && order.blindBox && (
                                <div className={styles.blindBoxInfo}>
                                    <img src={order.blindBox.image} alt="盲盒" className={styles.blindBoxImage} />
                                    <div>{order.blindBox.name}</div>
                                </div>
                            )}

                            <div className={styles.actions}>
                                {order.status === 'pending' && (
                                    <>
                                        <button onClick={() => handlePay(order.id)}>支付</button>
                                        <button onClick={() => handleCancel(order.id)}>取消</button>
                                    </>
                                )}
                                {order.status === 'paid' && (
                                    <>
                                    <button onClick={() => handleRefund(order.id)}>申请退款</button>
                                    <button onClick={() => handleConfirm(order.id)}>确认收货</button>
                                    </>
                                )}
                            </div>
                            <div className={styles.timeInfo}>
                                <div>创建时间：{formatDate(order.createTime)}</div>
                                {order.payTime && <div>支付时间：{formatDate(order.payTime)}</div>}
                                {order.arriveTime && <div>收货时间：{formatDate(order.arriveTime)}</div>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className={styles.pagination}>
                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>上一页</button>
                <span>第 {page} / {totalPages} 页</span>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>下一页</button>
            </div>
        </div>
    );
}

function translateStatus(status) {
    switch (status) {
        case 'pending': return '待支付';
        case 'paid': return '已支付';
        case 'cancelled': return '已取消';
        case 'completed': return '已完成';
        default: return status;
    }
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString(); // 也可用 toLocaleDateString() 只显示日期
}
