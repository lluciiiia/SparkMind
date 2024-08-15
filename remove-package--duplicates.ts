import { readdirSync } from 'fs';
import { join } from 'path';

const packages = readdirSync(join(__dirname, 'packages'));

console.log(packages);