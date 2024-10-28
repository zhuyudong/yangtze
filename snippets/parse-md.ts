/**
 * ./node_modules/.bin/ts-node snippets/parse-md.ts
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
  /^\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`%?？·a-zA-Z,，。：,.\d\s+-~～]+\]\s?(\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\])?\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\)([，（）\u4e00-\u9fa5\u3000-\u303Fa-zA-Z\d-,\s“”。]*)?/gi
// **C 语言教程：构建 Lisp 编译器**（[中文](https://ksco.gitbooks.io/build-your-own-lisp/)，[英文](http://www.buildyourownlisp.com/contents)）
const specialTitleReg =
  /^\*\*[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`%?？·a-zA-Z,，。：,.\d\s+-~～]+\*\*\s?（[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\)([，（）\u4e00-\u9fa5\u3000-\u303Fa-zA-Z\d-,\s“”。]*)?/gi
// **马达加斯加的猴面包树**
const boldTitleReg =
  /^\*\*[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`?？·a-zA-Z,，。：,.\d\s+-~～]+\*\*/gi
// const quotationTitleReg =
//   /^--\s+\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`?？·a-zA-Z,，。：,.\d\s+-~～]+\]\s?(\[[\u4e00-\u9fa5\u3000-\u303F《》()"“”%?？·a-zA-Z,，。：,.\d\s+-~～]+\])?\((https?:\/\/[a-zA-Z.-_\d/?@~+:&=%#]*)\)([，（）\u4e00-\u9fa5\u3000-\u303Fa-zA-Z\d-,\s“”。]*)?/gi
const quotationTitleReg =
  /^--\s+.*\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\)(.*)?/gi
// [加州大学伯克利分校](http://newsroom.haas.berkeley.edu/how-information-is-like-snacks-money-and-drugs-to-your-brain/)发现，信息跟金钱或食物一样，会刺激多巴胺的分泌。这就解释了，为什么人们会像迷恋美食一样，迷恋玩手机。
const linkTitleReg =
  /^(\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`%?？·a-zA-Z,，。：,.\d\s+-~～]+\]\s?\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\))(.*)$/

/**
 * 需要特殊处理的内容
 * [文章] Rust 的内存安全革命（[中译](http://szpzs.oschina.io/2018/04/28/rust-memory-safety-revolution/#more)、[原文](https://anixe.pl/content/news/rust_memory_safety_revolution)）
 */
function formatTitle(title: string) {
  if (title.startsWith('[] ')) {
    title = title.replace('[] ', '')
  }
  const mc = /(\[[\u4e00-\u9fa5\sa-zA-Z-_]*\]\s?)\[/.exec(title)
  /**
   * e.g.
   * [文章]\s
   * [PDF]\s
   * [代码仓库]\s
   * [GitHub 替代品]\s
   */
  if (mc?.[1]) {
    const l = mc?.[1].length
    title = `[【${title.slice(1, l - 2)}】${title.slice(l).split('](')[0].slice(1)}](${title.split('](')[1]}`
  }
  title = title.replace(/\\_\s?/g, '')
  title = title.replace(' 投稿）', '')
  title = title.replace(' 投稿)', '')
  return title
}

function removeComment(str: string) {
  return str
    .replace(/\\_\s?/g, '')
    .replace(/\\\*\s?/g, '')
    .replace(
      /（\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
      ''
    )
    .replace(
      /（@\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
      ''
    )
    .replace(
      /\(@\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿\)/g,
      ''
    )
    .replace(
      /\(\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿\)/g,
      ''
    )
    .replace(
      /（ \[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
      ''
    )
    .replace(
      /\(\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
      ''
    )
    .replace(
      /（@ \[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
      ''
    )
    .replace(
      /（作者@\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
      ''
    )
    .replace(
      /（[\u4e00-\u9fa5]+\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
      ''
    )
    .replace(
      /（[@a-zA-Z]+\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`@%?？·a-zA-Z,，。:：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?&=%#]*)\)\s*投稿）/g,
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
    if (filePath.includes('/quotations/')) {
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

        title = match[0].slice(3) // remove "--\s"
        if (match?.[1]?.startsWith('http')) {
          originHref = match[1]
        }
        if (match?.[2]?.startsWith('http')) {
          originHref = match[2]
        }
        content += `${line.replace(match[0], '')}\n`
        continue
      } else {
        content += `${line}\n`
      }
    } else {
      const match =
        titleReg.exec(line) ??
        specialTitleReg.exec(line) ??
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

        title = `[${matchLinkTitle[0].split('](')[0].slice(1)}${matchLinkTitle?.[3]}](${matchLinkTitle[2]})`

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

        title = match[0]
        if (match?.[1]?.startsWith('http')) {
          originHref = match[1]
        }
        if (match?.[2]?.startsWith('http')) {
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
await findMdxFiles().then(files => {
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
