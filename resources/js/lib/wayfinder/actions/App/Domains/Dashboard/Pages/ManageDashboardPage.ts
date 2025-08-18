import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Dashboard\Pages\ManageDashboardPage::__invoke
* @see app/Domains/Dashboard/Pages/ManageDashboardPage.php:9
* @route '/dashboard'
*/
const ManageDashboardPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageDashboardPage.url(options),
    method: 'get',
})

ManageDashboardPage.definition = {
    methods: ['get','head'],
    url: '/dashboard',
}

/**
* @see \App\Domains\Dashboard\Pages\ManageDashboardPage::__invoke
* @see app/Domains/Dashboard/Pages/ManageDashboardPage.php:9
* @route '/dashboard'
*/
ManageDashboardPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageDashboardPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Dashboard\Pages\ManageDashboardPage::__invoke
* @see app/Domains/Dashboard/Pages/ManageDashboardPage.php:9
* @route '/dashboard'
*/
ManageDashboardPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageDashboardPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Dashboard\Pages\ManageDashboardPage::__invoke
* @see app/Domains/Dashboard/Pages/ManageDashboardPage.php:9
* @route '/dashboard'
*/
ManageDashboardPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageDashboardPage.url(options),
    method: 'head',
})

export default ManageDashboardPage