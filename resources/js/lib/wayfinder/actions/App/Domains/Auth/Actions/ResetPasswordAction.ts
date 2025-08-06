import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\ResetPasswordAction::__invoke
* @see app/Domains/Auth/Actions/ResetPasswordAction.php:17
* @route '/reset-password'
*/
const ResetPasswordAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: ResetPasswordAction.url(options),
    method: 'post',
})

ResetPasswordAction.definition = {
    methods: ['post'],
    url: '/reset-password',
}

/**
* @see \App\Domains\Auth\Actions\ResetPasswordAction::__invoke
* @see app/Domains/Auth/Actions/ResetPasswordAction.php:17
* @route '/reset-password'
*/
ResetPasswordAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ResetPasswordAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\ResetPasswordAction::__invoke
* @see app/Domains/Auth/Actions/ResetPasswordAction.php:17
* @route '/reset-password'
*/
ResetPasswordAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: ResetPasswordAction.url(options),
    method: 'post',
})

export default ResetPasswordAction