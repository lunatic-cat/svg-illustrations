const appRoot = require('app-root-path');
const del = require('del');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const svgr = require('@svgr/core').default;
const util = require('util');
const { EOL } = require('os');
const { exec } = require('child_process');
const { pascalCase } = require('pascal-case');

(async () => {
  const root = path.join(__dirname, '../');
  const dist = path.join(root, 'dist');
  const illustrations = path.join(root, 'src', 'illustrations');
  const pattern = path.join(appRoot.toString(), 'illustrations', '**', '*.svg');
  const files = glob.sync(pattern);
  const imports = [];
  const maps = [];

  console.log('Generating unDraw components ...');

  // remove existing
  del.sync(dist, { force: true });
  del.sync(illustrations, { force: true });

  for (const file of files) {
    const filename = path.basename(file).split('.')[0];
    const componentName = 'Illustration' + pascalCase(filename);
    const src = fs.readFileSync(file);

    let componentPath;
    let dest;
    if (file.includes('drawkit')) {
      dest = path.join(illustrations, 'drawkit', `${componentName}.jsx`);
      componentPath = 'drawkit/' + componentName;
    } else {
      dest = path.join(illustrations, `${componentName}.jsx`);
      componentPath = componentName;
    }

    const content = await svgr(
      src,
      {
        icon: true,
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
        svgProps: {
          style: '{styleProps}',
        },
        template: svgrTemplate,
      },
      { componentName }
    );

    fs.outputFileSync(dest, content);
    console.log(`Component built: "${componentName}"`);

    imports.push(`import ${componentName} from './${componentPath}';`);
    maps.push(`'${filename}': ${componentName},`);
  }

  const dest = path.join(illustrations, 'index.js');
  let content = '';

  if (imports.length > 0) {
    content += imports.join(EOL);
    content += EOL;
    content += EOL;
  }

  content += 'export default {';

  if (maps.length > 0) {
    content += EOL;
    content += maps.join(EOL);
    content += EOL;
  }

  content += '};';
  content += EOL;

  fs.outputFileSync(dest, content);

  console.log('Compile dist directory...');

  // compile dist
  const promiseExec = util.promisify(exec);
  await promiseExec("NODE_ENV=production babel src -d dist --ignore '**/*.test.js'", { cwd: root });

  console.log('Done!');
})();

/**
 * Custom svgr template.
 */
function svgrTemplate(api, opts, state) {
  const { template } = api;
  const { componentName, jsx } = state;

  return template.ast`
    import * as React from 'react';

    function ${componentName}(p) {
      const { height, style, ...props } = p;
      const styleProps = { width: '100%', height, ...style };

      return (${jsx});
    };

    export default ${componentName};
  `;
}
