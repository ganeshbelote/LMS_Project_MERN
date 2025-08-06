import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';

const processAndUploadVideo = async (inputPath, folderName = 'videos') => {
  const outputPath = path.join('public', `compressed_${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vcodec libx264',
        '-crf 28', 
        '-preset veryfast',
      ])
      .save(outputPath)
      .on('end', async () => {
        try {
          const result = await cloudinary.uploader.upload(outputPath, {
            resource_type: 'video',
            folder: folderName,
          });

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

export default processAndUploadVideo;
