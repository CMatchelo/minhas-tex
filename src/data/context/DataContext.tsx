import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import Issue from "../../core/Issue"
import Collection from "../../core/collection"
import IssueCollection from "../../backend/db/issueCollection"
import CollectionCol from "../../backend/db/collectionCol"
import useAuth from "../hook/useAuth"
import { readCache, writeCache, isFresh } from "../cache/localCache"

const TTL_MS = 10 * 60 * 1000 // 10 minutes

interface DataContextProps {
    issues: Issue[]
    collections: Collection[]
    loadingIssues: boolean
    loadingCollections: boolean
    lastSync: number | null
    refresh: (force?: boolean) => Promise<void>
    addOrUpdateIssue: (issue: Issue) => void
    removeIssue: (issue: Issue) => void
    addOrUpdateCollection: (collection: Collection) => void
    removeCollection: (collection: Collection) => void
}

const DataContext = createContext<DataContextProps>({
    issues: [],
    collections: [],
    loadingIssues: false,
    loadingCollections: false,
    lastSync: null,
    refresh: async () => {},
    addOrUpdateIssue: () => {},
    removeIssue: () => {},
    addOrUpdateCollection: () => {},
    removeCollection: () => {},
})

/* ---------- plain <-> class serialization ---------- */

type IssuePlain = {
    id: string; title: string; edition: number; pagesQty: number; collection: string;
    coverURL: string; month: string; year: number; price: number;
    writer: string; artist: string; additionalStories: string;
}

type CollectionPlain = {
    id: string; name: string; cover: string;
    qtyEditions: number; qtyPages: number; totalPrice: number;
}

const issueToPlain = (i: Issue): IssuePlain => ({
    id: i.id, title: i.title, edition: i.edition, pagesQty: i.pagesQty,
    collection: i.collection, coverURL: i.coverURL, month: i.month, year: i.year,
    price: i.price, writer: i.writer, artist: i.artist,
    additionalStories: i.additionalStories,
})

const issueFromPlain = (p: IssuePlain): Issue => new Issue(
    p.title, p.edition, p.pagesQty, p.collection, p.coverURL, p.month, p.year,
    p.price, p.writer, p.artist, p.additionalStories, p.id,
)

const collectionToPlain = (c: Collection): CollectionPlain => ({
    id: c.id, name: c.name, cover: c.cover, qtyEditions: c.qtyEditions,
    qtyPages: c.qtyPages, totalPrice: c.totalPrice,
})

const collectionFromPlain = (p: CollectionPlain): Collection => new Collection(
    p.id, p.name, p.cover, p.qtyEditions, p.qtyPages, p.totalPrice,
)

/* -------------------------------------------------- */

export function DataProvider(props: { children: any }) {
    const { user } = useAuth()
    const uid = user?.uid ?? null

    const [issues, setIssues] = useState<Issue[]>([])
    const [collections, setCollections] = useState<Collection[]>([])
    const [loadingIssues, setLoadingIssues] = useState(false)
    const [loadingCollections, setLoadingCollections] = useState(false)
    const [lastSync, setLastSync] = useState<number | null>(null)

    // guards a fetch already running for a given uid (Strict Mode / re-renders)
    const inFlight = useRef<string | null>(null)

    const persistIssues = (list: Issue[]) => {
        if (uid) writeCache("issues", uid, list.map(issueToPlain))
    }
    const persistCollections = (list: Collection[]) => {
        if (uid) writeCache("collections", uid, list.map(collectionToPlain))
    }

    const fetchFromFirestore = async (currentUid: string) => {
        if (inFlight.current === currentUid) return
        inFlight.current = currentUid

        setLoadingIssues(true)
        setLoadingCollections(true)
        try {
            const issueRepo = new IssueCollection(currentUid)
            const colRepo = new CollectionCol(currentUid)

            const [freshIssues, freshCollections] = await Promise.all([
                issueRepo.getAll(),
                colRepo.getAll(),
            ])

            // only apply if the user hasn't changed meanwhile
            if (inFlight.current !== currentUid) return

            setIssues(freshIssues)
            setCollections(freshCollections)
            setLastSync(Date.now())
            writeCache("issues", currentUid, freshIssues.map(issueToPlain))
            writeCache("collections", currentUid, freshCollections.map(collectionToPlain))
        } catch (err) {
            console.error("Erro ao carregar dados do Firebase:", err)
        } finally {
            if (inFlight.current === currentUid) inFlight.current = null
            setLoadingIssues(false)
            setLoadingCollections(false)
        }
    }

    // hydrate + conditionally fetch whenever the signed-in user changes
    useEffect(() => {
        if (!uid) {
            setIssues([])
            setCollections([])
            setLastSync(null)
            return
        }

        const cachedIssues = readCache<IssuePlain[]>("issues", uid)
        const cachedCollections = readCache<CollectionPlain[]>("collections", uid)

        if (cachedIssues) setIssues(cachedIssues.data.map(issueFromPlain))
        if (cachedCollections) setCollections(cachedCollections.data.map(collectionFromPlain))

        const cacheSavedAt = Math.min(
            cachedIssues?.savedAt ?? 0,
            cachedCollections?.savedAt ?? 0,
        )
        const bothCached = !!cachedIssues && !!cachedCollections

        if (bothCached && isFresh(cacheSavedAt, TTL_MS)) {
            setLastSync(cacheSavedAt)
        } else {
            fetchFromFirestore(uid)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid])

    const refresh = async (force = false) => {
        if (!uid) return
        if (!force && lastSync && isFresh(lastSync, TTL_MS)) return
        await fetchFromFirestore(uid)
    }

    const addOrUpdateIssue = (issue: Issue) => {
        setIssues(prev => {
            const idx = prev.findIndex(i => i.id === issue.id)
            const next = idx === -1
                ? [...prev, issue]
                : prev.map(i => (i.id === issue.id ? issue : i))
            persistIssues(next)
            return next
        })
    }

    const removeIssue = (issue: Issue) => {
        setIssues(prev => {
            const next = prev.filter(i => i.id !== issue.id)
            persistIssues(next)
            return next
        })
    }

    const addOrUpdateCollection = (collection: Collection) => {
        setCollections(prev => {
            const idx = prev.findIndex(c => c.id === collection.id)
            const next = idx === -1
                ? [...prev, collection]
                : prev.map(c => (c.id === collection.id ? collection : c))
            persistCollections(next)
            return next
        })
    }

    const removeCollection = (collection: Collection) => {
        setCollections(prev => {
            const next = prev.filter(c => c.id !== collection.id)
            persistCollections(next)
            return next
        })
    }

    return (
        <DataContext.Provider
            value={{
                issues,
                collections,
                loadingIssues,
                loadingCollections,
                lastSync,
                refresh,
                addOrUpdateIssue,
                removeIssue,
                addOrUpdateCollection,
                removeCollection,
            }}
        >
            {props.children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)

export default DataContext
