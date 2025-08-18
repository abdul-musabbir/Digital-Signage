import { queryParams, type QueryParams } from './../../wayfinder'
/**
* @see \App\Domains\Api\Lib\ServeImage::image
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
export const image = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: image.url(args, options),
    method: 'get',
})

image.definition = {
    methods: ['get','head'],
    url: '/dashboard/preview/{fileId}',
}

/**
* @see \App\Domains\Api\Lib\ServeImage::image
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
image.url = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return image.definition.url
            .replace('{fileId}', parsedArgs.fileId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Api\Lib\ServeImage::image
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
image.get = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: image.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Api\Lib\ServeImage::image
* @see app/Domains/Api/Lib/ServeImage.php:17
* @route '/dashboard/preview/{fileId}'
*/
image.head = (args: { fileId: string | number } | [fileId: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: image.url(args, options),
    method: 'head',
})

const preview = {
    image,
}

export default preview