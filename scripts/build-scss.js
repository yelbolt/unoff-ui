#!/usr/bin/env node
/**
 * Unified script to list and build Terrazzo SCSS files
 *
 * Usage:
 *
 * 1. List all Terrazzo files:
 *    npm run scss:list
 *
 * 2. Build all Terrazzo files:
 *    npm run scss:build
 *
 * 3. Build all files for a specific theme:
 *    npm run scss:build theme=sketch
 *
 * 4. Build a specific component for a theme:
 *    npm run scss:build theme=sketch component=button
 *
 * 5. Build a specific token type for a theme:
 *    npm run scss:build theme=sketch text
 *    npm run scss:build theme=sketch components
 *
 * 6. Build a specific token type for all themes:
 *    npm run scss:build mode
 *
 */
import { fileURLToPath } from 'url'
import process from 'process'
import path from 'path'
import { dirname } from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import chalk from 'chalk'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = path.join(__dirname, '..')

const args = process.argv.slice(2)
const BUILD_MODE = args.length > 0
let THEME = null
let COMPONENT = null
let TOKEN_TYPE = null

// Parse arguments
args.forEach((arg) => {
  if (arg.startsWith('theme=')) THEME = arg.split('=')[1]
  else if (arg.startsWith('component=')) COMPONENT = arg.split('=')[1]
  else if (arg === 'text') TOKEN_TYPE = 'text'
  else if (arg === 'icon') TOKEN_TYPE = 'icon'
  else if (arg === 'mode') TOKEN_TYPE = 'mode'
  else if (arg === 'color') TOKEN_TYPE = 'color'
  else if (arg === 'components') TOKEN_TYPE = 'components'
})

function findTerrazzoFiles(dir) {
  let results = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory())
      results = results.concat(findTerrazzoFiles(fullPath))
    else if (file.name.startsWith('terrazzo.') && file.name.endsWith('.js'))
      results.push(fullPath)
  }
  return results
}

function groupFilesByTheme(files) {
  return files.reduce((acc, file) => {
    const relativePath = file.replace(projectRoot, '')
    const pathParts = relativePath.split('/')
    const theme = pathParts.length > 3 ? pathParts[2] : 'commons'
    const isComponent = pathParts.includes('components')
    const componentName = isComponent
      ? path.basename(file, '.js').replace('terrazzo.', '')
      : path.basename(file, '.js').replace('terrazzo.', '')
    if (!acc[theme]) acc[theme] = { tokens: [], components: [] }
    if (isComponent)
      acc[theme].components.push({
        name: componentName,
        path: file,
        relativePath,
      })
    else
      acc[theme].tokens.push({ name: componentName, path: file, relativePath })
    return acc
  }, {})
}

