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
// [加州大学伯克利分校](http://newsroom.haas.berkeley.edu/how-information-is-like-snacks-money-and-drugs-to-your-brain/)发现，信息跟金钱或食物一样，会刺激多巴胺的分泌。这就解释了，为什么人们会像迷恋美食一样，迷恋玩手机。
const linkTitleReg =
  /^(\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\]\s?\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\))(.*)$/

function formatTitle(title: string) {
  if (
    title.startsWith('[文章] ') ||
    title.startsWith('[游戏] ') ||
    title.startsWith('[图片] ') ||
    title.startsWith('[视频] ') ||
    title.startsWith('[仓库] ') ||
    title.startsWith('[课程] ') ||
    title.startsWith('[网站] ') ||
    title.startsWith('[资料] ') ||
    title.startsWith('[代码] ') ||
    title.startsWith('[笔记] ')
  ) {
    title = `[【${title.slice(1, 3)}】${title.slice(5).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  if (title.startsWith('[笔记][')) {
    title = `[【${title.slice(1, 3)}】${title.slice(4).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  if (title.startsWith('[电子书] ') || title.startsWith('[PDF] ')) {
    title = `[【${title.slice(1, 4)}】${title.slice(6).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  if (
    title.startsWith('[代码仓库] ') ||
    title.startsWith('[邮件列表] ') ||
    title.startsWith('[免费视频] ') ||
    title.startsWith('[视频课程] ')
  ) {
    title = `[【${title.slice(1, 5)}】${title.slice(7).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  if (title.startsWith('[免费电子书] ')) {
    title = `[【${title.slice(1, 6)}】${title.slice(8).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  if (title.startsWith('[机器人数据库] ')) {
    title = `[【${title.slice(1, 7)}】${title.slice(9).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  if (title.startsWith('[GitHub 替代品] ')) {
    title = `[【${title.slice(1, 11)}】${title.slice(13).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  if (title.startsWith('[] ')) {
    title = title.replace('[] ', '')
  }
  return title
}

function removeComment(str: string) {
  return str
    .replace(
      /(（|\()?@?\s*\[[\u4e00-\u9fa5a-zA-Z\d@\s-_]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)[\\*\s_]*\s*(投稿)?(）|\))?\n?/g,
      ''
    )
    .replace(/@[\u4e00-\u9fa5a-zA-Z\d]+\s*投稿/g, '')
    .replace(/===\d+===/g, '')
}

// /^(\[[\u4e00-\u9fa5a-zA-Z\d@\s-_]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\))(.*)$/
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
    // '\n1、\n' -> \n\n
    line = line.replace(/^(\n)*\d+、(\n)*$/, '$1$2')
    line = line.replace(/\n{4}/, '\n\n')
    // line = line.replace(/\n{2}/, '\n')
    line = line.replace(/\n{3}/, '\n')
    if (/===(\d+)===/.exec(line)) {
      weekly = Number(/===(\d+)===/.exec(line)?.[1])
    }
    if (filePath.indexOf('/quotations/') !== -1) {
      const match = quotationTitleReg.exec(line)
      if (match) {
        if (title !== '') {
          result.push({
            title: formatTitle(title),
            content: removeComment(content),
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
      const matchLinkTitle = linkTitleReg.exec(line)
      if (
        matchLinkTitle &&
        matchLinkTitle?.[2].startsWith('http') &&
        matchLinkTitle?.[3]
      ) {
        if (title !== '') {
          result.push({
            title: formatTitle(title),
            content: removeComment(content),
            category,
            originHref,
            weekly
          })
          content = ''
        }
        // [加州大学伯克利分校](http://newsroom.haas.berkeley.edu/how-information-is-like-snacks-money-and-drugs-to-your-brain/)发现，信息跟金钱或食物一样，会刺激多巴胺的分泌。这就解释了，为什么人们会像迷恋美食一样，迷恋玩手机。
        // [加州大学伯克利分校发现，信息跟金钱或食物一样，会刺激多巴胺的分泌。这就解释了，为什么人们会像迷恋美食一样，迷恋玩手机。](http://newsroom.haas.berkeley.edu/how-information-is-like-snacks-money-and-drugs-to-your-brain/)
        // eslint-disable-next-line prefer-destructuring
        title = `[${matchLinkTitle[0].split('](')[0].slice(1)}${matchLinkTitle?.[3]}](${matchLinkTitle[2]})`
        // eslint-disable-next-line prefer-destructuring
        originHref = matchLinkTitle[2]
        content += `\n` // `${matchLinkTitle?.[3]}\n`
      } else if (match) {
        if (title !== '') {
          result.push({
            title: formatTitle(title),
            content: removeComment(content),
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
      title: formatTitle(title),
      content: removeComment(content),
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
