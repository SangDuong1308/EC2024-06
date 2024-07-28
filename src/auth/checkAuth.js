'use strict';

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization' 
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
} 

module.exports = { asyncHandler }

