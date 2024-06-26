export default class Issue {
    #id: string
    #edition: number
    #title: string
    #pagesQty: number
    #collection: string
    #coverURL: string
    #month: string
    #year: number
    #price: number
    #writer: string
    #artist: string
    #additionalStories: string

    constructor(
        title: string,
        edition: number,
        pagesQty: number,
        collection: string,
        coverURL: string,
        month: string,
        year: number,
        price: number = null,
        writer: string = null,
        artist: string = null,
        additionalStories: string = null,
        id: string = null,
    ) {
        this.#title = title;
        this.#edition = edition;
        this.#pagesQty = pagesQty;
        this.#collection = collection;
        this.#coverURL = coverURL;
        this.#month = month;
        this.#year = year;
        this.#price = price;
        this.#writer = writer;
        this.#artist = artist;
        this.#additionalStories = additionalStories;
        this.#id = id;
    }

    static empty() {
        // Titulo, Ediçao, Paginas, COlecao, cover, mes, ano, preço, escritor, artista, id
        return new Issue('', 0, 0, 'normal', '', '', 0)
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

    get pagesQty() {
        return this.#pagesQty
    }

    get collection() {
        return this.#collection
    }

    get coverURL() {
        return this.#coverURL
    }

    get month() {
        return this.#month
    }

    get year() {
        return this.#year
    }

    get price() {
        return this.#price
    }

    get writer() {
        return this.#writer
    }

    get artist() {
        return this.#artist
    }

    get additionalStories() {
        return this.#additionalStories
    }
}