import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Clients\Pages\ManageClientsPage::__invoke
* @see app/Domains/Clients/Pages/ManageClientsPage.php:13
* @route '/dashboard/clients'
*/
const ManageClientsPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageClientsPage.url(options),
    method: 'get',
})

ManageClientsPage.definition = {
    methods: ['get','head'],
    url: '/dashboard/clients',
}

/**
* @see \App\Domains\Clients\Pages\ManageClientsPage::__invoke
* @see app/Domains/Clients/Pages/ManageClientsPage.php:13
* @route '/dashboard/clients'
*/
ManageClientsPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageClientsPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Clients\Pages\ManageClientsPage::__invoke
* @see app/Domains/Clients/Pages/ManageClientsPage.php:13
* @route '/dashboard/clients'
*/
ManageClientsPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageClientsPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Clients\Pages\ManageClientsPage::__invoke
* @see app/Domains/Clients/Pages/ManageClientsPage.php:13
* @route '/dashboard/clients'
*/
ManageClientsPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageClientsPage.url(options),
    method: 'head',
})

export default ManageClientsPage