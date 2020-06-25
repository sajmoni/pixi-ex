const jsdom = require('jsdom')
const { JSDOM } = jsdom

require('@babel/register')({
  extensions: ['.js', '.ts'],
  ignore: ['node_modules/*'],
})

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)
global.window = dom.window
global.document = dom.window.document
