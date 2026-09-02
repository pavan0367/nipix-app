const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Like = require('./Like');
const Follow = require('./Follow');
const Story = require('./Story');
const Reel = require('./Reel');
const Conversation = require('./Conversation');
const ConversationMember = require('./ConversationMember');
const Message = require('./Message');
const Notification = require('./Notification');
const Report = require('./Report');
const Hashtag = require('./Hashtag');
const PostHashtag = require('./PostHashtag');
const BlockedUser = require('./BlockedUser');
const SavedPost = require('./SavedPost');

// User & Post Associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Comment Associations
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'commenter' });

// Like Associations
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'liker' });

// Follow & Block Associations
User.belongsToMany(User, { through: Follow, as: 'followers', foreignKey: 'followingId' });
User.belongsToMany(User, { through: Follow, as: 'following', foreignKey: 'followerId' });
User.belongsToMany(User, { through: BlockedUser, as: 'blockedUsers', foreignKey: 'blockedId' });
User.belongsToMany(User, { through: BlockedUser, as: 'blockedBy', foreignKey: 'blockerId' });

// Story & Reel Associations
User.hasMany(Story, { foreignKey: 'userId', as: 'stories' });
Story.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Reel, { foreignKey: 'userId', as: 'reels' });
Reel.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Saved Post Associations
User.hasMany(SavedPost, { foreignKey: 'userId', as: 'savedPosts' });
Post.hasMany(SavedPost, { foreignKey: 'postId', as: 'savedBy' });
SavedPost.belongsTo(User, { foreignKey: 'userId' });
SavedPost.belongsTo(Post, { foreignKey: 'postId' });

// Messaging Associations
Conversation.belongsToMany(User, { through: ConversationMember, foreignKey: 'conversationId' });
User.belongsToMany(Conversation, { through: ConversationMember, foreignKey: 'userId' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// Notification Associations
User.hasMany(Notification, { foreignKey: 'recipientId', as: 'notifications' });
User.hasMany(Notification, { foreignKey: 'senderId', as: 'sentNotifications' });
Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// Report Associations
User.hasMany(Report, { foreignKey: 'reporterId', as: 'reportsMade' });
User.hasMany(Report, { foreignKey: 'reportedUserId', as: 'reportsReceived' });
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
Report.belongsTo(User, { foreignKey: 'reportedUserId', as: 'reportedUser' });

// Hashtag Associations
Post.belongsToMany(Hashtag, { through: PostHashtag, foreignKey: 'postId' });
Hashtag.belongsToMany(Post, { through: PostHashtag, foreignKey: 'hashtagId' });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  Follow,
  Story,
  Reel,
  Conversation,
  ConversationMember,
  Message,
  Notification,
  Report,
  Hashtag,
  PostHashtag,
  BlockedUser,
  SavedPost
};