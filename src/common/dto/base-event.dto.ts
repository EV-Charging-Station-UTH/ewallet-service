export abstract class BaseEventDto<T extends string, P, Y = any> {
  type: T;
  payload: P;
  header?: Y;
}
