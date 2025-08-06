import { queryParams, type QueryParams } from './../../../wayfinder'
/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/display'
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
    url: '/dashboard/settings/display',
}

/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/display'
*/
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/display'
*/
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/display'
*/
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

const notes = {
    index,
}

export default notes