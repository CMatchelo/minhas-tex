export default class Collection {
    #id: string
    #name: string
    #cover: string
    #qtyEditions: number
    #qtyPages: number
    #totalPrice: number

    constructor(id: string = null, name: string, cover: string = '', qtyEditions: number = 0, qtyPages: number = 0, totalPrice: number = 0) {
        this.#id = id;
        this.#name = name;
        this.#cover = cover;
        this.#qtyEditions = qtyEditions;
        this.#qtyPages = qtyPages;
        this.#totalPrice = totalPrice;
    }
    
    static empty() {
        return new Collection('', '', '', 0, 0, 0)
    }

    get id() {
        return this.#id
    }

    get name() {
        return this.#name
    }

    get cover() {
        return this.#cover
    }

    get qtyEditions() {
        return this.#qtyEditions
    }

    get qtyPages() {
        return this.#qtyPages
    }

    get totalPrice() {
        return this.#totalPrice
    }
}
