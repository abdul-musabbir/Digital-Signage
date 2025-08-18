import { queryParams, type QueryParams } from './../../wayfinder'
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
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:58
* @route '/dashboard/menu/{menu}'
*/
export const view = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu/{menu}',
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::view
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:58
* @route '/dashboard/menu/{menu}'
*/
view.url = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return view.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::view
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:58
* @route '/dashboard/menu/{menu}'
*/
view.get = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: view.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::view
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:58
* @route '/dashboard/menu/{menu}'
*/
view.head = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: view.url(args, options),
    method: 'head',
})

/**
* @see \App\Domains\Menu\Actions\UpdateMenu::update
* @see app/Domains/Menu/Actions/UpdateMenu.php:17
* @route '/dashboard/menu/update/{menu}'
*/
export const update = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '/dashboard/menu/update/{menu}',
}

/**
* @see \App\Domains\Menu\Actions\UpdateMenu::update
* @see app/Domains/Menu/Actions/UpdateMenu.php:17
* @route '/dashboard/menu/update/{menu}'
*/
update.url = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { menu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            menu: args[0],
        }
    }

    const parsedArgs = {
        menu: typeof args.menu === 'object'
        ? args.menu.id
        : args.menu,
    }

    return update.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Actions\UpdateMenu::update
* @see app/Domains/Menu/Actions/UpdateMenu.php:17
* @route '/dashboard/menu/update/{menu}'
*/
update.put = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Domains\Menu\Actions\DeleteMenu::destroy
* @see app/Domains/Menu/Actions/DeleteMenu.php:17
* @route '/dashboard/menu/destroy/{menu}'
*/
export const destroy = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '/dashboard/menu/destroy/{menu}',
}

/**
* @see \App\Domains\Menu\Actions\DeleteMenu::destroy
* @see app/Domains/Menu/Actions/DeleteMenu.php:17
* @route '/dashboard/menu/destroy/{menu}'
*/
destroy.url = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { menu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            menu: args[0],
        }
    }

    const parsedArgs = {
        menu: typeof args.menu === 'object'
        ? args.menu.id
        : args.menu,
    }

    return destroy.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Actions\DeleteMenu::destroy
* @see app/Domains/Menu/Actions/DeleteMenu.php:17
* @route '/dashboard/menu/destroy/{menu}'
*/
destroy.delete = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Domains\Menu\Pages\View\ManageDynamicPage::stream
* @see app/Domains/Menu/Pages/View/ManageDynamicPage.php:96
* @route '/dashboard/menu/stream/{menu}'
*/
export const stream = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
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
stream.url = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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
stream.get = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
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
stream.head = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: stream.url(args, options),
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

const menu = {
    index,
    view,
    update,
    destroy,
    stream,
    upload,
}

export default menu