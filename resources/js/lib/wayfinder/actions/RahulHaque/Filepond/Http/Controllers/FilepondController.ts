import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::process
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:20
* @route '/filepond'
*/
export const process = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: process.url(options),
    method: 'post',
})

process.definition = {
    methods: ['post'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::process
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:20
* @route '/filepond'
*/
process.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return process.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::process
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:20
* @route '/filepond'
*/
process.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: process.url(options),
    method: 'post',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::patch
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:43
* @route '/filepond'
*/
export const patch = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'patch',
} => ({
    url: patch.url(options),
    method: 'patch',
})

patch.definition = {
    methods: ['patch'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::patch
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:43
* @route '/filepond'
*/
patch.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return patch.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::patch
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:43
* @route '/filepond'
*/
patch.patch = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'patch',
} => ({
    url: patch.url(options),
    method: 'patch',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::head
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
export const head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: head.url(options),
    method: 'get',
})

head.definition = {
    methods: ['get','head'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::head
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
head.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return head.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::head
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
head.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: head.url(options),
    method: 'get',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::head
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
head.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: head.url(options),
    method: 'head',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::revert
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:81
* @route '/filepond'
*/
export const revert = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: revert.url(options),
    method: 'delete',
})

revert.definition = {
    methods: ['delete'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::revert
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:81
* @route '/filepond'
*/
revert.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return revert.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::revert
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:81
* @route '/filepond'
*/
revert.delete = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: revert.url(options),
    method: 'delete',
})

const FilepondController = { process, patch, head, revert }

export default FilepondController