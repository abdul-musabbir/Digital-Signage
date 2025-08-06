import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Clients\Actions\DeleteClient::__invoke
* @see app/Domains/Clients/Actions/DeleteClient.php:17
* @route '/dashboard/clients/destroy/{client}'
*/
const DeleteClient = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: DeleteClient.url(args, options),
    method: 'delete',
})

DeleteClient.definition = {
    methods: ['delete'],
    url: '/dashboard/clients/destroy/{client}',
}

/**
* @see \App\Domains\Clients\Actions\DeleteClient::__invoke
* @see app/Domains/Clients/Actions/DeleteClient.php:17
* @route '/dashboard/clients/destroy/{client}'
*/
DeleteClient.url = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return DeleteClient.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Clients\Actions\DeleteClient::__invoke
* @see app/Domains/Clients/Actions/DeleteClient.php:17
* @route '/dashboard/clients/destroy/{client}'
*/
DeleteClient.delete = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: DeleteClient.url(args, options),
    method: 'delete',
})

export default DeleteClient