import { BaseRepository } from "../BaseRepository";
// import { TagMd } from "./tag.model";
// import { TagMd } from "./tag11.model";
import { TagMd } from "./tag.model";
import { IMTag, ITag } from "./tag.types";

export class TagRepository extends BaseRepository<ITag, IMTag> {
    constructor() {
        super(TagMd, 'tag_id', ['*'], ['created_at'], []);
    }
};