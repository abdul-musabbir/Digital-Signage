import { queryParams, type QueryParams } from './../../../../../wayfinder'
/**
* @see \App\Domains\Home\Actions\Create::__invoke
* @see app/Domains/Home/Actions/Create.php:17
* @route '/create'
*/
const Create = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: Create.url(options),
    method: 'post',
})

Create.definition = {
    methods: ['post'],
    url: '/create',
}

/**
* @see \App\Domains\Home\Actions\Create::__invoke
* @see app/Domains/Home/Actions/Create.php:17
* @route '/create'
*/
Create.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return Create.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Home\Actions\Create::__invoke
* @see app/Domains/Home/Actions/Create.php:17
* @route '/create'
*/
Create.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: Create.url(options),
    method: 'post',
})

export default Create