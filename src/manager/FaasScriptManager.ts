import { Init, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { readFileSync, readdirSync, statSync } from 'fs';
import path = require('path');
import { Script } from 'vm';
const watch = require('watch');
const script_root = path.resolve('fnscript');
@Provide()
@Scope(ScopeEnum.Singleton)
export class FaasScriptManager {
  scriptCache = new Map<string, Script>();
  private async scriptChanged(filename: string) {
    let scriptName = filename.substring(script_root.length + 1);
    scriptName = scriptName.replace(/\.ts|\.js/g, '');
    scriptName = scriptName.replace(/\\/g, '/');
    const js = await readFileSync(filename, 'utf-8');
    if (!js) {
      this.scriptCache.delete(scriptName);
      return undefined;
    }
    const script = new Script(js + 'main(ctx);');

    this.scriptCache.set(scriptName.toLowerCase(), script);
    return script;
  }

  public getScript(filename: string): Script {
    filename = filename.toLowerCase();
    const script = this.scriptCache.get(filename);
    //     if (script) return script;
    //     script = new Script(`async function main() {
    //   ctx.set('ETag', '123');
    //   const [rows]= await  db.execute("select * from device where id='00001'");
    //   return rows;
    // };
    //  main(ctx);
    // `);
    return script;
  }

  private static deepGetFile(root) {
    let backList = [];
    const list = readdirSync(root);
    for (const file of list) {
      const item = path.resolve(root, file);
      if (statSync(item).isDirectory()) {
        backList = backList.concat(FaasScriptManager.deepGetFile(item));
      } else {
        backList.push(item);
      }
    }
    return backList;
  }

  async init() {
    const dir = FaasScriptManager.deepGetFile(script_root);
    dir.forEach(filename => {
      this.scriptChanged(filename);
    });
    watch.watchTree(script_root, (f, curr, prev) => {
      if (typeof f === 'object' && prev === null && curr === null) {
        // Finished walking the tree
      } else {
        console.log(f, 'changed');
        this.scriptChanged(f);
      }
    });
  }
}
