import {ServerId, Table, dbs} from '../../config';
import { Relation } from '../../types';
import { QueryContext } from '.';

export interface Query{
    loc: ServerId;
    id: number;
}

export interface Result{
    id: number;
    drop: Monster[];
}

interface Monster{
    id: number;
    name: string;
    level: number;
    property: number;
}

export default async function(ctx: QueryContext, next){
    const query: Query = ctx.request.body;
    const {
        loc : db,
        id
    } = query;

    const numId = parseInt(''+id, 10);

    const tableName = 'seal_relation';
    const monsterTableName = ctx.getTableName('monster');

    await ctx.withConn(async (conn, query)=>{
        let monsters:Monster[] = [];
        // 先找出对应的掉落列表
        const dropRelations: Relation[] = await query(`SELECT * FROM ${tableName} WHERE type='drop' AND b=?`, [numId]);

        // 再找出掉落对应的怪物
        const dropIds = dropRelations.map(r=>r.a);
        if(dropIds.length){
            const monsterRelations: Relation[] = await query(`SELECT * FROM ${tableName} WHERE type='drop_monster' AND a in (?)`, [dropIds])

            // 再找出对应的怪物，并进行去重尝试
            const monsterIds = monsterRelations.map(r=>r.b)
            if(monsterIds.length){
                const trimed = await query<Monster>(`SELECT min(id) as id,name,level FROM ${monsterTableName} WHERE id in (?) GROUP BY name,level ORDER BY level LIMIT 0, 20`, [monsterIds])
                monsters = await query(`SELECT id,name,level,property FROM ${monsterTableName} WHERE id in (?)`, trimed.map(o => o.id))
            }
        }

        ctx.success({
            id: numId,
            drop: monsters
        } as Result);
    });
}