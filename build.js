import fs from 'node:fs'
import { readdir } from 'node:fs/promises'
import zlib from 'node:zlib'
import stream from 'node:stream'
import esbuild from 'esbuild'
import { 
    BUILD_DIR, BUILD_PAGE_FILE, IS_DEVELOPMENT_ENVIRONMENT, LOADING_FILE, PAGE_FILE, VIEW_SRC 
} from './constants.js'

export const writeBuildDir = async () => {
    const files = await readdir(VIEW_SRC, {recursive: true})
    const entryPoints = files.filter(name => name.includes(PAGE_FILE))
        .map(path => `${VIEW_SRC}/${path}`)

    // index.jsx build
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
        .map(path => `${VIEW_SRC}/${path}`)

    await esbuild.build({
        entryPoints: loadingEntryPoints,
        outdir: BUILD_DIR,
        jsx: 'automatic',
        sourcemap: IS_DEVELOPMENT_ENVIRONMENT,
        jsxDev: IS_DEVELOPMENT_ENVIRONMENT,
        minify: !IS_DEVELOPMENT_ENVIRONMENT,
        treeShaking: true,
    })
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