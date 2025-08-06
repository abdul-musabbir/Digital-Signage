import { queryParams, type QueryParams } from './../wayfinder'
/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondProcess
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:20
* @route '/filepond'
*/
export const filepondProcess = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: filepondProcess.url(options),
    method: 'post',
})

filepondProcess.definition = {
    methods: ['post'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondProcess
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:20
* @route '/filepond'
*/
filepondProcess.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return filepondProcess.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondProcess
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:20
* @route '/filepond'
*/
filepondProcess.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: filepondProcess.url(options),
    method: 'post',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondPatch
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:43
* @route '/filepond'
*/
export const filepondPatch = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'patch',
} => ({
    url: filepondPatch.url(options),
    method: 'patch',
})

filepondPatch.definition = {
    methods: ['patch'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondPatch
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:43
* @route '/filepond'
*/
filepondPatch.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return filepondPatch.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondPatch
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:43
* @route '/filepond'
*/
filepondPatch.patch = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'patch',
} => ({
    url: filepondPatch.url(options),
    method: 'patch',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondHead
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
export const filepondHead = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: filepondHead.url(options),
    method: 'get',
})

filepondHead.definition = {
    methods: ['get','head'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondHead
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
filepondHead.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return filepondHead.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondHead
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
filepondHead.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: filepondHead.url(options),
    method: 'get',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondHead
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:55
* @route '/filepond'
*/
filepondHead.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: filepondHead.url(options),
    method: 'head',
})

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondRevert
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:81
* @route '/filepond'
*/
export const filepondRevert = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: filepondRevert.url(options),
    method: 'delete',
})

filepondRevert.definition = {
    methods: ['delete'],
    url: '/filepond',
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondRevert
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:81
* @route '/filepond'
*/
filepondRevert.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return filepondRevert.definition.url + queryParams(options)
}

/**
* @see \RahulHaque\Filepond\Http\Controllers\FilepondController::filepondRevert
* @see vendor/rahulhaque/laravel-filepond/src/Http/Controllers/FilepondController.php:81
* @route '/filepond'
*/
filepondRevert.delete = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: filepondRevert.url(options),
    method: 'delete',
})

/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::register
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
export const register = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ['get','head'],
    url: '/register',
}

/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::register
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
register.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::register
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
register.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: register.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageRegisterPage::register
* @see app/Domains/Auth/Pages/ManageRegisterPage.php:12
* @route '/register'
*/
register.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: register.url(options),
    method: 'head',
})

/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::login
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
export const login = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ['get','head'],
    url: '/login',
}

/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::login
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
login.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::login
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
login.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Auth\Pages\ManageLoginPage::login
* @see app/Domains/Auth/Pages/ManageLoginPage.php:13
* @route '/login'
*/
login.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Domains\Auth\Actions\LogoutAction::logout
* @see app/Domains/Auth/Actions/LogoutAction.php:17
* @route '/logout'
*/
export const logout = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ['post'],
    url: '/logout',
}

/**
* @see \App\Domains\Auth\Actions\LogoutAction::logout
* @see app/Domains/Auth/Actions/LogoutAction.php:17
* @route '/logout'
*/
logout.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Auth\Actions\LogoutAction::logout
* @see app/Domains/Auth/Actions/LogoutAction.php:17
* @route '/logout'
*/
logout.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see routes/dashboard.php:9
* @route '/dashboard'
*/
export const dashboard = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ['get','head'],
    url: '/dashboard',
}

/**
* @see routes/dashboard.php:9
* @route '/dashboard'
*/
dashboard.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see routes/dashboard.php:9
* @route '/dashboard'
*/
dashboard.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/dashboard.php:9
* @route '/dashboard'
*/
dashboard.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: dashboard.url(options),
    method: 'head',
})

