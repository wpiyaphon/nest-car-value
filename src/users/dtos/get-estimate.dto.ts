import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from '../../reports/dtos/create-report.dto';

export class GetEstimateDto extends PartialType(
  OmitType(CreateReportDto, ['price'] as const),
) {}
