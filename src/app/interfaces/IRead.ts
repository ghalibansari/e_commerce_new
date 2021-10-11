import { Model } from "sequelize";


export interface IRead<T, U> {
    findBR: ()=> Promise<Model<T, U>[]>;
    findByIdBR: (id: string)=> Promise<T|null>
    findPopulateBR: (cond: object, populate: object[])=> Promise<T[]>
}
