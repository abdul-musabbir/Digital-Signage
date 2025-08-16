import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Api\Utils\GetUser::__invoke
* @see app/Domains/Api/Utils/GetUser.php:12
* @route '/api/user'
*/
const GetUser = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: GetUser.url(options),
    method: 'get',
})

GetUser.definition = {
    methods: ['get','head'],
    url: '/api/user',
}

/**
* @see \App\Domains\Api\Utils\GetUser::__invoke
* @see app/Domains/Api/Utils/GetUser.php:12
* @route '/api/user'
*/
GetUser.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return GetUser.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Api\Utils\GetUser::__invoke
* @see app/Domains/Api/Utils/GetUser.php:12
* @route '/api/user'
*/
GetUser.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: GetUser.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Api\Utils\GetUser::__invoke
* @see app/Domains/Api/Utils/GetUser.php:12
* @route '/api/user'
*/
GetUser.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: GetUser.url(options),
    method: 'head',
})

export default GetUser