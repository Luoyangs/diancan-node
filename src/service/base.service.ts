import { Inject } from '@midwayjs/decorator';
import { CacheManager } from '@midwayjs/cache';
import { Redis } from 'ioredis';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@midwayjs/typeorm';

export class BaseService {

  @Inject('cache:cacheManager')
  cacheManager: CacheManager;

  @InjectDataSource('default')
  dataSourceManager: DataSource;

  getAdminRedis(): Redis {
    return (this.cacheManager.cache.store as any).getClient();
  }

  getAdminCacheManager(): CacheManager {
    return this.cacheManager;
  }
}
