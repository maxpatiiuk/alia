import { theories } from '../../tests/utils.js';
import { getUniqueName } from '../uniquifyName.js';

theories(getUniqueName, [
  { in: ['a', []], out: 'a' },
  { in: ['a', ['a']], out: 'a2' },
  { in: ['a', ['a', 'a2']], out: 'a3' },
]);
