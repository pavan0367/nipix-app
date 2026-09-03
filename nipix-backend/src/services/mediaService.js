const cloudinary = require('../config/cloudinary');

class MediaService {
  async uploadMedia(file, folder = 'nipix') {
    if (!file) throw new Error('No file provided');

    // If Cloudinary configured and file has path or buffer
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && file.path) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          resource_type: 'auto',
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
          type: result.resource_type,
        };
      } catch (err) {
        console.warn('Cloudinary upload error, using local fallback:', err.message);
      }
    }

    // Local fallback path
    const cleanPath = file.path ? file.path.replace(/\\/g, '/') : file.filename;
    return {
      url: cleanPath,
      publicId: file.filename || 'local_file',
      type: file.mimetype?.startsWith('video') ? 'video' : 'image',
    };
  }
}

module.exports = new MediaService();
