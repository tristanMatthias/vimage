function ServerError(message, status, field) {
    this.message = message;
    this.status = status || 500;
    this.field = field;
}
ServerError.prototype = Error.prototype;


module.exports["ServerError"] = ServerError;