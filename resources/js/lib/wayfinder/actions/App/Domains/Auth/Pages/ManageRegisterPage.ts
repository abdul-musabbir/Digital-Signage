import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::__invoke
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
const ManageRegisterPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageRegisterPage.url(options),
    method: 'get',
})

ManageRegisterPage.definition = {
    methods: ['get','head'],
    url: '/register',
}

/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::__invoke
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
ManageRegisterPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageRegisterPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::__invoke
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
ManageRegisterPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageRegisterPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::__invoke
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
ManageRegisterPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageRegisterPage.url(options),
    method: 'head',
})

export default ManageRegisterPage