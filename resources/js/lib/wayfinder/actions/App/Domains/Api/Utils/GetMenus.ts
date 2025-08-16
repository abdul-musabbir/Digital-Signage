import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Api\Utils\GetMenus::__invoke
* @see app/Domains/Api/Utils/GetMenus.php:12
* @route '/api/menus'
*/
const GetMenus = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: GetMenus.url(options),
    method: 'get',
})

GetMenus.definition = {
    methods: ['get','head'],
    url: '/api/menus',
}

/**
* @see \App\Domains\Api\Utils\GetMenus::__invoke
* @see app/Domains/Api/Utils/GetMenus.php:12
* @route '/api/menus'
*/
GetMenus.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return GetMenus.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Api\Utils\GetMenus::__invoke
* @see app/Domains/Api/Utils/GetMenus.php:12
* @route '/api/menus'
*/
GetMenus.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: GetMenus.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Api\Utils\GetMenus::__invoke
* @see app/Domains/Api/Utils/GetMenus.php:12
* @route '/api/menus'
*/
GetMenus.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: GetMenus.url(options),
    method: 'head',
})

export default GetMenus