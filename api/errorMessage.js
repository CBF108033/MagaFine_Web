export const errorMessage = (status, message,err)=>{
    const error = new Error();
    const originalError = err?.message || "條件錯誤";
    error.status = status;
    error.message = message;
    error.detail = originalError;
    return error;
}