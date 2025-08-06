import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::__invoke
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
const ManageLoginPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageLoginPage.url(options),
    method: 'get',
})

ManageLoginPage.definition = {
    methods: ['get','head'],
    url: '/login',
}

/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::__invoke
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
ManageLoginPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageLoginPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::__invoke
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
ManageLoginPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageLoginPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::__invoke
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
ManageLoginPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageLoginPage.url(options),
    method: 'head',
})

export default ManageLoginPage