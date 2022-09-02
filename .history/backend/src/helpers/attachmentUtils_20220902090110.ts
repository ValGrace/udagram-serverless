import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const logger = createLogger('attachmentUtils')
export class AttachmentUtils {
       
    constructor (
        private readonly s3Client = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucket = process.env.ATTACHMENT_S3_BUCKET
    ){}

    async createAttachmentPresignedUrl(todoId: string): Promise<string> {
       
        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.bucket,
            Key: {
             id: todoId
            },
            Expires: 1000 
        })
        logger.info(url)
        return url
        
     }  
}