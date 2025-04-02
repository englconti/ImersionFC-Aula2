import { Roles } from '@prisma/client';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Roles;
}
// dto - data transfer object é um objeto que representa o corpo da requisição
// this is a design pattern that is used to transfer data between different layers of the application
