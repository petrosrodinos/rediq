import { PartialType } from '@nestjs/swagger';
import { CreateAnalysisConfigurationDto } from './create-analysis-configuration.dto';

export class UpdateAnalysisConfigurationDto extends PartialType(
  CreateAnalysisConfigurationDto,
) {}
