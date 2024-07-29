import { PartialType } from '@nestjs/mapped-types';
import { CreateDemoHelperDto } from './create-demo-helper.dto';

export class UpdateDemoHelperDto extends PartialType(CreateDemoHelperDto) {}
