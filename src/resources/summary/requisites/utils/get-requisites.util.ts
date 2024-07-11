import { InnResponse } from '../../dto';
import { EntityRequisites } from '../../entities';

export function getRequisites(requisites: EntityRequisites[]): InnResponse  {
  return requisites?.length ? requisites.reduce(
    (acc, curr, index) => {
      return {
        ids: [...acc.ids, curr.requisites.id],
        inn:
          acc.inn +
          `${curr.requisites.inn}${requisites.length !== 1 && index !== requisites.length - 1 ? ', ' : ''}`,
        companyName:
          acc.companyName +
          `${curr.requisites.companyName}${requisites.length !== 1 && index !== requisites.length - 1 ? ', ' : ''}`,
        kpp:
          acc.kpp +
          `${curr.requisites.kpp}${requisites.length !== 1 && index !== requisites.length - 1 ? ', ' : ''}`,
      };
    },
    { ids: [], kpp: '', inn: '', companyName: '' },
  ) : { ids: [], kpp: '', inn: '', companyName: '' };
}