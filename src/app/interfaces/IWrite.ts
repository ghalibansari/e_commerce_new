
export interface IWrite<T> {
    createBR: (item:T)=>  Promise<T|T[]>;
    findAndUpdateBR:(_id: string, item:T) => Promise<T|null>;
    updateManyBR: (cond: object,item:T[]) => Promise<T|null>
}
