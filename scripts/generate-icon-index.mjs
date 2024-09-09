import fs from 'fs/promises';
import path from 'path';

const ICON_DIRECTORY = './icons';
const INDEX_FILE_PATH = './icons/index.ts';

const generateIconIndex = async () => {
  try {
    const svgFiles = await fs.readdir(ICON_DIRECTORY);
    const iconExports = await Promise.all(
      svgFiles
        .filter(file => file.endsWith('.svg'))
        .map(async file => {
          await updateSvgColors(file);
          return createExportStatement(file);
        })
    );

    const indexFileContent = iconExports.join('\n') + '\n';
    await fs.writeFile(INDEX_FILE_PATH, indexFileContent, 'utf8');

    console.log(`Icon index file generated successfully at ${INDEX_FILE_PATH}`);
  } catch (error) {
    console.error('Error generating icon index:', error);
  }
};

const updateSvgColors = async fileName => {
  const filePath = path.join(ICON_DIRECTORY, fileName);
  let content = await fs.readFile(filePath, 'utf8');

  content = content.replace(/(stroke|fill)="(?!none)([^"]+)"/gi, (match, attr, value) => {
    if (value.toLowerCase() !== 'none') {
      return `${attr}="currentColor"`;
    }
    return match;
  });

  await fs.writeFile(filePath, content, 'utf8');
};

const createExportStatement = fileName => {
  const baseName = path.basename(fileName, '.svg');
  const componentName = convertToComponentName(baseName);
  return `export { default as ${componentName} } from './${baseName}.svg';`;
};

const convertToComponentName = baseName => baseName.split('-').map(capitalizeFirstLetter).join('');

const capitalizeFirstLetter = word => word.charAt(0).toUpperCase() + word.slice(1);

generateIconIndex();
