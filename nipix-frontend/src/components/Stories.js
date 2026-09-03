import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import StoryViewer from './StoryViewer';
import { Plus } from 'lucide-react';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [viewingStory, setViewingStory] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentUser = useSelector((state) => state.auth?.user);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await axios.get('/stories/feed');
            const data = Array.isArray(res.data) ? res.data : [];
            setStories(data);
        } catch (err) {
            console.error('Fetch stories error:', err);
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
            <div className="glass-card" style={{
                padding: '16px 20px',
                marginBottom: '28px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '18px'
            }}>
                {/* Your Story item */}
                <div style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <div style={{ position: 'relative', width: '68px', height: '68px' }}>
                        <div className="story-ring" style={{ padding: '2.5px', width: '100%', height: '100%' }}>
                            <div className="story-avatar" style={{
                                width: '100%',
                                height: '100%',
                                background: 'var(--accent-purple)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {(currentUser?.username || 'Y')[0].toUpperCase()}
                            </div>
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            background: 'var(--accent-blue)',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid var(--bg-primary)',
                            color: '#fff'
                        }}>
                            <Plus size={14} />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.78rem', marginTop: '6px', color: '#fff', fontWeight: '500' }}>
                        Your story
                    </p>
                </div>

                {/* Other Stories */}
                {stories.map((userStory, idx) => {
                    const uName = userStory.user?.username || 'user';
                    const uPic = userStory.user?.profilePic || userStory.user?.profile_image;

                    return (
                        <div
                            key={userStory.user?.id || userStory.user?._id || idx}
                            onClick={() => openStory(userStory, idx)}
                            style={{
                                display: 'inline-block',
                                cursor: 'pointer',
                                textAlign: 'center',
                                flexShrink: 0
                            }}
                        >
                            <div className="story-ring" style={{ padding: '2.5px', width: '68px', height: '68px' }}>
                                {uPic ? (
                                    <img
                                        src={uPic}
                                        alt={uName}
                                        className="story-avatar"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="story-avatar"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            background: 'var(--accent-purple)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {uName[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <p style={{ fontSize: '0.78rem', marginTop: '6px', maxWidth: '68px', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)' }}>
                                {uName}
                            </p>
                        </div>
                    );
                })}
            </div>

            {viewingStory && viewingStory.stories && (
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