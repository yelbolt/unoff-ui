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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

// Directories
const TERRAZZO_DIR = path.join(rootDir, 'terrazzo')
const TOKENS_PLATFORMS_DIR = path.join(rootDir, 'tokens', 'platforms')

// Source theme to copy from - using figma for everything
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
    // Create tokens platform directory if it doesn't exist
    if (!fs.existsSync(tokenDir)) {
      await mkdir(tokenDir, { recursive: true })
      log.success(
        `Created tokens platform directory for ${log.highlight(themeName)}`
      )
    }

    // Create terrazzo directory if it doesn't exist
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
    // Read the preview file
    let previewContent = await readFile(previewPath, 'utf8')

    // 1. Add the new theme to the toolbar items list
    const themesItemsRegex = /(items: \[.*?'sketch'.*?)(\],)/
    const updatedThemesItems = `$1, '${themeName}'$2`
    previewContent = previewContent.replace(
      themesItemsRegex,
      updatedThemesItems
    )

    // 2. Add the light and dark modes for the new theme with proper indentation
    const modesItemsRegex = new RegExp(
      `(items: \\[\\s*.*?'${SOURCE_COLOR_THEME}-dark',\\s*)`,
      's'
    )
    const updatedModesItems = `$1  '${themeName}-light',\n          '${themeName}-dark',\n        `
    previewContent = previewContent.replace(modesItemsRegex, updatedModesItems)

    // 3. Add background colors for the new theme modes with proper indentation
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
  // List of all possible theme names to replace
  const existingThemes = ['figma', 'penpot', 'sketch']

  let updatedContent = content

  // Replace all patterns for each theme
  for (const oldTheme of existingThemes)
    updatedContent = updatedContent
      .replace(
        new RegExp(`\\b${oldTheme}-light\\b`, 'g'),
        `${newThemeName}-light`
      )
      .replace(new RegExp(`\\b${oldTheme}-dark\\b`, 'g'), `${newThemeName}-dark`)
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
    // Create the target directory if it doesn't exist
    if (!fs.existsSync(targetTerrazzoDir)) {
      await mkdir(targetTerrazzoDir, { recursive: true })
      log.success(`Created Terrazzo directory for ${log.highlight(themeName)}`)
    }

    // Create the components directory if needed
    const targetComponentsDir = path.join(targetTerrazzoDir, 'components')
    if (!fs.existsSync(targetComponentsDir)) {
      await mkdir(targetComponentsDir, { recursive: true })
      log.success(
        `Created Terrazzo components directory for ${log.highlight(themeName)}`
      )
    }

    // Process root Terrazzo configuration files
    const terrazzFiles = await readdir(sourceTerrazzoDir)

    for (const file of terrazzFiles) {
      const sourceFilePath = path.join(sourceTerrazzoDir, file)
      const targetFilePath = path.join(targetTerrazzoDir, file)

      // Only copy files (not directories) that are JavaScript files
      if (fs.statSync(sourceFilePath).isFile() && file.endsWith('.js')) {
        // Read the source file content
        let content = await readFile(sourceFilePath, 'utf8')

        // Replace all theme names with the new theme name
        content = replaceAllThemeNames(content, themeName)

        // For text and colors terrazzo files, ensure icon.json is included but icon tokens are excluded
        if (file === 'terrazzo.colors.js' || file === 'terrazzo.text.js')
          if (!content.includes(`./tokens/platforms/${themeName}/icon.json`))
            // Check if icon.json is already included in the tokens array
            // Add icon.json to the tokens array
            content = content.replace(
              /tokens: \[([\s\S]*?)\]/,
              (match, tokensContent) => {
                return `tokens: [${tokensContent}${tokensContent.endsWith(',') ? '' : ','}\n    './tokens/platforms/${themeName}/icon.json',\n  ]`
              }
            )

        // Write the updated content to the target file
        await writeFile(targetFilePath, content)
        log.step(
          `Created Terrazzo configuration file: ${log.path(path.relative(rootDir, targetFilePath))}`
        )
      }
    }

    // Process component Terrazzo configuration files
    const sourceComponentsDir = path.join(sourceTerrazzoDir, 'components')

    if (fs.existsSync(sourceComponentsDir)) {
      const componentFiles = await readdir(sourceComponentsDir)

      for (const file of componentFiles) {
        const sourceFilePath = path.join(sourceComponentsDir, file)
        const targetFilePath = path.join(targetComponentsDir, file)

        // Only copy files that are JavaScript files
        if (fs.statSync(sourceFilePath).isFile() && file.endsWith('.js')) {
          // Read the source file content
          let content = await readFile(sourceFilePath, 'utf8')

          // Replace all theme names with the new theme name
          content = replaceAllThemeNames(content, themeName)

          // Write the updated content to the target file
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
    // Define paths to look for SCSS files
    const stylesDir = path.join(rootDir, 'src', 'styles')
    const componentDir = path.join(rootDir, 'src', 'components')

    // Process files in src/styles
    await processStylesDirectory(stylesDir, themeName)

    // Process files in src/components recursively
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
    // Process each subdirectory in styles (tokens, icons, texts, etc.)
    const entries = await readdir(stylesDir, { withFileTypes: true })

    for (const entry of entries)
      if (entry.isDirectory()) {
        const dirPath = path.join(stylesDir, entry.name)
        const files = await readdir(dirPath)

        // Process each .scss file in the directory
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
        // Check for styles directory or .scss files
        const subEntries = await readdir(fullPath)

        // Check if this component has a styles directory
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

        // Check for scss files directly in the component directory
        for (const file of subEntries)
          if (file.endsWith('.scss')) {
            const filePath = path.join(fullPath, file)
            await updateImportsInFile(filePath, themeName)
          }

        // Recurse into subdirectories
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
    // Read file content
    const content = await readFile(filePath, 'utf8')

    // Check if the file has an import for the source theme
    const sourceImportRegex = new RegExp(
      `@import ['"](styles/)?${SOURCE_COLOR_THEME}['"];`,
      'g'
    )

    if (sourceImportRegex.test(content)) {
      // This file already imports the source theme
      // Check if it already imports the new theme as well
      const newThemeImportRegex = new RegExp(
        `@import ['"](styles/)?${themeName}['"];`,
        'g'
      )

      if (!newThemeImportRegex.test(content)) {
        // Add import for the new theme after the source theme import
        const updatedContent = content.replace(sourceImportRegex, (match) => {
          return `${match}\n@import ${match.includes('styles/') ? `'styles/${themeName}'` : `'${themeName}'`};`
        })

        // Write the updated content back to the file
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
    // Ensure the modules directory exists
    if (!fs.existsSync(tokensModulesDir)) {
      await mkdir(tokensModulesDir, { recursive: true })
      log.success(`Created tokens modules directory`)
    }

    // Create the types module file
    const typesContent = `@import '../${themeName}-types.scss';
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

:export {
  module: '${themeName}-types';
}
`
    await writeFile(typesModulePath, typesContent)
    log.success(
      `Created ${log.highlight(themeName)} types module at ${log.path(path.relative(rootDir, typesModulePath))}`
    )

    // Create the colors module file
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
    // Check if theme-styles.scss exists
    if (!fs.existsSync(themeStylesPath)) {
      log.warn(
        `${log.path('.storybook/theme-styles.scss')} does not exist. Creating it with initial imports.`
      )

      // Create initial theme-styles.scss with imports for the new theme
      const initialContent = `@import '../src/styles/tokens/modules/${themeName}-colors.module.scss';\n@import '../src/styles/tokens/modules/${themeName}-types.module.scss';\n`
      await writeFile(themeStylesPath, initialContent)
      log.success(
        `Created ${log.path('.storybook/theme-styles.scss')} with ${log.highlight(themeName)} imports`
      )
      return
    }

    // Read the current content of theme-styles.scss
    const themeStylesContent = await readFile(themeStylesPath, 'utf8')

    // Check if the imports for this theme are already present
    if (themeStylesContent.includes(`${themeName}-colors.module.scss`)) {
      log.info(
        `Imports for ${log.highlight(themeName)} already exist in theme-styles.scss`
      )
      return
    }

    // Look for the last import statement to add our imports after it
    const lastImportIndex = themeStylesContent.lastIndexOf('@import')
    if (lastImportIndex === -1)
      throw new Error(
        'Could not find any @import statements in theme-styles.scss'
      )

    // Find the end of the last import statement (the line ending)
    const endOfLastImport = themeStylesContent.indexOf(';', lastImportIndex) + 1

    // Create the new import statements for the new theme
    const newImports = `

@import '../src/styles/tokens/modules/${themeName}-colors.module.scss';
@import '../src/styles/tokens/modules/${themeName}-types.module.scss';`

    // Insert the new imports after the last import statement
    const updatedContent =
      themeStylesContent.slice(0, endOfLastImport) +
      newImports +
      themeStylesContent.slice(endOfLastImport)

    // Write the updated content back to the file
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
    // Check if source icons directory exists
    if (!fs.existsSync(sourceIconsDir)) {
      log.warn(
        `Source icons directory ${log.path(sourceIconsDir)} does not exist. Skipping icons copy.`
      )
      return
    }

    // Create the target directory if it doesn't exist
    if (!fs.existsSync(targetIconsDir)) {
      await mkdir(targetIconsDir, { recursive: true })
      log.success(`Created icons directory for ${log.highlight(themeName)}`)
    }

    // Copy all SVG files from the source icons directory
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
    // Check if icon.json exists
    if (!fs.existsSync(iconJsonPath)) {
      log.warn(
        `Icon JSON file ${log.path(iconJsonPath)} does not exist. Skipping icon paths update.`
      )
      return
    }

    // Read the icon.json file
    let iconContent = await readFile(iconJsonPath, 'utf8')

    // Replace all icon paths from source theme to new theme
    const sourceIconPath = `/src/icons/${SOURCE_COLOR_THEME}/`
    const targetIconPath = `/src/icons/${themeName}/`

    iconContent = iconContent.replace(
      new RegExp(sourceIconPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      targetIconPath
    )

    // Write the updated content back to the file
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
    // Create the target directory if it doesn't exist
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
          // Create directory and recurse into it
          if (!fs.existsSync(targetPath))
            await mkdir(targetPath, { recursive: true })

          await copyFilesRecursively(sourcePath, targetPath)
        } else if (entry.isFile()) {
          // Copy the file
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

async function main() {
  try {
    log.title('Welcome to the Unoff UI Theme Generator!')
    log.info(
      'This script will create a new theme based on the existing structure.'
    )

    const themeName = await askThemeName()
    log.step(`Creating new theme: ${log.highlight(themeName)}`)

    // Execute only necessary tasks (tokens JSON and Terrazzo configs)
    await ensureDirectories(themeName)
    await createTerrazzoFiles(themeName)
    await copyPlatformTokens(themeName)
    await copyIconsFromFigma(themeName)
    await updateIconPaths(themeName)
    await updateScssImports(themeName)
    await updateStorybookPreview(themeName)
    await createThemeModuleFiles(themeName)
    await updateThemeStylesImports(themeName)
    // SCSS files will be generated from tokens using the build-scss.js script

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
