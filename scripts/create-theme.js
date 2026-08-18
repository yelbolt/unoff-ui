#!/usr/bin/env node
// @ts-check

import { promisify } from 'util'
import { fileURLToPath } from 'url'
import readline from 'readline'
import process from 'process'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const copyFile = promisify(fs.copyFile)
const rename = promisify(fs.rename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

const TERRAZZO_DIR = path.join(rootDir, 'terrazzo')
const TOKENS_PLATFORMS_DIR = path.join(rootDir, 'tokens', 'platforms')

const SOURCE_COLOR_THEME = 'figma'

/**
 * Utility functions for colorful logging
 * @type {{
 *  info: (message: string) => void,
 *  success: (message: string) => void,
 *  warn: (message: string) => void,
 *  error: (message: string) => void,
 *  title: (message: string) => void,
 *  step: (message: string) => void,
 *  highlight: (text: string) => string,
 *  path: (text: string) => string
 * }}
 */
const log = {
  info: (message) => console.log(chalk.blue('ℹ ') + message),
  success: (message) => console.log(chalk.green('✅ ') + message),
  warn: (message) => console.log(chalk.yellow('⚠ ') + message),
  error: (message) => console.error(chalk.red('❌ ') + message),
  title: (message) => console.log(chalk.bold.cyan('\n' + message)),
  step: (message) => console.log(chalk.magenta('→ ') + message),
  highlight: (text) => chalk.bold.cyan(text),
  path: (text) => chalk.italic.yellow(text),
}

/**
 * Ask user for theme name
 * @returns {Promise<string>} The theme name
 */
function askThemeName() {
  return new Promise((resolve) => {
    rl.question(
      chalk.bold.blue('Enter the name for your new theme: '),
      (answer) => {
        if (!answer.trim()) {
          log.warn('Theme name cannot be empty. Please try again.')
          return askThemeName().then(resolve)
        }
        resolve(answer.trim().toLowerCase())
      }
    )
  })
}

/**
 * Create directories if they don't exist
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function ensureDirectories(themeName) {
  const tokenDir = path.join(TOKENS_PLATFORMS_DIR, themeName)
  const terrazzoDir = path.join(TERRAZZO_DIR, themeName)
  const iconsDir = path.join(rootDir, 'src', 'icons', themeName)

  try {
    if (!fs.existsSync(tokenDir)) {
      await mkdir(tokenDir, { recursive: true })
      log.success(
        `Created tokens platform directory for ${log.highlight(themeName)}`
      )
    }

    if (!fs.existsSync(terrazzoDir)) {
      await mkdir(terrazzoDir, { recursive: true })
      log.success(`Created terrazzo directory for ${log.highlight(themeName)}`)
    }

    // Create icons directory if it doesn't exist
    if (!fs.existsSync(iconsDir)) {
      await mkdir(iconsDir, { recursive: true })
      log.success(`Created icons directory for ${log.highlight(themeName)}`)
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error creating directories: ${error.message}`)
    throw error
  }
}

/**
 * Update Storybook preview configuration to include the new theme
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function updateStorybookPreview(themeName) {
  const previewPath = path.join(rootDir, '.storybook', 'preview.tsx')

  try {
    let previewContent = await readFile(previewPath, 'utf8')

    const themesItemsRegex = /(items: \[.*?'sketch'.*?)(\],)/
    const updatedThemesItems = `$1, '${themeName}'$2`
    previewContent = previewContent.replace(
      themesItemsRegex,
      updatedThemesItems
    )

    const modesItemsRegex = new RegExp(
      `(items: \\[\\s*.*?'${SOURCE_COLOR_THEME}-dark',\\s*)`,
      's'
    )
    const updatedModesItems = `$1  '${themeName}-light',\n          '${themeName}-dark',\n        `
    previewContent = previewContent.replace(modesItemsRegex, updatedModesItems)

    const backgroundMapRegex = new RegExp(
      `(const backgroundMap = \\{.*?'${SOURCE_COLOR_THEME}-dark': '#202022',\\s*)`,
      's'
    )
    const updatedBackgroundMap = `$1  '${themeName}-light': '#ffffff',\n        '${themeName}-dark': '#202022',\n      `
    previewContent = previewContent.replace(
      backgroundMapRegex,
      updatedBackgroundMap
    )

    // Write the updated content back to the file
    await writeFile(previewPath, previewContent)
    log.success(
      `Updated Storybook preview.tsx with configuration for ${log.highlight(themeName)}`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error updating Storybook preview: ${error.message}`)
    throw error
  }
}

/**
 * Main function
 */
/**
 * Replace all theme names in content with the new theme name
 * @param {string} content - The file content
 * @param {string} newThemeName - The new theme name
 * @returns {string} Updated content
 */
function replaceAllThemeNames(content, newThemeName) {
  const existingThemes = ['figma', 'penpot', 'sketch']

  let updatedContent = content

  for (const oldTheme of existingThemes)
    updatedContent = updatedContent
      .replace(
        new RegExp(`\\b${oldTheme}-light\\b`, 'g'),
        `${newThemeName}-light`
      )
      .replace(
        new RegExp(`\\b${oldTheme}-dark\\b`, 'g'),
        `${newThemeName}-dark`
      )
      // Data attributes with double quotes
      .replace(
        new RegExp(`\\[data-theme="${oldTheme}"\\]`, 'g'),
        `[data-theme="${newThemeName}"]`
      )
      .replace(
        new RegExp(`\\[data-theme='${oldTheme}'\\]`, 'g'),
        `[data-theme='${newThemeName}']`
      )
      // Data mode attributes
      .replace(
        new RegExp(`\\[data-mode="${oldTheme}-light"\\]`, 'g'),
        `[data-mode="${newThemeName}-light"]`
      )
      .replace(
        new RegExp(`\\[data-mode="${oldTheme}-dark"\\]`, 'g'),
        `[data-mode="${newThemeName}-dark"]`
      )
      .replace(
        new RegExp(`\\[data-mode='${oldTheme}-light'\\]`, 'g'),
        `[data-mode='${newThemeName}-light']`
      )
      .replace(
        new RegExp(`\\[data-mode='${oldTheme}-dark'\\]`, 'g'),
        `[data-mode='${newThemeName}-dark']`
      )
      // File paths and names
      .replace(
        new RegExp(`filename: 'styles/${oldTheme}\\.scss'`, 'g'),
        `filename: 'styles/${newThemeName}.scss'`
      )
      .replace(
        new RegExp(`filename: '${oldTheme}-`, 'g'),
        `filename: '${newThemeName}-`
      )
      .replace(
        new RegExp(`'\\./tokens/platforms/${oldTheme}/`, 'g'),
        `'./tokens/platforms/${newThemeName}/`
      )
      // Root selectors
      .replace(
        new RegExp(`:root\\[data-theme="${oldTheme}"\\]`, 'g'),
        `:root[data-theme="${newThemeName}"]`
      )
      .replace(
        new RegExp(`:root\\[data-theme='${oldTheme}'\\]`, 'g'),
        `:root[data-theme='${newThemeName}']`
      )
      // Import statements
      .replace(
        new RegExp(`@import 'styles/${oldTheme}'`, 'g'),
        `@import 'styles/${newThemeName}'`
      )
      .replace(
        new RegExp(`@import "styles/${oldTheme}"`, 'g'),
        `@import "styles/${newThemeName}"`
      )
      // Theme configuration
      .replace(
        new RegExp(`theme: ['"']${oldTheme}['"']`, 'g'),
        `theme: '${newThemeName}'`
      )
      .replace(new RegExp(`theme: ${oldTheme}`, 'g'), `theme: ${newThemeName}`)
      // Base selectors in plugins
      .replace(
        new RegExp(`baseSelector: ':root\\[data-theme="${oldTheme}"\\]'`, 'g'),
        `baseSelector: ':root[data-theme="${newThemeName}"]'`
      )
      .replace(
        new RegExp(
          `baseSelector: ':root\\[data-theme=\\'${oldTheme}\\'\\]'`,
          'g'
        ),
        `baseSelector: ':root[data-theme='${newThemeName}']'`
      )
      // Color references
      .replace(
        new RegExp(`${oldTheme}\\.color.*`, 'g'),
        `${newThemeName}.color.*',`
      )

  return updatedContent
}

/**
 * Create Terrazzo configuration files for the new theme
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function createTerrazzoFiles(themeName) {
  const sourceTerrazzoDir = path.join(TERRAZZO_DIR, SOURCE_COLOR_THEME)
  const targetTerrazzoDir = path.join(TERRAZZO_DIR, themeName)

  try {
    if (!fs.existsSync(targetTerrazzoDir)) {
      await mkdir(targetTerrazzoDir, { recursive: true })
      log.success(`Created Terrazzo directory for ${log.highlight(themeName)}`)
    }

    const targetComponentsDir = path.join(targetTerrazzoDir, 'components')
    if (!fs.existsSync(targetComponentsDir)) {
      await mkdir(targetComponentsDir, { recursive: true })
      log.success(
        `Created Terrazzo components directory for ${log.highlight(themeName)}`
      )
    }

    const terrazzFiles = await readdir(sourceTerrazzoDir)

    for (const file of terrazzFiles) {
      const sourceFilePath = path.join(sourceTerrazzoDir, file)
      const targetFilePath = path.join(targetTerrazzoDir, file)

      if (fs.statSync(sourceFilePath).isFile() && file.endsWith('.js')) {
        let content = await readFile(sourceFilePath, 'utf8')

        content = replaceAllThemeNames(content, themeName)

        if (file === 'terrazzo.colors.js' || file === 'terrazzo.text.js')
          if (!content.includes(`./tokens/platforms/${themeName}/icon.json`))
            content = content.replace(
              /tokens: \[([\s\S]*?)\]/,
              (match, tokensContent) => {
                return `tokens: [${tokensContent}${tokensContent.endsWith(',') ? '' : ','}\n    './tokens/platforms/${themeName}/icon.json',\n  ]`
              }
            )

        await writeFile(targetFilePath, content)
        log.step(
          `Created Terrazzo configuration file: ${log.path(path.relative(rootDir, targetFilePath))}`
        )
      }
    }

    const sourceComponentsDir = path.join(sourceTerrazzoDir, 'components')

    if (fs.existsSync(sourceComponentsDir)) {
      const componentFiles = await readdir(sourceComponentsDir)

      for (const file of componentFiles) {
        const sourceFilePath = path.join(sourceComponentsDir, file)
        const targetFilePath = path.join(targetComponentsDir, file)

        if (fs.statSync(sourceFilePath).isFile() && file.endsWith('.js')) {
          // Read the source file content
          let content = await readFile(sourceFilePath, 'utf8')

          content = replaceAllThemeNames(content, themeName)

          await writeFile(targetFilePath, content)
          log.step(
            `Created Terrazzo component file: ${log.path(path.relative(rootDir, targetFilePath))}`
          )
        }
      }
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error creating Terrazzo configuration files: ${error.message}`)
    throw error
  }
}

/**
 * Copy platform tokens directory
 */
/**
 * Update component and module SCSS imports
 * This function will check for and update any import statements in the styles directory
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function updateScssImports(themeName) {
  try {
    const stylesDir = path.join(rootDir, 'src', 'styles')
    const componentDir = path.join(rootDir, 'src', 'components')

    await processStylesDirectory(stylesDir, themeName)

    await processComponentsDirectory(componentDir, themeName)

    log.success(
      `Updated SCSS imports for theme ${log.highlight(themeName)} across the project`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error updating SCSS imports: ${error.message}`)
    throw error
  }
}

/**
 * Process the styles directory to update imports
 * @param {string} stylesDir - The path to the styles directory
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function processStylesDirectory(stylesDir, themeName) {
  try {
    const entries = await readdir(stylesDir, { withFileTypes: true })

    for (const entry of entries)
      if (entry.isDirectory()) {
        const dirPath = path.join(stylesDir, entry.name)
        const files = await readdir(dirPath)

        for (const file of files)
          if (file.endsWith('.scss') || file.endsWith('.module.scss')) {
            const filePath = path.join(dirPath, file)
            await updateImportsInFile(filePath, themeName)
          }
      }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error processing styles directory: ${error.message}`)
    throw error
  }
}

/**
 * Process components directory recursively for SCSS imports
 */
/**
 * Process the components directory to update imports
 * @param {string} componentDir - The path to the components directory
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function processComponentsDirectory(componentDir, themeName) {
  try {
    const entries = await readdir(componentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(componentDir, entry.name)

      if (entry.isDirectory()) {
        const subEntries = await readdir(fullPath)

        const stylesDir = subEntries.find((item) => item === 'styles')
        if (stylesDir) {
          const stylesDirPath = path.join(fullPath, 'styles')
          if (fs.existsSync(stylesDirPath)) {
            const styleFiles = await readdir(stylesDirPath)
            for (const file of styleFiles)
              if (file.endsWith('.scss')) {
                const filePath = path.join(stylesDirPath, file)
                await updateImportsInFile(filePath, themeName)
              }
          }
        }

        for (const file of subEntries)
          if (file.endsWith('.scss')) {
            const filePath = path.join(fullPath, file)
            await updateImportsInFile(filePath, themeName)
          }

        await processComponentsDirectory(fullPath, themeName)
      }
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error processing components directory: ${error.message}`)
    throw error
  }
}

/**
 * Update import statements in a file
 * @param {string} filePath - The path to the file
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function updateImportsInFile(filePath, themeName) {
  try {
    const content = await readFile(filePath, 'utf8')

    const sourceImportRegex = new RegExp(
      `@import ['"](styles/)?${SOURCE_COLOR_THEME}['"];`,
      'g'
    )

    if (sourceImportRegex.test(content)) {
      const newThemeImportRegex = new RegExp(
        `@import ['"](styles/)?${themeName}['"];`,
        'g'
      )

      if (!newThemeImportRegex.test(content)) {
        const updatedContent = content.replace(sourceImportRegex, (match) => {
          return `${match}\n@import ${match.includes('styles/') ? `'styles/${themeName}'` : `'${themeName}'`};`
        })

        await writeFile(filePath, updatedContent)
        log.step(
          `Added ${log.highlight(themeName)} import to ${log.path(path.relative(rootDir, filePath))}`
        )
      }
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(
      `Error updating imports in ${log.path(filePath)}: ${error.message}`
    )
  }
}

/**
 * Create theme module SCSS files for the new theme
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function createThemeModuleFiles(themeName) {
  const tokensModulesDir = path.join(
    rootDir,
    'src',
    'styles',
    'tokens',
    'modules'
  )
  const typesModulePath = path.join(
    tokensModulesDir,
    `${themeName}-types.module.scss`
  )
  const colorsModulePath = path.join(
    tokensModulesDir,
    `${themeName}-colors.module.scss`
  )

  try {
    if (!fs.existsSync(tokensModulesDir)) {
      await mkdir(tokensModulesDir, { recursive: true })
      log.success(`Created tokens modules directory`)
    }

    const typesContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

:export {
  module: '${themeName}-types';
}
`
    await writeFile(typesModulePath, typesContent)
    log.success(
      `Created ${log.highlight(themeName)} types module at ${log.path(path.relative(rootDir, typesModulePath))}`
    )

    const colorsContent = `@import '../${themeName}-colors.scss';

:export {
  module: '${themeName}-colors';
}
`
    await writeFile(colorsModulePath, colorsContent)
    log.success(
      `Created ${log.highlight(themeName)} colors module at ${log.path(path.relative(rootDir, colorsModulePath))}`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error creating module files: ${error.message}`)
    throw error
  }
}

/**
 * Update the theme-styles.scss file in .storybook folder to include the new theme
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function updateThemeStylesImports(themeName) {
  const themeStylesPath = path.join(rootDir, '.storybook', 'theme-styles.scss')

  try {
    if (!fs.existsSync(themeStylesPath)) {
      log.warn(
        `${log.path('.storybook/theme-styles.scss')} does not exist. Creating it with initial imports.`
      )

      const initialContent = `@import '../src/styles/tokens/modules/${themeName}-colors.module.scss';\n@import '../src/styles/tokens/modules/${themeName}-types.module.scss';\n`
      await writeFile(themeStylesPath, initialContent)
      log.success(
        `Created ${log.path('.storybook/theme-styles.scss')} with ${log.highlight(themeName)} imports`
      )
      return
    }

    const themeStylesContent = await readFile(themeStylesPath, 'utf8')

    if (themeStylesContent.includes(`${themeName}-colors.module.scss`)) {
      log.info(
        `Imports for ${log.highlight(themeName)} already exist in theme-styles.scss`
      )
      return
    }

    const lastImportIndex = themeStylesContent.lastIndexOf('@import')
    if (lastImportIndex === -1)
      throw new Error(
        'Could not find any @import statements in theme-styles.scss'
      )

    const endOfLastImport = themeStylesContent.indexOf(';', lastImportIndex) + 1

    const newImports = `

@import '../src/styles/tokens/modules/${themeName}-colors.module.scss';
@import '../src/styles/tokens/modules/${themeName}-types.module.scss';`

    const updatedContent =
      themeStylesContent.slice(0, endOfLastImport) +
      newImports +
      themeStylesContent.slice(endOfLastImport)

    await writeFile(themeStylesPath, updatedContent)
    log.success(
      `Added ${log.highlight(themeName)} imports to theme-styles.scss`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error updating theme-styles.scss: ${error.message}`)
    throw error
  }
}

/**
 * Copy icons from figma theme to new theme
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function copyIconsFromFigma(themeName) {
  const sourceIconsDir = path.join(rootDir, 'src', 'icons', SOURCE_COLOR_THEME)
  const targetIconsDir = path.join(rootDir, 'src', 'icons', themeName)

  try {
    if (!fs.existsSync(sourceIconsDir)) {
      log.warn(
        `Source icons directory ${log.path(sourceIconsDir)} does not exist. Skipping icons copy.`
      )
      return
    }

    if (!fs.existsSync(targetIconsDir)) {
      await mkdir(targetIconsDir, { recursive: true })
      log.success(`Created icons directory for ${log.highlight(themeName)}`)
    }

    const iconFiles = await readdir(sourceIconsDir)

    for (const file of iconFiles)
      if (file.endsWith('.svg')) {
        const sourcePath = path.join(sourceIconsDir, file)
        const targetPath = path.join(targetIconsDir, file)

        await copyFile(sourcePath, targetPath)
        log.step(`Copied icon: ${log.path(path.relative(rootDir, targetPath))}`)
      }

    log.success(`Successfully copied all icons for ${log.highlight(themeName)}`)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error copying icons: ${error.message}`)
    throw error
  }
}

/**
 * Update icon paths in the icon.json file for the new theme
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function updateIconPaths(themeName) {
  const iconJsonPath = path.join(TOKENS_PLATFORMS_DIR, themeName, 'icon.json')

  try {
    if (!fs.existsSync(iconJsonPath)) {
      log.warn(
        `Icon JSON file ${log.path(iconJsonPath)} does not exist. Skipping icon paths update.`
      )
      return
    }

    let iconContent = await readFile(iconJsonPath, 'utf8')

    const sourceIconPath = `/src/icons/${SOURCE_COLOR_THEME}/`
    const targetIconPath = `/src/icons/${themeName}/`

    iconContent = iconContent.replace(
      new RegExp(sourceIconPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      targetIconPath
    )

    await writeFile(iconJsonPath, iconContent)
    log.success(
      `Updated icon paths in ${log.highlight('icon.json')} for theme ${log.highlight(themeName)}`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error updating icon paths: ${error.message}`)
    throw error
  }
}

/**
 * Copy platform tokens from source to new theme
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function copyPlatformTokens(themeName) {
  const sourceTokensDir = path.join(TOKENS_PLATFORMS_DIR, SOURCE_COLOR_THEME)
  const targetTokensDir = path.join(TOKENS_PLATFORMS_DIR, themeName)

  try {
    if (!fs.existsSync(targetTokensDir)) {
      await mkdir(targetTokensDir, { recursive: true })
      log.success(
        `Created platform tokens directory for ${log.highlight(themeName)}`
      )
    }

    // Copy all files from the source tokens directory
    /**
     * Copy files recursively from source to target
     * @param {string} sourceDir - Source directory
     * @param {string} targetDir - Target directory
     * @returns {Promise<void>}
     */
    const copyFilesRecursively = async (sourceDir, targetDir) => {
      const entries = await readdir(sourceDir, { withFileTypes: true })

      for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name)
        const targetPath = path.join(targetDir, entry.name)

        if (entry.isDirectory()) {
          if (!fs.existsSync(targetPath))
            await mkdir(targetPath, { recursive: true })

          await copyFilesRecursively(sourcePath, targetPath)
        } else if (entry.isFile()) {
          await copyFile(sourcePath, targetPath)
          log.step(
            `Copied token file: ${log.path(path.relative(rootDir, targetPath))}`
          )
        }
      }
    }

    await copyFilesRecursively(sourceTokensDir, targetTokensDir)
    log.success(
      `Successfully copied all platform tokens for ${log.highlight(themeName)}`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(`Error copying platform tokens: ${error.message}`)
    throw error
  }
}

