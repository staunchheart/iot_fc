import { App, Configuration, ILifeCycle, Inject } from '@midwayjs/core';
import { join } from 'path';
import * as egg from '@midwayjs/web';
import { FaasScriptManager } from './manager/FaasScriptManager';

@Configuration({
  imports: [egg],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration implements ILifeCycle {
  @App('egg')
  app: egg.Application;
  @Inject()
  faasScript: FaasScriptManager;
  async onReady() {}
  async onServerReady() {
    await this.faasScript.init();
  }
}
