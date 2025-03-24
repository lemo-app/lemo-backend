const AWS = require('aws-sdk');
const { S3_BUCKET_NAME, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_URL } = process.env;

AWS.config.update({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
    region: S3_REGION
});

const s3 = new AWS.S3();

const uniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomString}-${originalName}`;
};

exports.uploadFileToS3 = (file) => {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: uniqueFileName(file.originalname), // You might want to use a unique identifier here
        Body: file.buffer,
        ContentType: file.mimetype
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.log('Error uploading to S3:', err);
                return reject(err);
            }
            resolve(`${S3_BUCKET_URL}/${data.Key}`);
        });
    });
};
