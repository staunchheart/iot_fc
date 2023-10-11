import { Inject, Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface';

import { MySqlDataSourceManager } from '../manager/MySqlDataSourceManager';
//import { DataTypes, Sequelize } from 'sequelize';

@Provide()
export class UserService {
  @Inject()
  mSql: MySqlDataSourceManager;

  async getUser(options: IUserOptions) {
    // const sequelize = new Sequelize('sqlite::memory:');

    // const TTest = sequelize.define('test1', { test1: DataTypes.STRING });
    // const query1 = await sequelize.getQueryInterface().select(TTest, 'aaa');

    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
