const AWS = require('aws-sdk');

// AWS.config.update({
//   accessKeyId: 'AKIAZETRMJ7Q32COLSBZ',
//   secretAccessKey: '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',
//   region: 'us-east-2'
// });
AWS.config.update({
  accessKeyId: 'AKIASGRVSXQVGDEXKNXB',
  secretAccessKey: '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',
  region: 'us-east-2'
});
// AKIASGRVSXQVGDEXKNXB
// rEZ+L79C8EvmSdKBIkzch+QrDCGE71fw0uWheXs/
// Create an instance of the S3 service
const s3 = new AWS.S3();

// Function to upload an object to an S3 bucket
exports.uploadToS3 = (objectKey, base64String) => {
  console.log('objectKey',objectKey);
  // const params = {
  //   Bucket: 'harish-mybucket', // Replace with your bucket name
  //   Key: objectKey,
  //   Body: require('fs').createReadStream(filePath)
  // };
  const buffer = Buffer.from(base64String, 'base64');
  objectKey = String(objectKey);
console.log('buffer',buffer);
  const params = {
    Bucket: 'harish-mybucket', // Replace with your bucket name
    Key: objectKey,
    Body: buffer,
    ContentType: 'image/jpeg', // Adjust the content type according to your image type
    ContentType: 'text/plain', // If your image is already encoded, otherwise omit this line

  };
  // const params = {
  //   Bucket: bucketName,
  //   Key: objectKey,
  //   Body: buffer,
  //   ContentType: 'image/jpeg', // Change according to your image type
  //   ContentEncoding: 'base64' // If your image is already encoded, otherwise omit this line
  // };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error uploading object to S3:', err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};
// Function to upload an object to an S3 bucket
exports.uploadToS3business_id = (objectKey, filePath) => {
  console.log('objectKey',objectKey);
  const params = {
    Bucket: 'secretworld', // Replace with your bucket name
    Key: 'business_id/' +objectKey,
    Body: require('fs').createReadStream(filePath)
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error uploading object to S3:', err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};
// Function to upload an object to an S3 bucket
exports.uploadToS3cover_photo = (objectKey, filePath) => {
  console.log('objectKey',objectKey);
  const params = {
    Bucket: 'secretworld', // Replace with your bucket name
    Key: 'coverphotos/' +objectKey,
    Body: require('fs').createReadStream(filePath)
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error uploading object to S3:', err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};
exports.deleteToS3= (imageUrl) => {
  const objectKey = decodeURIComponent(imageUrl.split('/').pop())
  console.log('objectKey',objectKey);
  const params = {
    Bucket: 'secretworld', // Replace with your bucket name
    Key:'userprofile/'+objectKey
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log('Error uploading object to S3:', err);
        reject(err);
      } else {
        console.log('Object uploaded successfully:', data);
        resolve(data);
      }
    });
  });
};
exports.deleteToS3coverphotos = (imageUrl) => {
  const objectKey = decodeURIComponent(imageUrl.split('/').pop())
  const params = {
    Bucket: 'secretWorld', // Replace with your bucket name
    Key:'coverphotos/'+ objectKey
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log('Error uploading object to S3:', err);
        reject(err);
      } else {
        console.log('Object uploaded successfully:', data);
        resolve(data);
      }
    });
  });
};
exports.deleteToS3business_id = (imageUrl) => {
  const objectKey = decodeURIComponent(imageUrl.split('/').pop())
  const params = {
    Bucket: 'secretWorld', // Replace with your bucket name
    Key:'business_id/'+ objectKey
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log('Error uploading object to S3:', err);
        reject(err);
      } else {
        console.log('Object uploaded successfully:', data);
        resolve(data);
      }
    });
  });
};

