import Collection from "../../core/collection";
import CollectionRepository from "../../core/collectionRepository";
import firebase from "../../firebase/config";

export default class CollectionCol implements CollectionRepository {

    #conversor = {
        toFirestore(collection: Collection) {
            return {
                name: collection.name,
                qtyEditions: collection.qtyEditions,
                qtyPages: collection.qtyPages,
                totalPrice: collection.totalPrice
            }
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Collection {
            const data = snapshot.data(options)
            return new Collection(snapshot?.id, data.name, data.qtyEditions, data.qtyPages, data.totalPrice)
        }
    }

    async save(collection: Collection): Promise<Collection> {
        if(collection?.id) {
            await this.collection().doc(collection.id).set(collection)
            return collection
        } else {
            const docRef = await this.collection().add(collection)
            const doc = await docRef.get()
            return doc.data()
        }
    }

    async delete(col: Collection): Promise<void> {
        return this.collection().doc(col.id).delete()
    }

    async getAll(): Promise<Collection[]> {
        const query = await this.collection().get()
        return query.docs.map(doc => doc.data()) ?? []
    }

    private collection() {
        return firebase.firestore().collection('collections').withConverter(this.#conversor)
    }

}