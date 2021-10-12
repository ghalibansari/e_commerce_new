import {BaseBusiness} from "../BaseBusiness";
import {DiamondMatchRuleRepository} from "./diamond-match-rule.repository";
import {IDiamondMatchRule} from "./diamond-match-rule.types";

class DiamondMatchRuleBusiness extends BaseBusiness<IDiamondMatchRule> {
    private _diamondMatchRuleRepository: DiamondMatchRuleRepository;

    constructor() {
        super(new DiamondMatchRuleRepository())
        this._diamondMatchRuleRepository = new DiamondMatchRuleRepository()
    }
}

Object.seal(DiamondMatchRuleBusiness)
export = DiamondMatchRuleBusiness