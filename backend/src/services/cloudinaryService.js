// Cloudinary/S3 Upload Service
// Supports both Cloudinary and AWS S3 for file uploads

const uploadToCloudinary = async (fileBuffer, folder = 'certificates') => {
  try {
    // Check if cloudinary is available
    let cloudinary;
    try {
      cloudinary = require('cloudinary').v2;
    } catch (e) {
      console.log('Cloudinary not installed. Install with: npm install cloudinary');
      return null;
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('Cloudinary credentials not configured');
      return null;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          format: 'pdf'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

const uploadToS3 = async (fileBuffer, fileName, folder = 'certificates') => {
  try {
    // Check if AWS SDK is available
    let AWS;
    try {
      AWS = require('aws-sdk');
    } catch (e) {
      console.log('AWS SDK not installed. Install with: npm install aws-sdk');
      return null;
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET) {
      console.log('AWS S3 credentials not configured');
      return null;
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    const key = `${folder}/${fileName}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: 'application/pdf',
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    return null;
  }
};

// Main upload function - tries Cloudinary first, then S3, then returns null
const uploadFile = async (fileBuffer, fileName, folder = 'certificates') => {
  // Try Cloudinary first
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const cloudinaryUrl = await uploadToCloudinary(fileBuffer, folder);
    if (cloudinaryUrl) return cloudinaryUrl;
  }

  // Try S3
  if (process.env.AWS_S3_BUCKET) {
    const s3Url = await uploadToS3(fileBuffer, fileName, folder);
    if (s3Url) return s3Url;
  }

  // If neither is configured, return null
  console.log('No file storage service configured. Certificate URL will be null.');
  return null;
};

module.exports = {
  uploadToCloudinary,
  uploadToS3,
  uploadFile
};

