import { queryParams, type QueryParams } from './../../../wayfinder'
/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:105
* @route '/dashboard/menu/stream/{id}'
*/
export const stream = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/stream/{id}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:105
* @route '/dashboard/menu/stream/{id}'
*/
stream.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    const parsedArgs = {
        id: args.id,
    }

    return stream.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:105
* @route '/dashboard/menu/stream/{id}'
*/
stream.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:105
* @route '/dashboard/menu/stream/{id}'
*/
stream.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: stream.url(args, options),
    method: 'head',
})

const video = {
    stream,
}

export default video