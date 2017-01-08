export interface SetOption {
    /** id */
    id: number;
    /** 套装件数 */
    count: number;
    /** 攻击 */
    attack: number;
    /** 魔法 */
    magic: number;
    /** 防御 */
    defense: number;
    /** 攻速 */
    attackspeed: number;
    /** 命中 */
    accuracy: number;
    /** 必杀 */
    critical: number;
    /** 闪避 */
    evade: number;
    /** 移速 */
    movespeed: number;
    /** HP */
    hp: number;
    /** AP */
    ap: number;
    /** 未知10 */
    res10: number;
    /** 未知11 */
    res11: number;
}