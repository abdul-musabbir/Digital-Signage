import { queryParams, type QueryParams } from './../../wayfinder'
import contacts from './contacts'
import fileManager from './file-manager'
import notes from './notes'
import scrumboard from './scrumboard'
import todo from './todo'
/**
* @see routes/dashboard.php:22
* @route '/dashboard/apps'
*/
export const apps = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: apps.url(options),
    method: 'get',
})

apps.definition = {
    methods: ['get','head'],
    url: '/dashboard/apps',
}

/**
* @see routes/dashboard.php:22
* @route '/dashboard/apps'
*/
apps.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return apps.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:22
* @route '/dashboard/apps'
*/
apps.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: apps.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:22
* @route '/dashboard/apps'
*/
apps.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: apps.url(options),
    method: 'head',
})

/**
* @see routes/dashboard.php:29
* @route '/dashboard/help-center'
*/
export const comingSoon = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: comingSoon.url(options),
    method: 'get',
})

comingSoon.definition = {
    methods: ['get','head'],
    url: '/dashboard/help-center',
}

/**
* @see routes/dashboard.php:29
* @route '/dashboard/help-center'
*/
comingSoon.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return comingSoon.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:29
* @route '/dashboard/help-center'
*/
comingSoon.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: comingSoon.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:29
* @route '/dashboard/help-center'
*/
comingSoon.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: comingSoon.url(options),
    method: 'head',
})

const dashboard = {
    contacts,
    fileManager,
    notes,
    scrumboard,
    todo,
    apps,
    comingSoon,
}

export default dashboard