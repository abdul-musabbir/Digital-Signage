import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::__invoke
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
const ManageEmailVerificationPromptPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageEmailVerificationPromptPage.url(options),
    method: 'get',
})

ManageEmailVerificationPromptPage.definition = {
    methods: ['get','head'],
    url: '/verify-email',
}

/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::__invoke
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
ManageEmailVerificationPromptPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageEmailVerificationPromptPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::__invoke
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
ManageEmailVerificationPromptPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageEmailVerificationPromptPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageEmailVerificationPromptPage::__invoke
* @see app/Domains/Auth/Pages/ManageEmailVerificationPromptPage.php:14
* @route '/verify-email'
*/
ManageEmailVerificationPromptPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageEmailVerificationPromptPage.url(options),
    method: 'head',
})

export default ManageEmailVerificationPromptPage