import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { styleText } from 'util';

export class CommanderService {
  paths = {
    privatePage: 'src/app/(private)',
    publicPage: 'src/app/(public)',
    drawer: 'src/app/@drawer',
    action: 'src/app/actions',
    component: 'src/app/components',
    hook: 'src/app/hooks',
    provider: 'src/app/providers',
    useCase: 'src/server/application/useCases',
    domainService: 'src/server/domain/services',
  };

  sanitizePath(name) {
    if (name.startsWith('/')) name = name.slice(1);
    if (name.endsWith('/')) name.slice(0, -1);
    return name;
  };

  camelCase(name) {
    return name
      .split(/[^a-zA-Z0-9]/)
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');

  }

  pascalCase(name) {
    return name
      .split(/[^a-zA-Z0-9]/)
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

  ucfirst(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  createFile(fileName, ...content) {
    const dirName = dirname(fileName);
    if (!existsSync(dirName)) {
      console.log(styleText('cyan', `Creating directory ${dirName}`));
      mkdirSync(dirName, { recursive: true });
    }
    if (existsSync(fileName)) {
      console.log(styleText('redBright', `File already exists ${fileName}`));
      return;
    }
    console.log(styleText('cyan', `Creating file ${fileName}`));
    writeFileSync(fileName, content.join('\n'));
  }
}