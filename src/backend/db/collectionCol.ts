import Collection from "../../core/collection";
import CollectionRepository from "../../core/collectionRepository";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export default class CollectionCol implements CollectionRepository {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  #conversor = {
    toFirestore(collection: Collection) {
      return {
        name: collection.name,
        qtyEditions: collection.qtyEditions,
        qtyPages: collection.qtyPages,
        totalPrice: collection.totalPrice,
      };
    },

    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Collection {
      const data = snapshot.data(options);
      return new Collection(
        snapshot.id,
        data.name,
        data.cover,
        data.qtyEditions,
        data.qtyPages,
        data.totalPrice
      );
    },
  };

  async save(collectionData: Collection): Promise<Collection> {
    if (collectionData?.id) {
      // update
      const ref = doc(
        db,
        `users/${this.userId}/collections/${collectionData.id}`
      );
      await setDoc(ref, collectionData);
      return collectionData;
    } else {
      // create
      const colRef = this.collection();
      const docRef = await addDoc(colRef, collectionData);
      const snapshot = await getDoc(docRef);
      return snapshot.data()!;
    }
  }

  async delete(col: Collection): Promise<void> {
    const ref = doc(
      db,
      `users/${this.userId}/collections/${col.id}`
    );
    await deleteDoc(ref);
  }

  async getAll() {
    const snapshot = await getDocs(this.collection());
    return snapshot.docs.map((doc) => doc.data());
  }

  private collection() {
    return collection(
      db,
      `users/${this.userId}/collections`
    ).withConverter(this.#conversor);
  }
}
