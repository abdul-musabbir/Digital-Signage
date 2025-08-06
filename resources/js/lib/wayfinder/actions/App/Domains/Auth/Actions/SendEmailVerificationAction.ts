import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\SendEmailVerificationAction::__invoke
* @see app/Domains/Auth/Actions/SendEmailVerificationAction.php:17
* @route '/email/verification-notification'
*/
const SendEmailVerificationAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: SendEmailVerificationAction.url(options),
    method: 'post',
})

SendEmailVerificationAction.definition = {
    methods: ['post'],
    url: '/email/verification-notification',
}

/**
* @see \App\Domains\Auth\Actions\SendEmailVerificationAction::__invoke
* @see app/Domains/Auth/Actions/SendEmailVerificationAction.php:17
* @route '/email/verification-notification'
*/
SendEmailVerificationAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return SendEmailVerificationAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\SendEmailVerificationAction::__invoke
* @see app/Domains/Auth/Actions/SendEmailVerificationAction.php:17
* @route '/email/verification-notification'
*/
SendEmailVerificationAction.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: SendEmailVerificationAction.url(options),
    method: 'post',
})

export default SendEmailVerificationAction