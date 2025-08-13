import { queryParams, type QueryParams } from './../../../../../../wayfinder'
/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:59
* @route '/dashboard/menu/{menu}'
*/
export const index = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/{menu}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:59
* @route '/dashboard/menu/{menu}'
*/
index.url = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return index.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:59
* @route '/dashboard/menu/{menu}'
*/
index.get = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::index
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:59
* @route '/dashboard/menu/{menu}'
*/
index.head = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:96
* @route '/dashboard/menu/stream/{menu}'
*/
export const stream = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/stream/{menu}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:96
* @route '/dashboard/menu/stream/{menu}'
*/
stream.url = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return stream.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:96
* @route '/dashboard/menu/stream/{menu}'
*/
stream.get = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:96
* @route '/dashboard/menu/stream/{menu}'
*/
stream.head = (args: { menu: string | number | { google_drive_id: string | number } } | [menu: string | number | { google_drive_id: string | number } ] | string | number | { google_drive_id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: stream.url(args, options),
    method: 'head',
})

const ManageDynamicPage = { index, stream }

export default ManageDynamicPage