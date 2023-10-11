import { Inject, Provide } from '@midwayjs/core';

import { ISandbox } from '../interface';
import { MySqlDataSourceManager } from '../manager/MySqlDataSourceManager';
import { FaasScriptManager } from '../manager/FaasScriptManager';
import { Context } from 'egg';
const TIMEOUT = 1000 * 1.5;
require('mysql2/promise');

@Provide()
export class FaasService {
  @Inject()
  mSql: MySqlDataSourceManager;

  @Inject()
  faasScript: FaasScriptManager;
  async run_api(name: string, ctx: Context) {
    let timr = null;
    const db = this.mSql.getDataSource('zhang');
    // const [rows, fields] = await db.execute(
    //    "select * from device where id='00001'"
    //  );
    // const [rows] = await db.promise().execute('SELECT * FROM `users`');
    // console.log(rows);
    const result = await new Promise(
      (next: (data: any) => void, reject: (err: Error) => void) => {
        const sandbox: ISandbox = {
          setInterval,
          setTimeout,
          ctx: ctx,
          db: db.promise(),
        };

        try {
          timr = setTimeout(() => {
            reject(new Error('Script execution timed out.'));
          }, TIMEOUT);
          const script = this.faasScript.getScript(name);
          if (!script) reject(new Error('page not found'));
          const data = script.runInNewContext(sandbox, {
            filename: name,
            timeout: TIMEOUT,
          });
          next(data);
        } catch (error) {
          reject(error);
        }
      }
    ).catch(err => {
      return err instanceof Error ? err : new Error(err.stack);
    });

    if (timr) {
      clearTimeout(timr);
      timr = null;
    }

    let resBody = {};

    if (result instanceof Error) {
      console.log('[ERROR]', result);

      resBody = {
        error: result.toString
          ? result.toString().replace(/Error: Error: /g, 'Error: ')
          : result,
      };
    } else {
      console.log('[Response]', result);

      resBody = result;
    }
    return resBody;
  }
}
