import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  mileage: number;

  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
  @Min(0)
  price: number;
}
