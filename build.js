import fs from 'node:fs'
import { readdir, access, constants } from 'node:fs/promises'
import zlib from 'node:zlib'
import stream from 'node:stream'
import esbuild from 'esbuild'
import { exec } from 'node:child_process'

import { 
    BUILD_DIR, BUILD_PAGE_FILE, CSS_FILE, IS_DEVELOPMENT_ENVIRONMENT, LOADING_FILE, PAGE_FILE, SOURCE_DIR 
} from './constants.js'

export const writeBuildDir = async () => {
    const files = await readdir(SOURCE_DIR, {recursive: true})
    const entryPoints = files.filter(name => name.includes(PAGE_FILE))
        .map(path => `${SOURCE_DIR}/${path}`)

    // jsx build
    await esbuild.build({
        entryPoints,
        outdir: BUILD_DIR,
        bundle: true,
        jsx: 'automatic',
        sourcemap: IS_DEVELOPMENT_ENVIRONMENT,
        jsxDev: IS_DEVELOPMENT_ENVIRONMENT,
        minify: !IS_DEVELOPMENT_ENVIRONMENT,
        treeShaking: true,
    })

    const loadingEntryPoints = files.filter(name => name.includes(LOADING_FILE))
        .map(path => `${SOURCE_DIR}/${path}`)

    await esbuild.build({
        entryPoints: loadingEntryPoints,
        outdir: BUILD_DIR,
        jsx: 'automatic',
        sourcemap: IS_DEVELOPMENT_ENVIRONMENT,
        jsxDev: IS_DEVELOPMENT_ENVIRONMENT,
        minify: !IS_DEVELOPMENT_ENVIRONMENT,
        treeShaking: true,
    })

    // todo
    // build index css for every loading file, if exists
    // else
    // build for page file

    // css build
    const cssEntryPoints = files.filter(name => name.includes(CSS_FILE))
        .map(path => `${SOURCE_DIR}/${path}`)

    for(const entryFile of cssEntryPoints) {
        try {
            await access(entryFile, constants.F_OK)
            exec(`npx @tailwindcss/cli -i ${entryFile} -o ${entryFile.replace('src/', 'dist/')}`)
        } catch (error) {
            
        }
    }
}

if(!IS_DEVELOPMENT_ENVIRONMENT) {
    const gzip = zlib.createGzip({level: zlib.constants.Z_BEST_COMPRESSION});
    const source = fs.createReadStream(`${BUILD_DIR}/${BUILD_PAGE_FILE}`);
    const destination = fs.createWriteStream(`${BUILD_DIR}/${BUILD_PAGE_FILE}.gz`);

    stream.pipeline(source, gzip, destination, (err) => {
        if (err) {
            console.error('An error occurred while creating zip file', err);
            process.exitCode = 1;
        }
    });
}