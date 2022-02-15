import { BaseRepository } from "../BaseRepository";
import { TagMd } from "./tags.model";
import { IMTag, ITag } from "./tags.types";

export class TagRepository extends BaseRepository<ITag, IMTag> {
    constructor() {
        super(TagMd, 'tag_id', [''], ['created_at'], []);
    }
};