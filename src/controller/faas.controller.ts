import { Inject, Controller, Get, Post } from '@midwayjs/core';
import { FaasService } from '../service/faas.servcie';
import { Context } from 'egg';

@Controller('/faas')
export class FaasController {
  @Inject()
  ctx: Context;

  @Inject()
  faasService: FaasService;

  @Get('/:id*')
  @Post('/:id*')
  async getVm(): Promise<void> {
    const name: string = this.ctx.params.id;
    this.ctx.body = this.faasService.run_api(name, this.ctx);
  }
}
