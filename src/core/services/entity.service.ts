import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  FindOneOptions,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export interface FindOneParams<T, U = T> {
  cacheValue: string;
  repository: Repository<T>;
  ttl?: number;
  select?: FindOneOptions<T>['select'];
  relations?: FindOptionsRelations<T> | FindOptionsRelationByString;
  where?: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
  transform?: (entity: T) => U;
}

@Injectable()
export class EntityService {
  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {}

  async findOne<T, U = T>({
    cacheValue,
    repository,
    ttl = 3600,
    select,
    relations,
    where,
    transform,
  }: FindOneParams<T, U>): Promise<U | undefined> {
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
          await this.cacheManager.set(cacheKey, entity, { ttl } as any);
        }

        return transformedEntity;
      }
    } else if (transform) {
      return transform(entity);
    }

    return entity as unknown as U;
  }
}
