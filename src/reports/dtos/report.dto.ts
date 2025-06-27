import { Expose, Transform } from 'class-transformer';
import { Report } from '../report.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  @Transform(({ obj }) => {
    const report: Report = obj;
    return report.user.id;
  })
  userId: number;
}
