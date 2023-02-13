import { MidwayConfig } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';
import { DataSourceOptions } from 'typeorm';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1675673931815_7708',
  koa: {
    port: 7002,
  },
  jwt: {
    secret: 'INnyQ50BEE6AITQraIaDGooJ',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: process.env.MYSQL_PORT || 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'diancan-db',
        synchronize: false,
        logging: false,
      } as DataSourceOptions
    }
  },
  cache: { // midway cache
    // store: require('cache-manager-ioredis'),
    store: redisStore,
    options: {
      host: process.env.REDIS_HOST || '127.0.0.1', // default value
      port: parseInt(process.env.REDIS_PORT) || 6379, // default value
      db: 0,
      ttl: 60,
    },
  },
  mailer: { // 邮件推送配置
    host: process.env.MAILER_HOST || '',
    port: parseInt(process.env.MAILER_PORT) || 80,
    auth: {
      user: process.env.MAILER_USER || '',
      pass: process.env.MAILER_PASS || '',
    },
    secure: false,
  }
} as MidwayConfig;
