import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\SendPasswordResetLinkAction::__invoke
* @see app/Domains/Auth/Actions/SendPasswordResetLinkAction.php:17
* @route '/forgot-password'
*/
const SendPasswordResetLinkAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: SendPasswordResetLinkAction.url(options),
    method: 'post',
})

SendPasswordResetLinkAction.definition = {
    methods: ['post'],
    url: '/forgot-password',
}

/**
* @see \App\Domains\Auth\Actions\SendPasswordResetLinkAction::__invoke
* @see app/Domains/Auth/Actions/SendPasswordResetLinkAction.php:17
* @route '/forgot-password'
*/
SendPasswordResetLinkAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return SendPasswordResetLinkAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\SendPasswordResetLinkAction::__invoke
* @see app/Domains/Auth/Actions/SendPasswordResetLinkAction.php:17
* @route '/forgot-password'
*/
SendPasswordResetLinkAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: SendPasswordResetLinkAction.url(options),
    method: 'post',
})

export default SendPasswordResetLinkAction