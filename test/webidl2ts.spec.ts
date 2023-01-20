import fs from 'fs'
import * as path from 'path'

import test from 'ava'

import { convertIDL, parseIDL, printEmscriptenModule, printTs, Options, fetchIDL } from '../src'
import { defaultPreprocessor } from '../src/fixes'

const testCases: { title: string; options: Options }[] = [
  {
    title: 'should work in default mode',
    options: {
      emscripten: false,
      defaultExport: false,
      gecko: false,
      module: 'Module',
      input: path.join(__dirname, 'test.idl'),
      output: path.join(__dirname, 'default.d.ts'),
    },
  },
  {
    title: 'should work in emscripten mode',
    options: {
      emscripten: true,
      defaultExport: false,
      gecko: false,
      module: 'Module',
      input: path.join(__dirname, 'test.idl'),
      output: path.join(__dirname, 'emscripten.d.ts'),
    },
  },
  {
    title: 'should work for gecko idl - nsICommandLine',
    options: {
      emscripten: false,
      defaultExport: false,
      gecko: true,
      module: 'Module',
      input: path.join(__dirname, 'nsICommandLine.idl'),
      output: path.join(__dirname, 'nsICommandLine.d.ts'),
    },
  },
  {
    title: 'should work for gecko idl - nsIPrefBranch',
    options: {
      emscripten: false,
      defaultExport: false,
      gecko: true,
      module: 'Module',
      input: path.join(__dirname, 'nsIPrefBranch.idl'),
      output: path.join(__dirname, 'nsICommandLine.d.ts'),
    },
  },
]

testCases.forEach(({ title, options }) => {
  test(title, async (t) => {
    const idlString = await fetchIDL(options.input)
    const idl = await parseIDL(idlString, {
      preprocess: (idl) => defaultPreprocessor(idl, options),
    })
    const ts = convertIDL(idl, options)
    const actual = options.emscripten ? printEmscriptenModule(options.module, ts, options.defaultExport).trim() : printTs(ts).trim()
    const expected = fs.readFileSync(options.output).toString().trim()
    t.is(actual, expected)
  })
})
