import { queryParams, type QueryParams } from './../../../wayfinder'
/**
* @see routes/dashboard.php:14
* @route '/dashboard/settings/appearance'
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
    url: '/dashboard/settings/appearance',
}

/**
* @see routes/dashboard.php:14
* @route '/dashboard/settings/appearance'
*/
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:14
* @route '/dashboard/settings/appearance'
*/
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:14
* @route '/dashboard/settings/appearance'
*/
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

const fileManager = {
    index,
}

export default fileManager