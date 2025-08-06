import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Auth\Actions\UpdatePasswordAction::__invoke
* @see app/Domains/Auth/Actions/UpdatePasswordAction.php:17
* @route '/password'
*/
const UpdatePasswordAction = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdatePasswordAction.url(options),
    method: 'put',
})

UpdatePasswordAction.definition = {
    methods: ['put'],
    url: '/password',
}

/**
* @see \App\Domains\Auth\Actions\UpdatePasswordAction::__invoke
* @see app/Domains/Auth/Actions/UpdatePasswordAction.php:17
* @route '/password'
*/
UpdatePasswordAction.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return UpdatePasswordAction.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\UpdatePasswordAction::__invoke
* @see app/Domains/Auth/Actions/UpdatePasswordAction.php:17
* @route '/password'
*/
UpdatePasswordAction.put = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdatePasswordAction.url(options),
    method: 'put',
})

export default UpdatePasswordAction