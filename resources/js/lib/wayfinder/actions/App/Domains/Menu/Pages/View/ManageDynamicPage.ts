import { queryParams, type QueryParams } from './../../../../../../wayfinder'
/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/view/{id}'
*/
const index0e25963496dad8a992353bb911d47855 = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index0e25963496dad8a992353bb911d47855.url(args, options),
    method: 'get',
})

index0e25963496dad8a992353bb911d47855.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/view/{id}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/view/{id}'
*/
index0e25963496dad8a992353bb911d47855.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return index0e25963496dad8a992353bb911d47855.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/view/{id}'
*/
index0e25963496dad8a992353bb911d47855.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index0e25963496dad8a992353bb911d47855.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/view/{id}'
*/
index0e25963496dad8a992353bb911d47855.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index0e25963496dad8a992353bb911d47855.url(args, options),
    method: 'head',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/{id}'
*/
const indexcd48874a6527238c1a6f1d2f4754b098 = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: indexcd48874a6527238c1a6f1d2f4754b098.url(args, options),
    method: 'get',
})

indexcd48874a6527238c1a6f1d2f4754b098.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/{id}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/{id}'
*/
indexcd48874a6527238c1a6f1d2f4754b098.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return indexcd48874a6527238c1a6f1d2f4754b098.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/{id}'
*/
indexcd48874a6527238c1a6f1d2f4754b098.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: indexcd48874a6527238c1a6f1d2f4754b098.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:35
* @route '/dashboard/menu/{id}'
*/
indexcd48874a6527238c1a6f1d2f4754b098.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: indexcd48874a6527238c1a6f1d2f4754b098.url(args, options),
    method: 'head',
})

export const index = {
    '/dashboard/menu/view/{id}': index0e25963496dad8a992353bb911d47855,
    '/dashboard/menu/{id}': indexcd48874a6527238c1a6f1d2f4754b098,
}

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

const ManageDynamicPage = { index, stream }

export default ManageDynamicPage