import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Api\Actions\StreamVideo::__invoke
* @see app/Domains/Api/Actions/StreamVideo.php:17
* @route '/api/stream/{menu}'
*/
const StreamVideo = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: StreamVideo.url(args, options),
    method: 'get',
})

StreamVideo.definition = {
    methods: ['get','head'],
    url: '/api/stream/{menu}',
}

/**
* @see \App\Domains\Api\Actions\StreamVideo::__invoke
* @see app/Domains/Api/Actions/StreamVideo.php:17
* @route '/api/stream/{menu}'
*/
StreamVideo.url = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'google_drive_id' in args) {
        args = { menu: args.google_drive_id }
    }

    if (Array.isArray(args)) {
        args = {
            menu: args[0],
        }
    }

    const parsedArgs = {
        menu: typeof args.menu === 'object'
        ? args.menu.google_drive_id
        : args.menu,
    }

    return StreamVideo.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Api\Actions\StreamVideo::__invoke
* @see app/Domains/Api/Actions/StreamVideo.php:17
* @route '/api/stream/{menu}'
*/
StreamVideo.get = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: StreamVideo.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Api\Actions\StreamVideo::__invoke
* @see app/Domains/Api/Actions/StreamVideo.php:17
* @route '/api/stream/{menu}'
*/
StreamVideo.head = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: StreamVideo.url(args, options),
    method: 'head',
})

export default StreamVideo