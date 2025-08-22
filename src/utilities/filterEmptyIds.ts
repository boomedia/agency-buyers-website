import type { CollectionBeforeDeleteHook } from 'payload'

export type WhereQuery = {
  id?:
    | {
        in?: unknown[]
      }
    | string
    | number
  and?: WhereQuery[]
  or?: WhereQuery[]
  [key: string]: unknown
}

/**
 * Utility hook to filter out empty string IDs from delete queries
 * This prevents PostgreSQL errors when empty strings are passed as integer IDs
 *
 * Usage: Add to beforeDelete hooks in collection configs
 * beforeDelete: [filterEmptyIdsHook]
 */
export const filterEmptyIdsHook: CollectionBeforeDeleteHook = ({ req }) => {
  // Filter out empty string IDs from delete queries to prevent PostgreSQL errors
  const filterEmptyIds = (where: WhereQuery): WhereQuery => {
    if (!where) return where

    // Handle the case where 'id' is in an 'in' array
    if (
      where.id &&
      typeof where.id === 'object' &&
      'in' in where.id &&
      Array.isArray(where.id.in)
    ) {
      where.id.in = where.id.in.filter((id: unknown) => {
        return id !== '' && id !== null && id !== undefined && String(id).trim() !== ''
      })

      // If no valid IDs remain, prevent the delete operation
      if (where.id.in.length === 0) {
        throw new Error('No valid IDs provided for deletion')
      }
    }

    // Handle the case where 'id' is a direct value
    if (where.id && typeof where.id === 'string' && where.id.trim() === '') {
      throw new Error('Invalid empty ID provided for deletion')
    }

    // Handle nested 'and' conditions
    if (where.and && Array.isArray(where.and)) {
      where.and = where.and.map(filterEmptyIds).filter(Boolean)
    }

    // Handle nested 'or' conditions
    if (where.or && Array.isArray(where.or)) {
      where.or = where.or.map(filterEmptyIds).filter(Boolean)
    }

    return where
  }

  if (req.query && req.query.where) {
    req.query.where = filterEmptyIds(req.query.where as WhereQuery)
  }

  return true
}
