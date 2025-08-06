import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Pages\ManageForgotPasswordPage::__invoke
* @see app/Domains/Auth/Pages/ManageForgotPasswordPage.php:12
* @route '/forgot-password'
*/
const ManageForgotPasswordPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageForgotPasswordPage.url(options),
    method: 'get',
})

ManageForgotPasswordPage.definition = {
    methods: ['get','head'],
    url: '/forgot-password',
}

/**
* @see \App\Domains\Auth\Pages\ManageForgotPasswordPage::__invoke
* @see app/Domains/Auth/Pages/ManageForgotPasswordPage.php:12
* @route '/forgot-password'
*/
ManageForgotPasswordPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageForgotPasswordPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageForgotPasswordPage::__invoke
* @see app/Domains/Auth/Pages/ManageForgotPasswordPage.php:12
* @route '/forgot-password'
*/
ManageForgotPasswordPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageForgotPasswordPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageForgotPasswordPage::__invoke
* @see app/Domains/Auth/Pages/ManageForgotPasswordPage.php:12
* @route '/forgot-password'
*/
ManageForgotPasswordPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageForgotPasswordPage.url(options),
    method: 'head',
})

export default ManageForgotPasswordPage