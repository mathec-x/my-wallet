#!/usr/bin/env node
import { Command } from 'commander';
import { CommanderService } from './commander-service.config.mjs';

const program = new Command();
const commands = new CommanderService();

program
  .command('page')
  .description('Add a new page to the project')
  .argument('<name>', 'Name of the page to add')
  .option('-p, --private', 'Indicates if the page is private')
  .action(function (name, args) {
    const path = args.private ? commands.paths.privatePage : commands.paths.publicPage;
    const fnName = commands.pascalCase(name);
    commands.createFile(
      `${path}/${commands.sanitizePath(name)}/page.tsx`,
      `export default async function ${fnName}Page() {\r\treturn (\r\t\t<div>Page ${fnName}</div>\r\t);\r}`
    );
  });

program
  .command('drawer')
  .description('Add a new drawer to the project')
  .argument('<name>', 'Name of the drawer to add')
  .action(function (name) {
    const path = commands.paths.drawer;
    const fnName = commands.pascalCase(name);
    commands.createFile(
      `${path}/(.)${commands.sanitizePath(name)}/page.tsx`,
      `export default async function ${fnName}Drawer() {\r\treturn (\r\t\t<div>Drawer ${fnName}</div>\r\t);\r}`
    );
  });

program
  .command('action')
  .description('Add a new action to the project')
  .argument('<name>', 'Name of the action to add')
  .action(function (name) {
    const path = commands.paths.action;
    const fnName = commands.pascalCase(name);
    commands.createFile(
      `${path}/${commands.sanitizePath(name)}/${name}.actions.ts`,
      '\'use server\';',
      `\nimport { ${fnName}UseCase } from '@/server/application/useCases/${name}/${name}.useCase';`,
      `\nconst ${name}UseCase = new ${fnName}UseCase();\n`,
      `export async function ${name}Action() {`,
      `\treturn ${name}UseCase.execute();`,
      '};'
    );
  });

program
  .command('component')
  .description('Add a new component to the project')
  .argument('<name>', 'Name of the component to add')
  // Componentes compostos (formulários, listas, etc)
  .option('-c, --composite', 'Complete session component, dashboard, composite forms, etc')
  // Componentes de interface (cards, modals, tables, etc)
  .option('-u --ui', 'UI component, cards, modals, tables, etc')
  // Componentes de layout (header, footer, sidebar, etc)
  .option('-l --layout', 'Layout component, header, footer, sidebar, etc')
  // Componentes primitivos (avatar, badge, button, input, etc)
  .option('-p --primitive', 'Primitive component, avatar, badge, button, etc')
  .action(function (name, args) {
    const folder = args.composite ? '/composites' : args.ui ? '/ui' : args.layout ? '/layouts' : args.primitive ? '/primitives' : '/elements';
    const type = args.composite ? 'composite' : args.ui ? 'ui' : args.layout ? 'layout' : args.primitive ? 'primitive' : 'element';
    const path = commands.paths.component + folder;
    const fnName = commands.ucfirst(name);
    commands.createFile(`${path}/${fnName}/${name}.module.css`, '');
    commands.createFile(
      `${path}/${fnName}/${name}.${type}.tsx`,
      `export default function ${fnName}() {\r\treturn (\r\t\t<div>${fnName}</div>\r\t);\r}`
    );
  });

program
  .command('useCase')
  .description('Add a new use case in server')
  .argument('<name>', 'Name of the use case to add')
  .action(function (name) {
    const path = commands.paths.useCase;
    const fnName = commands.ucfirst(name);
    commands.createFile(`${path}/${name}/${name}.spec.ts`, '');
    commands.createFile(
      `${path}/${name}/${name}.useCase.ts`,
      'import \'server-only\';\n',
      `export interface ${fnName}UseCaseParams { }\n`,
      `export class ${fnName}UseCase {\r\texecute() { };\r}\n`
    );
  });

program
  .command('domain')
  .description('Add a new domain service in server')
  .argument('<name>', 'Name of the domain service to add')
  .action(function (name) {
    const path = commands.paths.domainService;
    const fnName = commands.ucfirst(name);
    commands.createFile(`${path}/${name}/${name}.spec.ts`, '');
    commands.createFile(
      `${path}/${name}/${name}.service.ts`,
      `export class ${fnName} {\r\tconstructor() { };\r}`
    );
  });


program.parse();