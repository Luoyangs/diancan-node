import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    type: 'timestamp'
  })
  ctime: number;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  mtime: number;
}
