import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Profile\Actions\UpdateProfile::__invoke
* @see app/Domains/Profile/Actions/UpdateProfile.php:17
* @route '/dashboard/settings/profile/update'
*/
const UpdateProfile = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdateProfile.url(options),
    method: 'put',
})

UpdateProfile.definition = {
    methods: ['put'],
    url: '/dashboard/settings/profile/update',
}

/**
* @see \App\Domains\Profile\Actions\UpdateProfile::__invoke
* @see app/Domains/Profile/Actions/UpdateProfile.php:17
* @route '/dashboard/settings/profile/update'
*/
UpdateProfile.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return UpdateProfile.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Profile\Actions\UpdateProfile::__invoke
* @see app/Domains/Profile/Actions/UpdateProfile.php:17
* @route '/dashboard/settings/profile/update'
*/
UpdateProfile.put = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdateProfile.url(options),
    method: 'put',
})

export default UpdateProfile