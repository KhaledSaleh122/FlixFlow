

export function errorHandler(error){
    return {
        err_status_code:error.status?error.status:500,
        err:error.message || error.statusText? error.message || error.statusText:"Server Side Error, Please try again later",
        err_code:error.code
    };   
}