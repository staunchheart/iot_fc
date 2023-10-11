import {
  Provide,
  Scope,
  ScopeEnum,
  DataSourceManager,
  Init,
} from '@midwayjs/core';
import * as mysql from 'mysql2';

@Provide()
@Scope(ScopeEnum.Singleton)
export class MySqlDataSourceManager extends DataSourceManager<mysql.Connection> {
  private mIsConnected = false;
  protected checkConnected(dataSource: mysql.Connection): Promise<boolean> {
    return Promise.resolve(this.mIsConnected);
  }
  // 创建单个实例
  protected async createDataSource(
    config: any,
    dataSourceName: string
  ): Promise<mysql.Connection> {
    const conn = mysql.createConnection(config);
    conn.on('error', (err: mysql.QueryError) => {
      conn.connect();
    });
    this.mIsConnected = true;
    return conn;
  }

  getName(): string {
    return 'mysql';
  }

  // getDataSource(dataSourceName: string): mysql.Connection {
  //   const db = super.getDataSource(dataSourceName);
  //   if (!db) {
  //     this.in
  //   }
  //   return null;
  // }

  async destroyDataSource(dataSource: mysql.Connection): Promise<void> {
    if (await this.checkConnected(dataSource)) {
      this.mIsConnected = false;
      await dataSource.destroy();
    }
  }
  @Init()
  async init() {
    // 需要注意的是，这里第二个参数需要传入一个实体类扫描地址
    await this.initDataSource(
      {
        dataSource: {
          zhang: {
            host: 'localhost',
            user: 'root',
            password: '!Sa123456',
            database: 'srlwstore',
          },
        },
      },
      ''
    );
  }
}
