import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PlayerShowList.module.css';
import { LikeOutlined, EditOutlined } from '@ant-design/icons';

const PlayerShowList = () => {
    const [shows, setShows] = useState([]);
    const [likedMap, setLikedMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:7002/playershow/all').then(res => {
            if (res.data.success) {
                setShows(res.data.data);
                const liked = {};
                res.data.data.forEach(show => {
                    if (localStorage.getItem(`liked-${show.id}`)) {
                        liked[show.id] = true;
                    }
                });
                setLikedMap(liked);
            }
        });
    }, []);

    const handleLike = (id) => {
        if (likedMap[id]) return;
        axios.post(`http://localhost:7002/playershow/like/${id}`).then(res => {
            if (res.data.success) {
                setShows(prev =>
                    prev.map(show =>
                        show.id === id ? { ...show, likes: show.likes + 1 } : show
                    )
                );
                const updated = { ...likedMap, [id]: true };
                setLikedMap(updated);
                localStorage.setItem(`liked-${id}`, 'true');
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {shows.map(show => (
                    <div key={show.id} className={styles.card} onClick={() => navigate(`/playershow/detail/${show.id}`)}>
                        <img src={show.images[0]} alt="封面" className={styles.image} />
                        <div className={styles.title}>{show.title}</div> {/* ✅ 新增标题显示 */}
                        <div className={styles.bottomBar}>
                            <div className={styles.user}>
                                <img src={show.user.avatar} alt="头像" className={styles.avatar} />
                                <span>{show.user.username}</span>
                            </div>
                            <div
                                className={styles.like}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(show.id);
                                }}
                            >
                                <LikeOutlined style={{ color: likedMap[show.id] ? 'red' : '#aaa' }} />
                                <span>{show.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <EditOutlined className={styles.editIcon} onClick={() => navigate('/playershow/create')} />
        </div>
    );
};

export default PlayerShowList;
