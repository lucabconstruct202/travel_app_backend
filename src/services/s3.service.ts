import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new S3Client({
    region: 'fra1', // notwendig für DO
    endpoint: process.env.STORAGE_URL, // wichtig: eigener Endpoint
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    }
  })

  export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
    const filename = `${uuidv4()}_${file.originalname}`
    const key = `${filename}` // Better: do not include bucket name in Key
  
    const command = new PutObjectCommand({
      Bucket: process.env.STORAGE_NAME!, // e.g., "bavox-file-storage"
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    })
  
    try {
      const response = await s3.send(command)
  
      // Optional debug: log the upload metadata
      console.log('Upload successful:', {
        key,
        bucket: process.env.STORAGE_NAME,
        response,
      })
  
      return `${process.env.STORAGE_EXTERNAL_URL}/${key}`

    } catch (error: any) {
      console.error('S3 Upload failed:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        bucket: process.env.STORAGE_NAME,
        key,
        contentType: file.mimetype,
      })
  
      throw new Error('File upload to S3 failed')
    }
  }

export const deleteFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.STORAGE_NAME,
    Key: key
  })
  await s3.send(command)
}
