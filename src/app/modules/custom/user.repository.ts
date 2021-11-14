import { BaseRepository } from "../BaseRepository";



export class UserRepository extends BaseRepository<any, any> {
    constructor() {
        //@ts-expect-error
        super()
    }


}