import fs from 'node:fs'
import zlib from 'node:zlib'
import stream from 'node:stream'
import esbuild from 'esbuild'
import { BUILD_DIR, BUILD_PAGE_FILE, IS_DEVELOPMENT_ENVIRONMENT } from './constants.js'

await esbuild.build({
    entryPoints: ['src/loading.jsx'],
    outfile: 'dist/loading.js',
    jsx: 'automatic',
    jsxDev: IS_DEVELOPMENT_ENVIRONMENT,
    minify: !IS_DEVELOPMENT_ENVIRONMENT,
    treeShaking: true,
})

await esbuild.build({
    entryPoints: ['src/view.jsx'],
    bundle: true,
    outfile: 'dist/view.js',
    jsx: 'automatic',
    sourcemap: IS_DEVELOPMENT_ENVIRONMENT,
    jsxDev: IS_DEVELOPMENT_ENVIRONMENT,
    minify: !IS_DEVELOPMENT_ENVIRONMENT,
    treeShaking: true,
})

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