/**
 * ./node_modules/.bin/ts-node scripts/parse-md.ts
 */
import fg from 'fast-glob'
import fs from 'fs'

const directory = `${process.cwd()}/src/app/[locale]/(unauth)/weekly-by-category`

const findMdxFiles = async () => {
  try {
    const files = await fg('**/*/_page.mdx', {
      cwd: directory,
      absolute: true
    })
    return files
  } catch (error) {
    console.error('Error finding _page.mdx files:', error)
    return []
  }
}

/**
 * match title
 * [C 语言学习资料](http://www.isthe.com/chongo/tech/comp/c/index.html)
 * [电子书] [应用加密法的研究生教材](http://toc.cryptobook.us/)（英文）
 * [vue-unit-test-with-jest](https://github.com/holylovelqq/vue-unit-test-with-jest)
 * [学习现代 C++](https://learnmoderncpp.com/)
 */
const titleReg =
  /^\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\]\s?(\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\])?\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\)([，（）\u4e00-\u9fa5\u3000-\u303Fa-zA-Z\d-,\s“”。]*)?/gi
// **C 语言教程：构建 Lisp 编译器**（[中文](https://ksco.gitbooks.io/build-your-own-lisp/)，[英文](http://www.buildyourownlisp.com/contents)）
const specialTitleReg =
  /^\*\*[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\*\*\s?（[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\)([，（）\u4e00-\u9fa5\u3000-\u303Fa-zA-Z\d-,\s“”。]*)?/gi
// **马达加斯加的猴面包树**
const boldTitleReg =
  /^\*\*[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”?？·a-zA-Z,，。：,.\d\s+-~～]+\*\*/gi
// const quotationTitleReg =
//   /^--\s+\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”?？·a-zA-Z,，。：,.\d\s+-~～]+\]\s?(\[[\u4e00-\u9fa5\u3000-\u303F《》()"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\])?\((https?:\/\/[a-zA-Z.-_\d/?@~+:&=%#]*)\)([，（）\u4e00-\u9fa5\u3000-\u303Fa-zA-Z\d-,\s“”。]*)?/gi
const quotationTitleReg =
  /^--\s+.*\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\)(.*)?/gi

function replaceSubmit(str: string) {
  return str
    .replace(
      /(（|\()?@?\s*\[[\u4e00-\u9fa5a-zA-Z\d@\s-_]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)[\\*\s_]*\s*(投稿)?(）|\))?\n?/g,
      ''
    )
    .replace(/@[\u4e00-\u9fa5a-zA-Z\d]+\s*投稿/g, '')
}

const readMdxFile = (filePath: string, category: string) => {
  const data = fs.readFileSync(filePath, 'utf8')
  const lines = data.split('\n')
  const result = []

  let title = ''
  let content = ''
  let originHref = ''
  let weekly!: number

  for (let line of lines) {
    // 1[Pixar 公司是如何成立的？](https://spectrum.ieee.org/the-real-story-of-pixar)（英文） ->
    // [Pixar 公司是如何成立的？](https://spectrum.ieee.org/the-real-story-of-pixar)（英文）
    line = line.replace(/^\d+\[/, '[')
    if (/===(\d+)===/.exec(line)) {
      weekly = Number(/===(\d+)===/.exec(line)?.[1])
    }
    if (filePath.indexOf('/quotations/') !== -1) {
      const match = quotationTitleReg.exec(line)
      if (match) {
        if (title !== '') {
          result.push({
            title,
            content: replaceSubmit(content),
            category,
            originHref,
            weekly
          })
          content = ''
        }
        // eslint-disable-next-line prefer-destructuring
        title = match[0].slice(3) // remove "--\s"
        if (match?.[1] && match[1].startsWith('http')) {
          // eslint-disable-next-line prefer-destructuring
          originHref = match[1]
        }
        if (match?.[2] && match[2].startsWith('http')) {
          // eslint-disable-next-line prefer-destructuring
          originHref = match[2]
        }
        content += `${line.replace(match[0], '')}\n`
        continue
      } else {
        content += `${line}\n`
      }
    } else {
      const match =
        titleReg.exec(line) ||
        specialTitleReg.exec(line) ||
        boldTitleReg.exec(line)
      if (match) {
        if (title !== '') {
          result.push({
            title,
            content: replaceSubmit(content).replace(/===\d+===/g, ''),
            category,
            originHref,
            weekly
          })
          content = ''
        }
        // eslint-disable-next-line prefer-destructuring
        title = match[0]
        if (match?.[1] && match[1].startsWith('http')) {
          // eslint-disable-next-line prefer-destructuring
          originHref = match[1]
        }
        if (match?.[2] && match[2].startsWith('http')) {
          // eslint-disable-next-line prefer-destructuring
          originHref = match[2]
        }
        content += `${line.replace(match[0], '')}\n`
      } else {
        content += `${line}\n`
      }
    }
  }

  if (title !== '') {
    result.push({
      title,
      content: replaceSubmit(content).replace(/===\d+===/g, ''),
      category,
      originHref,
      weekly
    })
  }

  return result
}

// const checkFileExists = (filePath: string): boolean => {
//   try {
//     fs.accessSync(filePath, fs.constants.F_OK)
//     return true
//   } catch (err) {
//     return false
//   }
// }

const categories = {
  'articles': 'article',
  'excerpts': 'excerpt',
  'news': 'new',
  'photos': 'photo',
  'resources': 'resource',
  'quotations': 'quotation',
  'technology-news': 'technology-new',
  'tools': 'tool'
}
console.log('Start structuring mdx files ...')
findMdxFiles().then(files => {
  files.forEach(file => {
    // /src/app/[locale]/(unauth)/weekly-by-category/articles/_page.mdx' -> articles
    const rest = file.split('/')
    const category = rest[rest.length - 2]
    // if (!checkFileExists(`${process.cwd()}/prisma/${category}.json`)) {
    const resultArray = readMdxFile(
      file,
      categories[category as keyof typeof categories]
    )
    fs.writeFileSync(
      `${process.cwd()}/prisma/${category}.json`,
      JSON.stringify(resultArray, null, 2),
      'utf8'
    )
    console.log(`Generated ${category}.json`)
    // }
  })
})
