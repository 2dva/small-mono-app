// type TreeNode = {
//   val: string
//   nodes?: TreeNode[]
// }

// type RootNode = {
//   nodes: TreeNode[]
// } & TreeNode

// /**
//  * Быстрая валидация строки дерева
//  *
//  * @param {string} s - строковое представление дерева
//  * @returns {boolean} валидно или нет
//  */
// export function validateTree(s: string): boolean {
//   s = s.trim()

//   if (s === '') throw Error('Tree input is empty')
//   if (!s.match(/^[() \d]+$/)) throw Error('Tree input contains invalid symbols')
//   if (!s.match(/^\(.+\)$/)) throw Error('Tree input should be wrapped with brackets')

//   return true
// }

// /**
//  * Преобразуем строку в объект дерева
//  *
//  * @param stringTree - строковое представление дерева
//  * @returns {RootNode} - объект дерева
//  */
// export function parseTree(stringTree: string): RootNode {
//   function parsePart() {
//     if (stringTree[0] !== '(') throw Error('Failed to parse tree: missing opening bracket')

//     const nodes = []
//     let curNode: TreeNode | undefined
//     // удаляем ведущую скобку "("
//     stringTree = stringTree.substring(1).trim()
//     // итеративно обрабатываем строку
//     do {
//       // обрабатываем открывающую скобку
//       if (stringTree[0] === '(') {
//         // рекурсивно обработаем вложенные ноды
//         if (curNode) curNode.nodes = parsePart()
//       }
//       // обрабатываем число
//       const intVal = parseInt(stringTree)
//       if (!isNaN(intVal)) {
//         const val = String(intVal)
//         curNode = { val }
//         nodes.push(curNode)
//         stringTree = stringTree.substring(val.length).trim()
//         continue
//       }
//       // обрабатываем закрывающую скобку
//       if (stringTree[0] === ')') {
//         stringTree = stringTree.substring(1).trim()
//         break
//       }
//       throw Error('Failed to parse tree: missing closing brackets')
//     } while (stringTree)

//     return nodes
//   }

//   // Возможно, добавить проверку на лишние закрывающие скобки? Пока просто игнорируем
//   return {
//     val: '',
//     nodes: parsePart(),
//   }
// }

// /**
//  * Сгенерит строку для ноды
//  *
//  * @param {string} prefix - начало строки
//  * @param {number} tabLength - размер отступа
//  * @param {TreeNode} node - нода
//  * @returns {string} html строка ноды
//  */
// function generateLineHTML(prefix: string, tabLength: number, node: TreeNode) {
//   let line = prefix + node.val
//   if (node.nodes) {
//     line += '-'.repeat(tabLength - node.val.length + 1) + '+'
//   }
//   return line
// }

// /**
//  * Рекурсивно генерим html веток дерева
//  *
//  * @param {TreeNode[]} nodes - массив эл-ов ветки
//  * @param {string} trace - начало строки вывода
//  * @returns {string} html для вывода на страницу
//  */
// function generateBranchHTML(nodes: TreeNode[], trace: string) {
//   const maxNumberLength = nodes.reduce((acc: number, v: TreeNode) => Math.max(v.val.length, acc), 0)
//   const l = nodes.length
//   const tabLength = maxNumberLength + 2
//   const tabSpaces = ' '.repeat(tabLength)
//   let lines: string[] = []

//   for (let i = 0; i < l; i++) {
//     const node = nodes[i]
//     // рисуем текущую ноду
//     lines.push(generateLineHTML(trace, tabLength, node))
//     if (node.nodes) {
//       // рисуем вложенные ноды
//       const delimiter = i < l - 1 ? '|' : ' '
//       lines = lines.concat(generateBranchHTML(node.nodes, trace + delimiter + tabSpaces))
//     }
//   }
//   return lines
// }

// /**
//  * Генерим html для дерева
//  *
//  * @param {RootNode} root
//  * @returns {string} html дерева для вывода
//  */
// export function generateTreeHTML(root: RootNode) {
//   const defaultSpace = ' '.repeat(4)
//   const lines = generateBranchHTML(root.nodes, defaultSpace)
//   return lines.join('<br />')
// }

// /**
//  * Обрабатываем и отображаем строковое дерево
//  *
//  * @param {string} s - исходная строка
//  * @returns - html-код дерева
//  */
// export function processTree(s: string) {
//   validateTree(s)

//   const tree = parseTree(s)
//   return generateTreeHTML(tree)
// }
