import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\LogoutAction::__invoke
* @see app/Domains/Auth/Actions/LogoutAction.php:17
* @route '/logout'
*/
const LogoutAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LogoutAction.url(options),
    method: 'post',
})

LogoutAction.definition = {
    methods: ['post'],
    url: '/logout',
}

/**
* @see \App\Domains\Auth\Actions\LogoutAction::__invoke
* @see app/Domains/Auth/Actions/LogoutAction.php:17
* @route '/logout'
*/
LogoutAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return LogoutAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\LogoutAction::__invoke
* @see app/Domains/Auth/Actions/LogoutAction.php:17
* @route '/logout'
*/
LogoutAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LogoutAction.url(options),
    method: 'post',
})

export default LogoutAction