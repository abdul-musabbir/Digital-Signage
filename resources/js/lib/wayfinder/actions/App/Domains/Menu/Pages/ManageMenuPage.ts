import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::__invoke
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
const ManageMenuPage = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageMenuPage.url(options),
    method: 'get',
})

ManageMenuPage.definition = {
    methods: ['get','head'],
    url: '/dashboard/menu',
}

/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::__invoke
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
ManageMenuPage.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return ManageMenuPage.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::__invoke
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
ManageMenuPage.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: ManageMenuPage.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Menu\Pages\ManageMenuPage::__invoke
* @see app/Domains/Menu/Pages/ManageMenuPage.php:13
* @route '/dashboard/menu'
*/
ManageMenuPage.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: ManageMenuPage.url(options),
    method: 'head',
})

export default ManageMenuPage