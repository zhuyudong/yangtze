/**
 * ./node_modules/.bin/ts-node scripts/structuring-md.ts
 */
import fg from 'fast-glob'
import fs from 'fs'

const directory = `${process.cwd()}/src/app/[locale]/(unauth)/weekly-by-category`

const findMdxFiles = async () => {
  try {
    const files = await fg('**/_page.mdx', {
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
  /^\[[\u4e00-\u9fa5\u3000-\u303Fa-zA-Z,，。：,.\d\s+-]+\]\s?(\[[\u4e00-\u9fa5\u3000-\u303Fa-zA-Z,，。：,.\d\s+-]+\])?\((https?:\/\/.*)\)(（[中英文]*）)?/gi
// **C 语言教程：构建 Lisp 编译器**（[中文](https://ksco.gitbooks.io/build-your-own-lisp/)，[英文](http://www.buildyourownlisp.com/contents)）
const titleSpecialReg =
  /^\*\*[\u4e00-\u9fa5\u3000-\u303Fa-zA-Z,，。：,.\d\s+-]+\*\*\s?（[[\u4e00-\u9fa5\u3000-\u303Fa-zA-Z,，。：,.\d\s+-]+\]\((https?:\/\/.*)\)(（[中英文]*）)?/gi

const readMdxFile = (filePath: string, category: string) => {
  const data = fs.readFileSync(filePath, 'utf8')
  const lines = data.split('\n')
  const result = []

  let title = ''
  let content = ''
  let originHref = ''

  for (const line of lines) {
    const match = titleReg.exec(line) || titleSpecialReg.exec(line)
    if (match) {
      if (title !== '') {
        result.push({ title, content, category, originHref })
        content = ''
      }
      // eslint-disable-next-line prefer-destructuring
      title = match[0]
      // eslint-disable-next-line prefer-destructuring
      originHref = match[1]!
      content += `${line.replace(match[0], '')}\n`
    } else {
      content += `${line}\n`
    }
  }

  if (title !== '') {
    result.push({ title, content, category, originHref })
  }

  return result
}

const checkFileExists = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true
  } catch (err) {
    return false
  }
}

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
    if (!checkFileExists(`${process.cwd()}/prisma/${category}.json`)) {
      const resultArray = readMdxFile(
        file,
        categories[category as keyof typeof categories]
      )
      fs.writeFileSync(
        `${process.cwd()}/prisma/${category}.json`,
        JSON.stringify(resultArray, null, 2),
        'utf8'
      )
      console.log(`Structured ${category}.json`)
    }
  })
})
