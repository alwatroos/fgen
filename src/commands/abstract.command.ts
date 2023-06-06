export abstract class AbstractCommand<InputParams> {
  abstract execute(params: InputParams): void;
}
