import {PayloadEntity} from '../enums/payload-entity';
import {PayloadAction} from '../enums/payload-action';

export class Payload {
  action: PayloadAction;
  entity: PayloadEntity;
  data: any;
}
