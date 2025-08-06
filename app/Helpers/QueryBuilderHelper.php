<?php

declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class QueryBuilderHelper
{
    /**
     * Dynamically apply search, filters, and sorting to an Eloquent query builder.
     *
     * @param  Builder  $query  The Eloquent query builder instance.
     * @param  Request  $request  The current HTTP request containing search/sort/filter params.
     * @param  array  $searchable  Columns that can be searched via `search` keyword.
     * @param  array  $filterable  Columns that can be filtered via key:value filters.
     * @param  array  $sortable  Columns that are allowed to be sorted.
     * @return Builder The modified query builder.
     */
    public static function apply(
        Builder $query,
        Request $request,
        array $searchable = [],
        array $filterable = [],
        array $sortable = ['created_at']
    ): Builder {
        $search = trim($request->get('search', ''));
        $filters = $request->get('filters', []);
        $sortColumn = $request->get('col', 'created_at');
        $sortDirection = $request->get('sort', 'desc');

        /**
         * 🔍 Full-text Search Logic
         * If a search term is provided, apply `OR WHERE` clauses to all allowed searchable columns.
         */
        if ($search && $searchable) {
            $query->where(function ($q) use ($searchable, $search) {
                foreach ($searchable as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        /**
         * 🧪 Filtering Logic
         * Loop through each "filters" item (format: "key:value").
         * If allowed, apply where condition to the query.
         */
        foreach ((array) $filters as $filter) {
            if (! str_contains($filter, ':')) {
                continue; // Skip invalid format
            }

            [$column, $value] = explode(':', $filter, 2);

            if (! in_array($column, $filterable)) {
                continue; // Skip disallowed filters
            }

            // 🛡️ Special handling for known logical filter keys (e.g., email_verified)
            if ($column === 'email_verified') {
                match ($value) {
                    'verified' => $query->whereNotNull('email_verified_at'),
                    'unverified' => $query->whereNull('email_verified_at'),
                    default => null,
                };
            } else {
                $query->where($column, $value);
            }
        }

        /**
         * 🔃 Sorting Logic
         * Only allow sorting on safe, whitelisted columns.
         */
        $sortColumn = in_array($sortColumn, $sortable) ? $sortColumn : 'created_at';
        $sortDirection = $sortDirection === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortColumn, $sortDirection);

        return $query;
    }

    /**
     * Extract and normalize all filter-related parameters from the request.
     * Can be passed to frontend components for keeping UI state.
     *
     * @return array<string, mixed>
     */
    public static function getFilters(Request $request): array
    {
        return [
            'search' => trim($request->get('search', '')),         // 🔍 Global search term
            'filters' => $request->get('filters', []),              // 🧪 Filters (column:value[])
            'sort' => $request->get('sort', 'desc'),             // 🔃 Sort direction
            'col' => $request->get('col', 'created_at'),        // 🧱 Sort column
            'per_page' => (int) $request->get('per_page', 10),       // 📄 Pagination size
        ];
    }
}
