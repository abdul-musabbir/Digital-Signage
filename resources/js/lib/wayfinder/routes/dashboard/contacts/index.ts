import { queryParams, type QueryParams } from './../../../wayfinder'
/**
* @see routes/dashboard.php:14
* @route '/dashboard/settings'
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
    url: '/dashboard/settings',
}

/**
* @see routes/dashboard.php:14
* @route '/dashboard/settings'
*/
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:14
* @route '/dashboard/settings'
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
* @route '/dashboard/settings'
*/
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/account'
*/
export const accoubt = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: accoubt.url(options),
    method: 'get',
})

accoubt.definition = {
    methods: ['get','head'],
    url: '/dashboard/settings/account',
}

/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/account'
*/
accoubt.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return accoubt.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/account'
*/
accoubt.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: accoubt.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:15
* @route '/dashboard/settings/account'
*/
accoubt.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: accoubt.url(options),
    method: 'head',
})

const contacts = {
    index,
    accoubt,
}

export default contacts