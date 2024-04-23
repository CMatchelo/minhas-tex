import Collection from "./collection";

export default interface CollectionRepository {
    save(col: Collection): Promise<Collection>
    delete(col: Collection): Promise<void>
    getAll(): Promise<Collection[]>
}