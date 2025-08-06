import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Menu\Actions\UploadFiles::__invoke
* @see app/Domains/Menu/Actions/UploadFiles.php:17
* @route '/dashboard/menu/upload'
*/
const UploadFiles = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: UploadFiles.url(options),
    method: 'post',
})

UploadFiles.definition = {
    methods: ['post'],
    url: '/dashboard/menu/upload',
}

/**
* @see \App\Domains\Menu\Actions\UploadFiles::__invoke
* @see app/Domains/Menu/Actions/UploadFiles.php:17
* @route '/dashboard/menu/upload'
*/
UploadFiles.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return UploadFiles.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Menu\Actions\UploadFiles::__invoke
* @see app/Domains/Menu/Actions/UploadFiles.php:17
* @route '/dashboard/menu/upload'
*/
UploadFiles.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: UploadFiles.url(options),
    method: 'post',
})

export default UploadFiles