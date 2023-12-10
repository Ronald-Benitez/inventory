/*
 id        Int      @id @default(autoincrement())
  name      String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
*/

export interface User {
  id: number;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
