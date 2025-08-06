import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Clients\Actions\CreateClient::__invoke
* @see app/Domains/Clients/Actions/CreateClient.php:17
* @route '/dashboard/clients/store'
*/
const CreateClient = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: CreateClient.url(options),
    method: 'post',
})

CreateClient.definition = {
    methods: ['post'],
    url: '/dashboard/clients/store',
}

/**
* @see \App\Domains\Clients\Actions\CreateClient::__invoke
* @see app/Domains/Clients/Actions/CreateClient.php:17
* @route '/dashboard/clients/store'
*/
CreateClient.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return CreateClient.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Clients\Actions\CreateClient::__invoke
* @see app/Domains/Clients/Actions/CreateClient.php:17
* @route '/dashboard/clients/store'
*/
CreateClient.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: CreateClient.url(options),
    method: 'post',
})

export default CreateClient