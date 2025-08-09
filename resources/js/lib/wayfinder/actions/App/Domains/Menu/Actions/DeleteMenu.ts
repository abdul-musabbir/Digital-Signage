import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Menu\Actions\DeleteMenu::__invoke
* @see app/Domains/Menu/Actions/DeleteMenu.php:17
* @route '/dashboard/menu/destroy/{menu}'
*/
const DeleteMenu = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: DeleteMenu.url(args, options),
    method: 'delete',
})

DeleteMenu.definition = {
    methods: ['delete'],
    url: '/dashboard/menu/destroy/{menu}',
}

/**
* @see \App\Domains\Menu\Actions\DeleteMenu::__invoke
* @see app/Domains/Menu/Actions/DeleteMenu.php:17
* @route '/dashboard/menu/destroy/{menu}'
*/
DeleteMenu.url = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return DeleteMenu.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Actions\DeleteMenu::__invoke
* @see app/Domains/Menu/Actions/DeleteMenu.php:17
* @route '/dashboard/menu/destroy/{menu}'
*/
DeleteMenu.delete = (args: { menu: string | { google_drive_id: string } } | [menu: string | { google_drive_id: string } ] | string | { google_drive_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: DeleteMenu.url(args, options),
    method: 'delete',
})

export default DeleteMenu