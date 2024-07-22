'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonPhrase = {
    FORBIDDEN: 'Forbidden Error',
    CONFLICT: 'Conflict Error'
}

class ErrorReponse extends Error{

    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorReponse {
    constructor(message = ReasonPhrase.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class ForbiddenRequestError extends ErrorReponse {
    constructor(message = ReasonPhrase.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError, ForbiddenRequestError
}