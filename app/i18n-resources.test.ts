import en from '../translations/en/translation.json';
import zhCN from '../translations/zh-CN/translation.json';

function flatten(resource: object, prefix = ''): Record<string, string> {
  return Object.fromEntries(
    Object.entries(resource).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === 'string'
        ? [[path, value]]
        : Object.entries(flatten(value, path));
    })
  );
}

const english = flatten(en);
const chinese = flatten(zhCN);

it('provides the same resource keys in English and Simplified Chinese', () => {
  expect(Object.keys(chinese).sort()).toEqual(Object.keys(english).sort());
});

it.each(Object.keys(english))(
  'preserves interpolation and markup in %s',
  (key) => {
    const tokens = /{{\s*[^}]+\s*}}|<\/?[a-z][^>]*>/gi;
    expect(chinese[key]).not.toBe('');
    expect(chinese[key].match(tokens)).toEqual(english[key].match(tokens));
  }
);
