import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\RegisterUserAction::__invoke
* @see app/Domains/Auth/Actions/RegisterUserAction.php:17
* @route '/register'
*/
const RegisterUserAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: RegisterUserAction.url(options),
    method: 'post',
})

RegisterUserAction.definition = {
    methods: ['post'],
    url: '/register',
}

/**
* @see \App\Domains\Auth\Actions\RegisterUserAction::__invoke
* @see app/Domains/Auth/Actions/RegisterUserAction.php:17
* @route '/register'
*/
RegisterUserAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return RegisterUserAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\RegisterUserAction::__invoke
* @see app/Domains/Auth/Actions/RegisterUserAction.php:17
* @route '/register'
*/
RegisterUserAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: RegisterUserAction.url(options),
    method: 'post',
})

export default RegisterUserAction