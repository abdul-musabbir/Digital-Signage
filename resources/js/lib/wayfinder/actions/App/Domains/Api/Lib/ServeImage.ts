import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/api/preview/{fileId}'
*/
const ServeImage241a81fb4db31793f640b7a79f877dc5 = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ServeImage241a81fb4db31793f640b7a79f877dc5.url(args, options),
    method: 'get',
})

ServeImage241a81fb4db31793f640b7a79f877dc5.definition = {
    methods: ['get','head'],
    url: '/api/preview/{fileId}',
}

/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/api/preview/{fileId}'
*/
ServeImage241a81fb4db31793f640b7a79f877dc5.url = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileId: args }
    }

    if (Array.isArray(args)) {
        args = {
            fileId: args[0],
        }
    }

    const parsedArgs = {
        fileId: args.fileId,
    }

    return ServeImage241a81fb4db31793f640b7a79f877dc5.definition.url
            .replace('{fileId}', parsedArgs.fileId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/api/preview/{fileId}'
*/
ServeImage241a81fb4db31793f640b7a79f877dc5.get = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ServeImage241a81fb4db31793f640b7a79f877dc5.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/api/preview/{fileId}'
*/
ServeImage241a81fb4db31793f640b7a79f877dc5.head = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ServeImage241a81fb4db31793f640b7a79f877dc5.url(args, options),
    method: 'head',
})

/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
const ServeImage00cb6d4dc5004968b7820deeac529719 = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ServeImage00cb6d4dc5004968b7820deeac529719.url(args, options),
    method: 'get',
})

ServeImage00cb6d4dc5004968b7820deeac529719.definition = {
    methods: ['get','head'],
    url: '/dashboard/preview/{fileId}',
}

/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
ServeImage00cb6d4dc5004968b7820deeac529719.url = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileId: args }
    }

    if (Array.isArray(args)) {
        args = {
            fileId: args[0],
        }
    }

    const parsedArgs = {
        fileId: args.fileId,
    }

    return ServeImage00cb6d4dc5004968b7820deeac529719.definition.url
            .replace('{fileId}', parsedArgs.fileId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
ServeImage00cb6d4dc5004968b7820deeac529719.get = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ServeImage00cb6d4dc5004968b7820deeac529719.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Api\Lib\ServeImage::__invoke
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
ServeImage00cb6d4dc5004968b7820deeac529719.head = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ServeImage00cb6d4dc5004968b7820deeac529719.url(args, options),
    method: 'head',
})

const ServeImage = {
    '/api/preview/{fileId}': ServeImage241a81fb4db31793f640b7a79f877dc5,
    '/dashboard/preview/{fileId}': ServeImage00cb6d4dc5004968b7820deeac529719,
}

export default ServeImage