import { queryParams, type QueryParams } from './../../wayfinder'
/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::notice
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
export const notice = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: notice.url(options),
    method: 'get',
})

notice.definition = {
    methods: ['get','head'],
    url: '/verify-email',
}

/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::notice
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
notice.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return notice.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::notice
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
notice.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: notice.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::notice
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
notice.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: notice.url(options),
    method: 'head',
})

/**
* @see \App\Domains\Auth\Actions\SendEmailVerificationAction::send
* @see app/Domains/Auth/Actions/SendEmailVerificationAction.php:17
* @route '/email/verification-notification'
*/
export const send = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ['post'],
    url: '/email/verification-notification',
}

/**
* @see \App\Domains\Auth\Actions\SendEmailVerificationAction::send
* @see app/Domains/Auth/Actions/SendEmailVerificationAction.php:17
* @route '/email/verification-notification'
*/
send.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\SendEmailVerificationAction::send
* @see app/Domains/Auth/Actions/SendEmailVerificationAction.php:17
* @route '/email/verification-notification'
*/
send.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: send.url(options),
    method: 'post',
})

/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::verify
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
export const verify = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: verify.url(args, options),
    method: 'get',
})

verify.definition = {
    methods: ['get','head'],
    url: '/verify-email/{id}/{hash}',
}

/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::verify
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
verify.url = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (Array.isArray(args)) {
        args = {
            id: args[0],
            hash: args[1],
        }
    }

    const parsedArgs = {
        id: args.id,
        hash: args.hash,
    }

    return verify.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{hash}', parsedArgs.hash.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::verify
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
verify.get = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: verify.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::verify
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
verify.head = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: verify.url(args, options),
    method: 'head',
})

const verification = {
    notice,
    send,
    verify,
}

export default verification