import fs from 'node:fs'
import { access, constants } from 'node:fs/promises'
import zlib from 'node:zlib'
import stream from 'node:stream'
import esbuild from 'esbuild'
import { exec } from 'node:child_process'

import { 
  BUILD_DIR, CSS_FILE, IS_DEVELOPMENT_ENVIRONMENT, PAGE_FILE, SOURCE_DIR 
} from './constants.js'

export const serveBuildDir = async () => {
  // in production
  // lint before build
  exec(`npx eslint ${SOURCE_DIR}`, (_, stdout) => {
    process.stdin.write(stdout)
  })

  // jsx build
  await esbuild.build({
    entryPoints: [`${SOURCE_DIR}/${PAGE_FILE}`],
    outdir: BUILD_DIR,
    bundle: true,
    jsx: 'automatic',
    sourcemap: IS_DEVELOPMENT_ENVIRONMENT,
    jsxDev: IS_DEVELOPMENT_ENVIRONMENT,
    minify: !IS_DEVELOPMENT_ENVIRONMENT,
    treeShaking: true,
  })

  const entryFilePath = `${SOURCE_DIR}/${CSS_FILE}`
  // css build
  try {
    await access(entryFilePath, constants.F_OK)
    exec(`npx @tailwindcss/cli -i ${entryFilePath} -o ${entryFilePath.replace('src/', 'dist/')}`)
  } catch {
    // no corresponding css file
  }
}

if(!IS_DEVELOPMENT_ENVIRONMENT) {
  const gzip = zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });
  const source = fs.createReadStream(`${BUILD_DIR}/${PAGE_FILE}`);
  const destination = fs.createWriteStream(`${BUILD_DIR}/${PAGE_FILE}.gz`);

  stream.pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred while creating zip file', err);
      process.exitCode = 1;
    }
  });
}