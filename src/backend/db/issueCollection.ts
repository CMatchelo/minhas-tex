import Issue from "../../core/Issue";
import IssueRepository from "../../core/IssueRepository";
import firebase from "../../firebase/config";

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
                artist: issue.artist
            }
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Issue {
            const data = snapshot.data(options)
            // Titulo, Ediçao, Paginas, COlecao, cover, mes, ano, preço, escritor, artista, id
            return new Issue
                (
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
                    snapshot?.id
                )
        }
    }

    async save(issue: Issue): Promise<Issue> {
        if (issue?.id) {
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
        return firebase.firestore().collection(`users/${this.userId}/issues`).withConverter(this.#conversor)
    }
}