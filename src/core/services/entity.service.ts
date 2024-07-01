import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FindOneOptions, FindOptionsRelations, Repository } from 'typeorm';

@Injectable()
export class EntityService {
  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {}

  async findOne<T, U = T>(
    repository: Repository<T>,
    select?: FindOneOptions<T>['select'],
    cacheValue?: string,
    relations?: FindOptionsRelations<T>,
    where?: Partial<Record<keyof T, any>>,
    ttl: number = 3600000,
    transform?: (entity: T) => U,
  ): Promise<U | undefined> {
    const cacheKey = cacheValue
      ? `${repository.metadata.name.toLowerCase()}_${cacheValue}`
      : '';

    let entity = cacheKey
      ? await this.cacheManager.get<T>(cacheKey)
      : undefined;

    if (!entity) {
      const options: FindOneOptions<T> = {
        where: { ...where },
        relations,
      };

      if (select) {
        options.select = select;
      }

      entity = await repository.findOne(options);

      if (entity) {
        const transformedEntity = transform
          ? transform(entity)
          : (entity as unknown as U);

        if (cacheKey) {
          await this.cacheManager.set(cacheKey, entity, ttl);
        }

        return transformedEntity;
      }
    } else if (transform) {
      return transform(entity);
    }

    return entity as unknown as U;
  }
}
