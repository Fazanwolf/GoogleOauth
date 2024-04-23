import { ApiProperty } from "@nestjs/swagger";

export class ErrorDto {
  @ApiProperty({ description: "Success status", example: true })
  success!: boolean;
}
