export default class Issue {
    #id: string
    #edition: number
    #title: string
    #pagesQty: number
    #collection: string

    constructor(title: string, edition: number, pagesQty: number, collection: string, id: string = null) {
        this.#title = title;
        this.#edition = edition;
        this.#pagesQty = pagesQty;
        this.#collection = collection;
        this.#id = id;
    }

    static empty() {
        return new Issue('',0, 0, 'normal')
    }

    get id() {
        return this.#id
    }

    get edition() {
        return this.#edition
    }

    get title() {
        return this.#title
    }

    get collection() {
        return this.#collection
    }

    get pagesQty() {
        return this.#pagesQty
    }
}