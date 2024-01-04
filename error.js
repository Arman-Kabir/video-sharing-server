// mern stack booking app- error handling explained in details

export const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
}