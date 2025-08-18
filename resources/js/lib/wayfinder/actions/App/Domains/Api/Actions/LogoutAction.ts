import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Api\Actions\LogoutAction::__invoke
* @see app/Domains/Api/Actions/LogoutAction.php:17
* @route '/api/logout'
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
    url: '/api/logout',
}

/**
* @see \App\Domains\Api\Actions\LogoutAction::__invoke
* @see app/Domains/Api/Actions/LogoutAction.php:17
* @route '/api/logout'
*/
LogoutAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return LogoutAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Api\Actions\LogoutAction::__invoke
* @see app/Domains/Api/Actions/LogoutAction.php:17
* @route '/api/logout'
*/
LogoutAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LogoutAction.url(options),
    method: 'post',
})

export default LogoutAction