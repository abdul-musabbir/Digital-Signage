import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Api\Actions\LoginAction::__invoke
* @see app/Domains/Api/Actions/LoginAction.php:17
* @route '/api/login'
*/
const LoginAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LoginAction.url(options),
    method: 'post',
})

LoginAction.definition = {
    methods: ['post'],
    url: '/api/login',
}

/**
* @see \App\Domains\Api\Actions\LoginAction::__invoke
* @see app/Domains/Api/Actions/LoginAction.php:17
* @route '/api/login'
*/
LoginAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return LoginAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Api\Actions\LoginAction::__invoke
* @see app/Domains/Api/Actions/LoginAction.php:17
* @route '/api/login'
*/
LoginAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LoginAction.url(options),
    method: 'post',
})

export default LoginAction