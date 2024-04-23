import Issue from "../../core/Issue";
import IssueRepository from "../../core/IssueRepository";
import firebase from "../../firebase/config";

export default class IssueCollection implements IssueRepository {

    #conversor = {
        toFirestore(issue: Issue) {
            return {
                title: issue.title,
                edition: issue.edition,
                pagesQty: issue.pagesQty,
                collection: issue.collection
            }
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Issue {
            const data = snapshot.data(options)
            return new Issue(data.title, data.edition, data.pagesQty, data.collection, snapshot?.id)
        }
    }

    async save(issue: Issue): Promise<Issue> {
        if(issue?.id) {
            await this.collection().doc(issue.id).set(issue)
            return issue
        } else {
            const docRef = await this.collection().add(issue)
            const doc = await docRef.get()
            return doc.data()
        }
    }

    async delete(issue: Issue): Promise<void> {
        return this.collection().doc(issue.id).delete()
    }

    async getAll(): Promise<Issue[]> {
        const query = await this.collection().get()
        return query.docs.map(doc => doc.data()) ?? []
    }

    private collection() {
        return firebase.firestore().collection('issues').withConverter(this.#conversor)
    }
}