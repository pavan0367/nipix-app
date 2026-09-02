import React, { useState, useEffect } from 'react';

const StoryViewer = ({ stories, user, currentIndex, onClose }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    if (currentStoryIndex < stories.length - 1) {
                        setCurrentStoryIndex(currentStoryIndex + 1);
                        return 0;
                    } else {
                        clearInterval(timer);
                        onClose();
                        return 100;
                    }
                }
                return prev + 2; // Progress bar speed
            });
        }, 100); // Update every 100ms (5 seconds total)

        return () => clearInterval(timer);
    }, [currentStoryIndex, stories.length, onClose]);

    const nextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
            setProgress(0);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Progress bars */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                display: 'flex',
                gap: '5px'
            }}>
                {stories.map((_, idx) => (
                    <div key={idx} style={{
                        flex: 1,
                        height: '3px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: idx < currentStoryIndex ? '100%' : idx === currentStoryIndex ? `${progress}%` : '0%',
                            height: '100%',
                            background: '#fff',
                            transition: 'width 0.1s linear'
                        }} />
                    </div>
                ))}
            </div>

            {/* User info */}
            <div style={{
                position: 'absolute',
                top: '30px',
                left: '20px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <img
                    src={user.profilePic || 'https://via.placeholder.com/150'}
                    alt={user.username}
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <span style={{ fontWeight: '600' }}>{user.username}</span>
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '30px',
                    cursor: 'pointer'
                }}
            >
                ×
            </button>

            {/* Story image */}
            <img
                src={`http://localhost:5000/${stories[currentStoryIndex].image}`}
                alt="Story"
                style={{
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain'
                }}
                onClick={nextStory}
            />

            {/* Navigation areas */}
            <div
                onClick={prevStory}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '30%',
                    cursor: 'pointer'
                }}
            />
            <div
                onClick={nextStory}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '30%',
                    cursor: 'pointer'
                }}
            />
        </div>
    );
};

export default StoryViewer;