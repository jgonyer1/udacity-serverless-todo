import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
export class ImagesAccess{
  constructor(
    private readonly imagesBucket = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION){}
  getSignedUrl(todoId: string, userId: string) {
    try{
      console.log(`geting signed url for user and todo: ${userId}_${todoId}`);
      return s3.getSignedUrl('putObject', {
        Bucket: this.imagesBucket,
        Key: `${userId}_${todoId}`,
        Expires: this.urlExpiration
      })
    }catch(e){
      console.error(`${e}`);
    }
    
  }
}
