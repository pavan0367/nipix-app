-- Nipix Database Seed Data
-- Sample data for testing and development

-- Insert Admin User
INSERT INTO users (username, email, password, full_name, bio, role) VALUES
('admin', 'admin@nipix.com', '$2a$10$examplehashedpassword', 'Nipix Admin', 'Official Admin Account', 'admin');

-- Insert Test Users
INSERT INTO users (username, email, password, full_name, bio, profile_image) VALUES
('john_doe', 'john@example.com', '$2a$10$examplehashedpassword', 'John Doe', 'Photography enthusiast 📸', ''),
('jane_smith', 'jane@example.com', '$2a$10$examplehashedpassword', 'Jane Smith', 'Travel blogger ✈️', ''),
('alex_dev', 'alex@example.com', '$2a$10$examplehashedpassword', 'Alex Developer', 'Full-stack developer 💻', ''),
('sarah_art', 'sarah@example.com', '$2a$10$examplehashedpassword', 'Sarah Artist', 'Digital artist 🎨', ''),
('mike_fitness', 'mike@example.com', '$2a$10$examplehashedpassword', 'Mike Johnson', 'Fitness coach 💪', '');

-- Insert Sample Posts
INSERT INTO posts (user_id, caption, location, media_url, media_type) VALUES
(2, 'Beautiful sunset at the beach! ', 'Malibu Beach', 'https://via.placeholder.com/600x600', 'image'),
(3, 'Just finished a new project! #coding #webdev', 'San Francisco', 'https://via.placeholder.com/600x600', 'image'),
(4, 'New artwork completed! What do you think?', 'Home Studio', 'https://via.placeholder.com/600x600', 'image'),
(5, 'Morning workout complete! 💪', 'Local Gym', 'https://via.placeholder.com/600x600', 'image'),
(2, 'Coffee and code ☕', 'Coffee Shop', 'https://via.placeholder.com/600x600', 'image');

-- Insert Sample Comments
INSERT INTO comments (post_id, user_id, comment_text) VALUES
(1, 3, 'Amazing shot!'),
(1, 4, 'Love the colors!'),
(2, 2, 'Great work!'),
(3, 5, 'This is incredible!'),
(4, 3, 'Keep it up!');

-- Insert Sample Likes
INSERT INTO likes (user_id, post_id) VALUES
(3, 1),
(4, 1),
(2, 2),
(5, 3),
(3, 4),
(4, 5),
(2, 3);

-- Insert Sample Follows
INSERT INTO follows (follower_id, following_id) VALUES
(2, 3),
(2, 4),
(3, 2),
(4, 2),
(5, 2),
(3, 5),
(4, 5);

-- Insert Sample Hashtags
INSERT INTO hashtags (name) VALUES
('photography'),
('travel'),
('coding'),
('webdev'),
('art'),
('fitness'),
('sunset'),
('beach');

-- Insert Sample Notifications
INSERT INTO notifications (recipient_id, sender_id, type, message, is_read) VALUES
(2, 3, 'like', 'john_doe liked your post', FALSE),
(2, 4, 'comment', 'jane_smith commented on your post', FALSE),
(3, 2, 'follow', 'admin started following you', TRUE);

-- Insert Sample Conversation
INSERT INTO conversations (created_at) VALUES
(NOW());

-- Insert Conversation Members
INSERT INTO conversation_members (conversation_id, user_id) VALUES
(1, 2),
(1, 3);

-- Insert Sample Messages
INSERT INTO messages (conversation_id, sender_id, message_text, is_read) VALUES
(1, 2, 'Hey! How are you?', FALSE),
(1, 3, 'I am good! Thanks for asking.', FALSE),
(1, 2, 'Did you see the new features?', FALSE);

-- Insert Sample Reels
INSERT INTO reels (user_id, video_url, caption, views, shares) VALUES
(2, 'https://via.placeholder.com/400x700', 'Quick workout tips! 💪', 1250, 45),
(3, 'https://via.placeholder.com/400x700', 'Coding in 60 seconds', 890, 32);