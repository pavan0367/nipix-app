const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const PostMedia = require('./PostMedia');
const Comment = require('./Comment');
const Like = require('./Like');
const Follow = require('./Follow');
const Story = require('./Story');
const StoryView = require('./StoryView');
const Reel = require('./Reel');
const ReelLike = require('./ReelLike');
const ReelComment = require('./ReelComment');
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

// Post Media Associations
Post.hasMany(PostMedia, { foreignKey: 'postId', as: 'media' });
PostMedia.belongsTo(Post, { foreignKey: 'postId' });

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

// Story Associations
User.hasMany(Story, { foreignKey: 'userId', as: 'stories' });
Story.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Story.hasMany(StoryView, { foreignKey: 'storyId', as: 'views' });
StoryView.belongsTo(Story, { foreignKey: 'storyId' });
StoryView.belongsTo(User, { foreignKey: 'userId', as: 'viewer' });

// Reel Associations
User.hasMany(Reel, { foreignKey: 'userId', as: 'reels' });
Reel.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reel.hasMany(ReelLike, { foreignKey: 'reelId', as: 'likes' });
ReelLike.belongsTo(Reel, { foreignKey: 'reelId' });
ReelLike.belongsTo(User, { foreignKey: 'userId' });
Reel.hasMany(ReelComment, { foreignKey: 'reelId', as: 'comments' });
ReelComment.belongsTo(Reel, { foreignKey: 'reelId' });
ReelComment.belongsTo(User, { foreignKey: 'userId', as: 'commenter' });

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
  PostMedia,
  Comment,
  Like,
  Follow,
  Story,
  StoryView,
  Reel,
  ReelLike,
  ReelComment,
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