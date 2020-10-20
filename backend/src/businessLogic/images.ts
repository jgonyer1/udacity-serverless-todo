import { ImagesAccess } from '../dataLayer/ImagesAccess';
import {parseUserId} from '../auth/utils';
const imageAccess = new ImagesAccess();
export function generateUploadUrl(todoId: string, jwtToken: string){
    console.log(`Generate upload url for todoID: ${todoId}`);
    return imageAccess.getSignedUrl(todoId, parseUserId(jwtToken));
}