/**
 * The copied mode files (modes/{source}-light.tokens.json etc.) still carry the
 * source theme's filename and internal token namespace (root key "figma", and
 * alias references like "{figma.color.bg.default}"). Left as-is, the new theme's
 * own components would keep resolving to the SOURCE theme's colors forever,
 * silently ignoring anything the user edits in the new theme's token files.
 * This renames the mode files and rewrites the namespace so the new theme's
 * tokens resolve to themselves.
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function fixCopiedTokenNamespace(themeName) {
  const themeTokensDir = path.join(TOKENS_PLATFORMS_DIR, themeName)
  const modesDir = path.join(themeTokensDir, 'modes')

  try {
    if (fs.existsSync(modesDir)) {
      const modeFiles = await readdir(modesDir)

      for (const file of modeFiles)
        if (file.startsWith(`${SOURCE_COLOR_THEME}-`)) {
          const newFileName = file.replace(
            `${SOURCE_COLOR_THEME}-`,
            `${themeName}-`
          )
          await rename(
            path.join(modesDir, file),
            path.join(modesDir, newFileName)
          )
          log.step(
            `Renamed ${log.path(`modes/${file}`)} to ${log.path(`modes/${newFileName}`)}`
          )
        }
    }

    let renamedRootKeys = 0
    let renamedAliasRefs = 0

    /** @param {string} dir */
    const walkAndFix = async (dir) => {
      const entries = await readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name)

        if (entry.isDirectory()) await walkAndFix(entryPath)
        else if (entry.isFile() && entry.name.endsWith('.json')) {
          const content = await readFile(entryPath, 'utf8')

          const rootKeyRegex = new RegExp(`"${SOURCE_COLOR_THEME}":\\s*\\{`)
          const aliasRefRegex = new RegExp(`\\{${SOURCE_COLOR_THEME}\\.`, 'g')

          let updatedContent = content
          if (rootKeyRegex.test(updatedContent)) {
            updatedContent = updatedContent.replace(
              rootKeyRegex,
              `"${themeName}": {`
            )
            renamedRootKeys += 1
          }
          if (aliasRefRegex.test(updatedContent)) {
            const matches = updatedContent.match(aliasRefRegex)
            renamedAliasRefs += matches ? matches.length : 0
            updatedContent = updatedContent.replace(
              aliasRefRegex,
              `{${themeName}.`
            )
          }

          if (updatedContent !== content)
            await writeFile(entryPath, updatedContent)
        }
      }
    }

    await walkAndFix(themeTokensDir)

    log.success(
      `Rewrote token namespace for ${log.highlight(themeName)} (${renamedRootKeys} root key(s), ${renamedAliasRefs} alias reference(s))`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error fixing copied token namespace: ${error.message}`)
    throw error
  }
}

/**
 * Create a {theme}-colors.resolver.json for the new theme, based on the
 * source theme's resolver, pointing at the renamed mode files. Without this,
 * terrazzo.color.js would keep building from the SOURCE theme's resolver and
 * the new theme's color customizations would never reach the SCSS output.
 * @param {string} themeName - The name of the theme
 * @returns {Promise<void>}
 */
async function createColorResolver(themeName) {
  const sourceResolverPath = path.join(
    rootDir,
    'tokens',
    `${SOURCE_COLOR_THEME}-colors.resolver.json`
  )
  const targetResolverPath = path.join(
    rootDir,
    'tokens',
    `${themeName}-colors.resolver.json`
  )

  try {
    if (!fs.existsSync(sourceResolverPath)) {
      log.warn(
        `Source resolver ${log.path(sourceResolverPath)} does not exist. Skipping resolver creation.`
      )
      return
    }

    let content = await readFile(sourceResolverPath, 'utf8')

    content = content
      .replace(
        new RegExp(`/platforms/${SOURCE_COLOR_THEME}/modes/`, 'g'),
        `/platforms/${themeName}/modes/`
      )
      .replace(
        new RegExp(`${SOURCE_COLOR_THEME}-light\\.tokens\\.json`, 'g'),
        `${themeName}-light.tokens.json`
      )
      .replace(
        new RegExp(`${SOURCE_COLOR_THEME}-dark\\.tokens\\.json`, 'g'),
        `${themeName}-dark.tokens.json`
      )
      .replace(
        /"name": "[^"]+"/,
        `"name": "${themeName[0].toUpperCase()}${themeName.slice(1)} Colors"`
      )

    await writeFile(targetResolverPath, content)
    log.success(
      `Created color resolver at ${log.path(path.relative(rootDir, targetResolverPath))}`
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    log.error(`Error creating color resolver: ${error.message}`)
    throw error
  }
}

async function main() {
  try {
    log.title('Welcome to the Unoff UI Theme Generator!')
    log.info(
      'This script will create a new theme based on the existing structure.'
    )

    const themeName = await askThemeName()
    log.step(`Creating new theme: ${log.highlight(themeName)}`)

    await ensureDirectories(themeName)
    await createTerrazzoFiles(themeName)
    await copyPlatformTokens(themeName)
    await fixCopiedTokenNamespace(themeName)
    await createColorResolver(themeName)
    await copyIconsFromFigma(themeName)
    await updateIconPaths(themeName)
    await updateScssImports(themeName)
    await updateStorybookPreview(themeName)
    await createThemeModuleFiles(themeName)
    await updateThemeStylesImports(themeName)

    log.success(
      `Theme "${log.highlight(themeName)}" has been successfully created!`
    )

    log.title('Next steps:')
    log.info(
      `1. Review the Terrazzo configuration files in ${log.path(`terrazzo/${themeName}/`)}`
    )
    log.info(
      `2. Review the Terrazzo component files in ${log.path(`terrazzo/${themeName}/components/`)}`
    )
    log.info(
      `3. Customize the token JSON files in ${log.path(`tokens/platforms/${themeName}/`)}`
    )
    log.info(
      `4. Customize the icons in ${log.path(`src/icons/${themeName}/`)} (copied from Figma theme, paths updated in icon.json)`
    )
    log.info(
      `5. Run ${log.path(`npm run scss:build theme=${themeName}`)} to build the theme tokens`
    )
    log.info(
      `6. Launch Storybook to preview your new theme with ${log.path('npm run storybook')}`
    )
    log.info(
      `7. If needed, customize the generated SCSS files in ${log.path('src/styles/tokens/')}`
    )
    log.info(
      `8. ${log.highlight(`@import 'styles/${themeName}'`)} statements have been added to all relevant SCSS files`
    )
    log.info(
      `9. Module files have been created at ${log.path(`src/styles/tokens/modules/${themeName}-types.module.scss`)} and ${log.path(`src/styles/tokens/modules/${themeName}-colors.module.scss`)}`
    )
    log.info(
      `10. Module imports have been added to ${log.path('.storybook/theme-styles.scss')}`
    )
  } catch (error) {
    log.error(
      `Error creating theme: ${error instanceof Error ? error.message : error}`
    )
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
