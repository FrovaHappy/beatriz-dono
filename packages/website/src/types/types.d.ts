export type State<T> = [T, (k: T) => void];

export type InputExport<T> = [T, JSX.Element]