async function buildTerrazzoFile(filePath) {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue(`\nBuilding ${filePath}...`))
    const child = spawn('npx', ['terrazzo', 'build', '-c', filePath], {
      stdio: 'inherit',
      shell: true,
      env: COMPONENT
        ? { ...process.env, TZ_COMPONENT: COMPONENT }
        : process.env,
    })
    child.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green(`✅ Successfully built ${filePath}`))
        resolve()
      } else {
        console.error(chalk.red(`❌ Failed to build ${filePath}`))
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

function displayTerrazzoFiles(groupedFiles) {
  console.log(chalk.bold.blue('\n=== AVAILABLE TERRAZZO FILES ===\n'))
  for (const [theme, files] of Object.entries(groupedFiles)) {
    console.log(chalk.bold.green(`\n## ${theme.toUpperCase()} ##\n`))
    if (files.tokens.length > 0) {
      console.log(chalk.bold.yellow('Tokens:'))
      files.tokens.forEach((file, index) => {
        console.log(
          `  ${index + 1}. ${chalk.cyan(file.name)}: ${chalk.dim(file.relativePath)}`
        )
      })
    }
    if (files.components.length > 0) {
      console.log(chalk.bold.yellow('\nComponents:'))
      files.components.forEach((file, index) => {
        console.log(
          `  ${index + 1}. ${chalk.cyan(file.name)}: ${chalk.dim(file.relativePath)}`
        )
      })
    }
  }
  console.log(chalk.bold.blue('\n=== AVAILABLE COMMANDS ===\n'))
  console.log(chalk.bold('List Terrazzo files:'))
  console.log(chalk.cyan('npm run scss:list\n'))
  console.log(chalk.bold('Build all Terrazzo files:'))
  console.log(chalk.cyan('npm run scss:build\n'))
  console.log(chalk.bold('Build all files for a specific theme:'))
  console.log(chalk.cyan('npm run scss:build theme=sketch\n'))
  console.log(chalk.bold('Build a specific component for a theme:'))
  console.log(chalk.cyan('npm run scss:build theme=sketch component=button\n'))
  console.log(chalk.bold('Build a specific component for all themes:'))
  console.log(chalk.cyan('npm run scss:build component=button\n'))
  console.log(chalk.bold('Build a specific token type for a theme:'))
  console.log(chalk.cyan('npm run scss:build theme=sketch text'))
  console.log(chalk.cyan('npm run scss:build theme=penpot mode'))
  console.log(
    chalk.cyan(
      'npm run scss:build theme=yelbolt color  # primitive ramps only, yelbolt-only\n'
    )
  )
  console.log(chalk.bold('Build a specific token type for all themes:'))
  console.log(chalk.cyan('npm run scss:build components'))
  console.log(chalk.cyan('npm run scss:build icon'))
  console.log(chalk.cyan('npm run scss:build mode'))
  console.log(chalk.cyan('npm run scss:build text\n'))
}

async function main() {
  try {
    const terrazzoDir = path.join(projectRoot, 'terrazzo')
    const terrazzoFiles = findTerrazzoFiles(terrazzoDir)
    const groupedFiles = groupFilesByTheme(terrazzoFiles)
    if (!BUILD_MODE) {
      displayTerrazzoFiles(groupedFiles)
      return
    }

    if (TOKEN_TYPE && !THEME) {
      const tokenDisplayName = TOKEN_TYPE
      console.log(
        chalk.blue(`\nBuilding ${tokenDisplayName} tokens for all themes...`)
      )
      let builtCount = 0

      for (const [theme, files] of Object.entries(groupedFiles)) {
        const tokenFile = files.tokens.find((t) => t.name === TOKEN_TYPE)
        if (tokenFile) {
          await buildTerrazzoFile(tokenFile.path)
          builtCount++
          console.log(
            chalk.green(
              `✅ Built ${tokenDisplayName} tokens for theme ${theme}`
            )
          )
        } else
          console.log(
            chalk.yellow(
              `⚠️  ${tokenDisplayName} tokens not found in theme ${theme}`
            )
          )
      }

      console.log(
        chalk.green(
          `\n✅ Successfully built ${tokenDisplayName} tokens for ${builtCount} theme(s)`
        )
      )
    } else if (COMPONENT && !THEME) {
      console.log(
        chalk.blue(`\nBuilding component ${COMPONENT} for all themes...`)
      )
      let builtCount = 0

      for (const [theme, files] of Object.entries(groupedFiles)) {
        const componentsFile = files.tokens.find((t) => t.name === 'components')
        if (componentsFile) {
          await buildTerrazzoFile(componentsFile.path)
          builtCount++
          console.log(
            chalk.green(`✅ Built component ${COMPONENT} for theme ${theme}`)
          )
        }
      }

      if (!builtCount) {
        console.error(chalk.red('No components config found in any theme.'))
        process.exit(1)
      }

      console.log(
        chalk.green(
          `\n✅ Successfully built component ${COMPONENT} for ${builtCount} theme(s)`
        )
      )
    } else if (THEME) {
      const themeFiles = groupedFiles[THEME]
      if (!themeFiles) {
        console.error(
          chalk.red(
            `Theme "${THEME}" not found. Available themes: ${Object.keys(groupedFiles).join(', ')}`
          )
        )
        process.exit(1)
      }
      if (TOKEN_TYPE) {
        const tokenDisplayName = TOKEN_TYPE
        const tokenFile = themeFiles.tokens.find((t) => t.name === TOKEN_TYPE)
        if (!tokenFile) {
          console.error(
            chalk.red(
              `Token type "${tokenDisplayName}" not found in theme "${THEME}". Available token types: ${themeFiles.tokens.map((t) => t.name).join(', ')}`
            )
          )
          process.exit(1)
        }
        await buildTerrazzoFile(tokenFile.path)
        console.log(
          chalk.green(
            `\n✅ Successfully built ${tokenDisplayName} tokens for theme ${THEME}`
          )
        )
      } else if (COMPONENT) {
        const componentsFile = themeFiles.tokens.find(
          (t) => t.name === 'components'
        )
        if (!componentsFile) {
          console.error(chalk.red(`Theme "${THEME}" has no components config.`))
          process.exit(1)
        }
        await buildTerrazzoFile(componentsFile.path)
        console.log(
          chalk.green(
            `\n✅ Successfully built component ${COMPONENT} for theme ${THEME}`
          )
        )
      } else {
        console.log(chalk.blue(`\nBuilding all files for theme ${THEME}...`))
        // First build tokens
        for (const tokenFile of themeFiles.tokens)
          await buildTerrazzoFile(tokenFile.path)
        // Then build components
        for (const componentFile of themeFiles.components)
          await buildTerrazzoFile(componentFile.path)
        console.log(
          chalk.green(`\n✅ Successfully built all files for theme ${THEME}`)
        )
      }
    } else
      for (const [theme, files] of Object.entries(groupedFiles)) {
        console.log(chalk.blue(`\nBuilding all files for theme ${theme}...`))
        // First build tokens
        for (const tokenFile of files.tokens)
          await buildTerrazzoFile(tokenFile.path)
        // Then build components
        for (const componentFile of files.components)
          await buildTerrazzoFile(componentFile.path)
        console.log(
          chalk.green(`\n✅ Successfully built all files for theme ${theme}`)
        )
      }
  } catch (error) {
    console.error(chalk.red('Error executing script:'), error)
    process.exit(1)
  }
}

main()
