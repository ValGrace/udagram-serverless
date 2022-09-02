import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export class AttachmentUtils {
       
    constructor (
        private readonly s3Client = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucket = process.env.ATTACHMENT_S3_BUCKET,
        private readonly signed = process.env.SIGNED_URL_EXPIRATION,
    ){}

    async createAttachmentPresignedUrl(todoId: string): Promise<string> {
       
        const url = await this.s3Client.getSignedUrl('putObject', {
            Bucket: this.bucket,
            Key: {
             id: todoId
            },
            Expires: this.signed
        })
        return url
        
     }  
}