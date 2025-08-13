import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Menu\Actions\UpdateMenu::__invoke
* @see app/Domains/Menu/Actions/UpdateMenu.php:17
* @route '/dashboard/menu/update/{menu}'
*/
const UpdateMenu = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdateMenu.url(args, options),
    method: 'put',
})

UpdateMenu.definition = {
    methods: ['put'],
    url: '/dashboard/menu/update/{menu}',
}

/**
* @see \App\Domains\Menu\Actions\UpdateMenu::__invoke
* @see app/Domains/Menu/Actions/UpdateMenu.php:17
* @route '/dashboard/menu/update/{menu}'
*/
UpdateMenu.url = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return UpdateMenu.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Menu\Actions\UpdateMenu::__invoke
* @see app/Domains/Menu/Actions/UpdateMenu.php:17
* @route '/dashboard/menu/update/{menu}'
*/
UpdateMenu.put = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdateMenu.url(args, options),
    method: 'put',
})

export default UpdateMenu