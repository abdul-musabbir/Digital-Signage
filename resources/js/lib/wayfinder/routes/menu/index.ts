import { queryParams, type QueryParams } from './../../wayfinder'
import video from './video'
/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::index
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
export const index = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu',
}

/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::index
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::index
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::index
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::view
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/view/{id}'
*/
export const view = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/view/{id}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::view
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/view/{id}'
*/
view.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return view.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::view
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/view/{id}'
*/
view.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: view.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::view
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/view/{id}'
*/
view.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: view.url(args, options),
    method: 'head',
})

/**
* @see \App\Domains\Menu\Actions\UploadFiles::upload
* @see app/Domains/Menu/Actions/UploadFiles.php:17
* @route '/dashboard/menu/upload'
*/
export const upload = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ['post'],
    url: '/dashboard/menu/upload',
}

/**
* @see \App\Domains\Menu\Actions\UploadFiles::upload
* @see app/Domains/Menu/Actions/UploadFiles.php:17
* @route '/dashboard/menu/upload'
*/
upload.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Menu\Actions\UploadFiles::upload
* @see app/Domains/Menu/Actions/UploadFiles.php:17
* @route '/dashboard/menu/upload'
*/
upload.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: upload.url(options),
    method: 'post',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::show
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/{id}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::show
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::show
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::show
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:33
* @route '/dashboard/menu/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(args, options),
    method: 'head',
})

const menu = {
    index,
    view,
    upload,
    video,
    show,
}

export default menu