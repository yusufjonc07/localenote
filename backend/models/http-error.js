class HttpError extends Error {
    constructor(message, errorCode){
        super(message)
        self.code = errorCode
    }
}

module.exports = HttpError;