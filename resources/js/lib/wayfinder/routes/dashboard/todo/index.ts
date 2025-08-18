import { queryParams, type QueryParams } from './../../../wayfinder'
/**
* @see routes/dashboard.php:19
* @route '/dashboard/settings/profile'
*/
export const index = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ['get','head'],
    url: '/dashboard/settings/profile',
}

/**
* @see routes/dashboard.php:19
* @route '/dashboard/settings/profile'
*/
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:19
* @route '/dashboard/settings/profile'
*/
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:19
* @route '/dashboard/settings/profile'
*/
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

const todo = {
    index,
}

export default todo