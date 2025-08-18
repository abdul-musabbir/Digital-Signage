import { queryParams, type QueryParams } from './../../../wayfinder'
/**
* @see routes/dashboard.php:18
* @route '/dashboard/settings/notifications'
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
    url: '/dashboard/settings/notifications',
}

/**
* @see routes/dashboard.php:18
* @route '/dashboard/settings/notifications'
*/
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:18
* @route '/dashboard/settings/notifications'
*/
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:18
* @route '/dashboard/settings/notifications'
*/
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

const scrumboard = {
    index,
}

export default scrumboard