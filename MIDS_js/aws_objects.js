// Setting AWS Dynamo Credentials
AWS.config.update({accessKeyId: 'AKIAIMFC3YLEM7IZOOWA', secretAccessKey: '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'});
var s3 = new AWS.S3();

AWS.config.region = 'us-west-1';
var table = new AWS.DynamoDB({params: {TableName: 'SMARTCAM'}});
