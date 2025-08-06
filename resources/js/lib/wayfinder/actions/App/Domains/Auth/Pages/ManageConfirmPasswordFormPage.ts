import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Pages\ManageConfirmPasswordFormPage::__invoke
* @see app/Domains/Auth/Pages/ManageConfirmPasswordFormPage.php:12
* @route '/confirm-password'
*/
const ManageConfirmPasswordFormPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageConfirmPasswordFormPage.url(options),
    method: 'get',
})

ManageConfirmPasswordFormPage.definition = {
    methods: ['get','head'],
    url: '/confirm-password',
}

/**
* @see \App\Domains\Auth\Pages\ManageConfirmPasswordFormPage::__invoke
* @see app/Domains/Auth/Pages/ManageConfirmPasswordFormPage.php:12
* @route '/confirm-password'
*/
ManageConfirmPasswordFormPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageConfirmPasswordFormPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageConfirmPasswordFormPage::__invoke
* @see app/Domains/Auth/Pages/ManageConfirmPasswordFormPage.php:12
* @route '/confirm-password'
*/
ManageConfirmPasswordFormPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageConfirmPasswordFormPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageConfirmPasswordFormPage::__invoke
* @see app/Domains/Auth/Pages/ManageConfirmPasswordFormPage.php:12
* @route '/confirm-password'
*/
ManageConfirmPasswordFormPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageConfirmPasswordFormPage.url(options),
    method: 'head',
})

export default ManageConfirmPasswordFormPage