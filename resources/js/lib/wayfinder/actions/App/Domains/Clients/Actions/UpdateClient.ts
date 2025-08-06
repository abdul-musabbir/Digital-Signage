import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Clients\Actions\UpdateClient::__invoke
* @see app/Domains/Clients/Actions/UpdateClient.php:17
* @route '/dashboard/clients/update/{client}'
*/
const UpdateClient = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdateClient.url(args, options),
    method: 'put',
})

UpdateClient.definition = {
    methods: ['put'],
    url: '/dashboard/clients/update/{client}',
}

/**
* @see \App\Domains\Clients\Actions\UpdateClient::__invoke
* @see app/Domains/Clients/Actions/UpdateClient.php:17
* @route '/dashboard/clients/update/{client}'
*/
UpdateClient.url = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { client: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { client: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            client: args[0],
        }
    }

    const parsedArgs = {
        client: typeof args.client === 'object'
        ? args.client.id
        : args.client,
    }

    return UpdateClient.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Clients\Actions\UpdateClient::__invoke
* @see app/Domains/Clients/Actions/UpdateClient.php:17
* @route '/dashboard/clients/update/{client}'
*/
UpdateClient.put = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: UpdateClient.url(args, options),
    method: 'put',
})

export default UpdateClient