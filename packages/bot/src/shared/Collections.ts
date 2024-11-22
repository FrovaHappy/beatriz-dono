class Collections<K, V> {
  #collections: Map<K, V> = new Map()

  get(key: K): V | undefined {
    return this.#collections.get(key)
  }
  set(key: K, value: V) {
    this.#collections.set(key, value)
  }
  delete(key: K) {
    this.#collections.delete(key)
  }
  has(key: K): boolean {
    return this.#collections.has(key)
  }
  [Symbol.iterator]() {
    return this.#collections[Symbol.iterator]()
  }
}

export default Collections