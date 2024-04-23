import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty({
    description: "The error name",
    example: "Bad Request",
  })
  message!: string;

  @ApiProperty({
    description: "All error message. Can be a simple string or an array",
    example: [["email must be a string", "email must be a valid email"]],
  })
  errors?: string[];

  @ApiProperty({
    description: "The error status code",
    example: 400,
  })
  statusCode!: number;
}
