export type Config = {
  regularGlyph: JSX.Element;
  currentGlyph: JSX.Element;
  backboneGlyph: JSX.Element;
};

export type EventConfig<E extends string> = { [key in E]: Config };
