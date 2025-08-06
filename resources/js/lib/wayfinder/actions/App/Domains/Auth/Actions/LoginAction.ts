import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\LoginAction::__invoke
* @see app/Domains/Auth/Actions/LoginAction.php:17
* @route '/login'
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
    url: '/login',
}

/**
* @see \App\Domains\Auth\Actions\LoginAction::__invoke
* @see app/Domains/Auth/Actions/LoginAction.php:17
* @route '/login'
*/
LoginAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return LoginAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\LoginAction::__invoke
* @see app/Domains/Auth/Actions/LoginAction.php:17
* @route '/login'
*/
LoginAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LoginAction.url(options),
    method: 'post',
})

export default LoginAction