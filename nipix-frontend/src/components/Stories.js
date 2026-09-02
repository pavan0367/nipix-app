import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryViewer from './StoryViewer';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [viewingStory, setViewingStory] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await axios.get('/stories/feed');
            setStories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openStory = (userStories, index) => {
        setViewingStory(userStories);
        setCurrentIndex(index);
    };

    const closeStory = () => {
        setViewingStory(null);
    };

    return (
        <>
            <div style={{
                background: '#fff',
                border: '1px solid #dbdbdb',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
            }}>
                {stories.length === 0 && <p style={{ color: '#8e8e8e', textAlign: 'center' }}>No stories yet. Follow people to see their stories!</p>}

                {stories.map((userStory, idx) => (
                    <div
                        key={userStory.user.id}
                        onClick={() => openStory(userStory, idx)}
                        style={{
                            display: 'inline-block',
                            margin: '0 10px',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                            padding: '3px'
                        }}>
                            <img
                                src={userStory.user.profilePic || 'https://via.placeholder.com/150'}
                                alt={userStory.user.username}
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    border: '3px solid #fff',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '12px', marginTop: '5px', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {userStory.user.username}
                        </p>
                    </div>
                ))}
            </div>

            {viewingStory && (
                <StoryViewer
                    stories={viewingStory.stories}
                    user={viewingStory.user}
                    currentIndex={currentIndex}
                    onClose={closeStory}
                />
            )}
        </>
    );
};

export default Stories;