import { Inject, Injectable } from '@nestjs/common';
import { type RedisClientType } from 'redis';

@Injectable()
export class RedisService {

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async sAdd(key: string, ...members: string[]) {
    return this.redisClient.sAdd(key, members);
  }

  async sInterStore(newSetKey: string, set1: string, set2: string) {
    return this.redisClient.sInterStore(newSetKey, [set1, set2]);
  }

  async sIsMember(key: string, member: string) {
    return this.redisClient.sIsMember(key, member);
  }

  async sMember(key: string) {
    return this.redisClient.sMembers(key);
  }

  async exists(key: string) {
    const result = await this.redisClient.exists(key);
    return result > 0
  }

  // 排行榜
  async zRankingList(key: string, start: number = 0, end: number = -1) {
    const keys = await this.redisClient.zRange(key, start, end, {
      REV: true
    });
    const rankingList = {};
    for (let i = 0; i < keys.length; i++) {
      rankingList[keys[i]] = await this.zScore(key, keys[i]);
    }
    return rankingList;
  }

  async zAdd(key: string, members: Record<string, number>) {
    const mems: { value: string; score: number }[] = [];
    for (let key in members) {
      mems.push({
        value: key,
        score: members[key]
      });
    }
    return await this.redisClient.zAdd(key, mems);
  }

  async zScore(key: string, member: string) {
    return await this.redisClient.zScore(key, member);
  }

  async zRank(key: string, member: string) {
    return await this.redisClient.zRank(key, member);
  }

  async zIncr(key: string, member: string, increment: number) {
    return await this.redisClient.zIncrBy(key, increment, member)
  }

  async zUnion(newKey: string, keys: string[]) {
    if (!keys.length) {
      return []
    };
    if (keys.length === 1) {
      return this.zRankingList(keys[0]);
    }

    await this.redisClient.zUnionStore(newKey, keys as [string, ...string[]]);

    return this.zRankingList(newKey);
  }

  async keys(pattern: string) {
    return this.redisClient.keys(pattern);
  }
}
