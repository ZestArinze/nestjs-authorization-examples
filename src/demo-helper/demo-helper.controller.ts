import { Controller, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { DemoHelperService } from './demo-helper.service';

@Controller('demo-helper')
export class DemoHelperController {
  constructor(private readonly demoHelperService: DemoHelperService) {}

  // for demo only
  @Public()
  @Post()
  async setUpForDemo() {
    return await this.demoHelperService.setUpForDemo();
  }
}
