import Issue from "../../core/Issue";
import IssueRepository from "../../core/IssueRepository";
import { db } from "../../firebase/config";

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  QueryDocumentSnapshot,
  SnapshotOptions
} from "firebase/firestore";

export default class IssueCollection implements IssueRepository {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  #conversor = {
    toFirestore(issue: Issue) {
      return {
        title: issue.title,
        edition: issue.edition,
        pagesQty: issue.pagesQty,
        collection: issue.collection,
        coverURL: issue.coverURL,
        month: issue.month,
        year: issue.year,
        price: issue.price,
        writer: issue.writer,
        artist: issue.artist,
        additionalStories: issue.additionalStories
      };
    },

    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Issue {
      const data = snapshot.data(options);

      return new Issue(
        data.title,
        data.edition,
        data.pagesQty,
        data.collection,
        data.coverURL,
        data.month,
        data.year,
        data.price,
        data.writer,
        data.artist,
        data.additionalStories,
        snapshot.id
      );
    },
  };

  async save(issue: Issue): Promise<Issue> {
    if (issue?.id) {
      // update
      const ref = doc(
        db,
        `users/${this.userId}/issues/${issue.id}`
      );
      await setDoc(ref, issue);
      return issue;
    } else {
      // create
      const colRef = this.collection();
      const docRef = await addDoc(colRef, issue);

      const snap = await getDoc(docRef);
      return snap.data()!;
    }
  }

  async delete(issue: Issue): Promise<void> {
    const ref = doc(
      db,
      `users/${this.userId}/issues/${issue.id}`
    );
    await deleteDoc(ref);
  }

  async getAll(): Promise<Issue[]> {
    const snapshot = await getDocs(this.collection());
    return snapshot.docs.map((doc) => doc.data());
  }

  private collection() {
    return collection(
      db,
      `users/${this.userId}/issues`
    ).withConverter(this.#conversor);
  }
}
