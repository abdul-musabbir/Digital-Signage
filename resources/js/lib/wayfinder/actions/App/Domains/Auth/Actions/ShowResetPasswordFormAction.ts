import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\ShowResetPasswordFormAction::__invoke
* @see app/Domains/Auth/Actions/ShowResetPasswordFormAction.php:17
* @route '/reset-password/{token}'
*/
const ShowResetPasswordFormAction = (args: { token: string | number } | [token: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ShowResetPasswordFormAction.url(args, options),
    method: 'get',
})

ShowResetPasswordFormAction.definition = {
    methods: ['get','head'],
    url: '/reset-password/{token}',
}

/**
* @see \App\Domains\Auth\Actions\ShowResetPasswordFormAction::__invoke
* @see app/Domains/Auth/Actions/ShowResetPasswordFormAction.php:17
* @route '/reset-password/{token}'
*/
ShowResetPasswordFormAction.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    const parsedArgs = {
        token: args.token,
    }

    return ShowResetPasswordFormAction.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\ShowResetPasswordFormAction::__invoke
* @see app/Domains/Auth/Actions/ShowResetPasswordFormAction.php:17
* @route '/reset-password/{token}'
*/
ShowResetPasswordFormAction.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ShowResetPasswordFormAction.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Actions\ShowResetPasswordFormAction::__invoke
* @see app/Domains/Auth/Actions/ShowResetPasswordFormAction.php:17
* @route '/reset-password/{token}'
*/
ShowResetPasswordFormAction.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ShowResetPasswordFormAction.url(args, options),
    method: 'head',
})

export default ShowResetPasswordFormAction