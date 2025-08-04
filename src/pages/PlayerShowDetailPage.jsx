import React, { useEffect, useState } from 'react';
import { Avatar, Input, Button, message } from 'antd';
import {LeftOutlined, LikeOutlined, RightOutlined} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // ✅ 新增
import styles from './PlayerShowDetailPage.module.css';

const PlayerShowDetailPage = () => {
    const { id } = useParams();            // ✅ 获取路由参数
    const navigate = useNavigate();        // ✅ 获取跳转方法
    const [show, setShow] = useState(null);
    const [imgIndex, setImgIndex] = useState(0);
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:7002/playershow/all').then(res => {
            const found = res.data.data.find(s => s.id === parseInt(id)); // ✅ 使用 useParams 中的 id
            if (found) {
                setShow(found);
                if (localStorage.getItem(`liked-${found.id}`)) {
                    setLiked(true);
                }
            }
        });
    }, [id]);

    const submitComment = async () => {
        if (!comment.trim()) return;
        const res = await axios.post('http://localhost:7002/playershow/comment', {
            showId: show.id,
            content: comment,
        });
        if (res.data.success) {
            message.success('评论成功');
            setShow({ ...show, comments: [...show.comments, res.data.data] });
            setComment('');
        }
    };
    const handleLike = async () => {
        if (liked || !show) return;
        const res = await axios.post(`http://localhost:7002/playershow/like/${show.id}`);
        if (res.data.success) {
            setLiked(true);
            localStorage.setItem(`liked-${show.id}`, 'true');
            setShow({ ...show, likes: show.likes + 1 }); // 更新 likes 数量
        }
    };
    if (!show) return <div>加载中...</div>;

    return (
        <div className={styles.detail}>
            <div className={styles.header}>
                <LeftOutlined onClick={() => navigate('/playershow')} />
            </div>
            <div className={styles.card}>
                <div className={styles.userInfo}>
                    <Avatar src={show.user.avatar} />
                    <div>
                        <div>{show.user.username}</div>
                        <div className={styles.time}>{new Date(show.createTime).toLocaleString()}</div>
                    </div>
                </div>
                <h2 className={styles.title}>{show.title}</h2>
                <div className={styles.imageArea}>
                    {/* 左侧箭头（只有当前不是第一张图片时显示） */}
                    {imgIndex > 0 && (
                        <LeftOutlined
                            onClick={() => setImgIndex(imgIndex - 1)}
                            className={styles.prevImg}
                        />
                    )}
                    <img src={show.images[imgIndex]} alt="展示图" />
                    {imgIndex < show.images.length - 1 &&
                        <RightOutlined onClick={() => setImgIndex(imgIndex + 1)} className={styles.nextImg} />
                    }
                </div>
                {show.content && (
                    <div className={styles.content}>
                        <p>{show.content}</p>
                    </div>
                )}
                <div className={styles.productInfo}>
                    <h>关联商品：</h>
                    <img src={show.product.image} alt="商品图" className={styles.productImg} />
                    <span>{show.product.name}</span>
                </div>
                <div className={styles.likeArea} onClick={handleLike}>
                    <LikeOutlined style={{ color: liked ? 'red' : '#aaa', fontSize: 18, marginRight: 6 }} />
                    <span>{show.likes}</span>
                </div>

                <div className={styles.commentArea}>
                    <h4>评论</h4>
                    {show.comments.map(c => (
                        <div key={c.id} className={styles.comment}>
                            <Avatar src={c.user.avatar} size="small" />
                            <div className={styles.commentContent}>
                                <div>{c.user.username}</div>
                                <div>{c.content}</div>
                            </div>
                            <div className={styles.commentTime}>{new Date(c.createTime).toLocaleString()}</div>
                        </div>
                    ))}
                    <Input.TextArea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="说点什么..."
                        rows={2}
                    />
                    <Button type="primary" onClick={submitComment}>评论</Button>
                </div>
            </div>
        </div>
    );
};

export default PlayerShowDetailPage;
