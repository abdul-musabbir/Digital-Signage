import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::__invoke
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
const ManageVerifyEmailPage = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageVerifyEmailPage.url(args, options),
    method: 'get',
})

ManageVerifyEmailPage.definition = {
    methods: ['get','head'],
    url: '/verify-email/{id}/{hash}',
}

/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::__invoke
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
ManageVerifyEmailPage.url = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return ManageVerifyEmailPage.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{hash}', parsedArgs.hash.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::__invoke
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
ManageVerifyEmailPage.get = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageVerifyEmailPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageVerifyEmailPage::__invoke
* @see app/Domains/Auth/Pages/ManageVerifyEmailPage.php:16
* @route '/verify-email/{id}/{hash}'
*/
ManageVerifyEmailPage.head = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number ], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageVerifyEmailPage.url(args, options),
    method: 'head',
})

export default ManageVerifyEmailPage