import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\ConfirmPasswordAction::__invoke
* @see app/Domains/Auth/Actions/ConfirmPasswordAction.php:17
* @route '/confirm-password'
*/
const ConfirmPasswordAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: ConfirmPasswordAction.url(options),
    method: 'post',
})

ConfirmPasswordAction.definition = {
    methods: ['post'],
    url: '/confirm-password',
}

/**
* @see \App\Domains\Auth\Actions\ConfirmPasswordAction::__invoke
* @see app/Domains/Auth/Actions/ConfirmPasswordAction.php:17
* @route '/confirm-password'
*/
ConfirmPasswordAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ConfirmPasswordAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\ConfirmPasswordAction::__invoke
* @see app/Domains/Auth/Actions/ConfirmPasswordAction.php:17
* @route '/confirm-password'
*/
ConfirmPasswordAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: ConfirmPasswordAction.url(options),
    method: 'post',
})

export default ConfirmPasswordAction