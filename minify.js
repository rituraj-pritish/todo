import fs from 'node:fs'
import zlib from 'node:zlib'
import { pipeline } from 'node:stream'

const BUILD_DIRECTORY = process.env.BUILD_DIRECTORY

fs.readdir(BUILD_DIRECTORY, {recursive: true}, (err, files) => {
  if(err) throw err

  const jsFile = files.find(
    name => name.includes('client') && name.includes('index') && name.includes('.js')
  )

  const gzip = zlib.createGzip({level: zlib.constants.Z_BEST_COMPRESSION});
  const source = fs.createReadStream(`${BUILD_DIRECTORY}/${jsFile}`);
  const destination = fs.createWriteStream(`${BUILD_DIRECTORY}/${jsFile}.gz`);

  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  });
})