/**
 * Small localStorage helper with a { uid, savedAt, data } envelope.
 * Every access is wrapped in try/catch (private mode, quota, SSR).
 */

interface CacheEnvelope<T> {
    uid: string
    savedAt: number
    data: T
}

const PREFIX = "minhasTex:cache:"
// Skip writing blobs larger than this (~2 MB) to stay well under the
// browser localStorage limit.
const MAX_BYTES = 2_000_000

export function cacheKey(name: string, uid: string) {
    return `${PREFIX}${name}:${uid}`
}

export function readCache<T>(name: string, uid: string): CacheEnvelope<T> | null {
    if (typeof window === "undefined") return null
    try {
        const raw = window.localStorage.getItem(cacheKey(name, uid))
        if (!raw) return null
        const parsed = JSON.parse(raw) as CacheEnvelope<T>
        if (parsed?.uid !== uid) return null
        return parsed
    } catch {
        return null
    }
}

export function writeCache<T>(name: string, uid: string, data: T): void {
    if (typeof window === "undefined") return
    try {
        const payload: CacheEnvelope<T> = { uid, savedAt: Date.now(), data }
        const serialized = JSON.stringify(payload)
        if (serialized.length > MAX_BYTES) return
        window.localStorage.setItem(cacheKey(name, uid), serialized)
    } catch {
        // ignore (quota exceeded, private mode, etc.)
    }
}

export function clearCache(uid: string): void {
    if (typeof window === "undefined") return
    try {
        const keys: string[] = []
        for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i)
            if (k && k.startsWith(PREFIX) && k.endsWith(`:${uid}`)) keys.push(k)
        }
        keys.forEach(k => window.localStorage.removeItem(k))
    } catch {
        // ignore
    }
}

export function isFresh(savedAt: number, ttlMs: number): boolean {
    return Date.now() - savedAt < ttlMs
}
