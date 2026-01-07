import { parseTree, validateTree, generateTreeHTML } from './tree'

describe('validateTree', () => {
  it('should check that string containing invalid symbols is not a valid tree', async () => {
    const invalidTree1 = '(1 2 3a)'
    const invalidTree2 = '1(1 2 3)'
    const invalidTree3 = '(1 (2 (4 -5 6 (7) -108 (9)) 3))'

    expect(() => validateTree(invalidTree1)).toThrow(Error)
    expect(() => validateTree(invalidTree2)).toThrow(Error)
    expect(() => validateTree(invalidTree3)).toThrow(Error)
  })

  it('should check that string containing only valid symbols can be a valid tree', async () => {
    const validTree1 = '(1 2 3)'
    const validTree2 = '(1 (2 (4 5 6 (7) 108 (9)) 3))'

    expect(() => validateTree(validTree1)).not.toThrow()
    expect(() => validateTree(validTree2)).not.toThrow()
  })
})

describe('parseTree', () => {
  it('should check that invalid tree will throw error', async () => {
    const invalidTree1 = '((((1 2)'
    const invalidTree2 = '(1 (2 ((7)(9)) 3))'
    const invalidTree3 = '(7 (9 8) (16))'

    expect(() => parseTree(invalidTree1)).toThrow(Error)
    expect(() => parseTree(invalidTree2)).toThrow(Error)
    expect(() => parseTree(invalidTree3)).toThrow(Error)
  })

  it('should check that valid tree is parsed correctly', async () => {
    const treeStr1 = '(1 2)'
    const tree1 = { val: '', nodes: [{ val: '1' }, { val: '2' }] }

    const treeStr2 = '(1 (2))'
    const tree2 = { val: '', nodes: [{ val: '1', nodes: [{ val: '2' }] }] }

    expect(parseTree(treeStr1)).toEqual(tree1)
    expect(parseTree(treeStr2)).toEqual(tree2)
  })
})

describe('generateTreeHTML', () => {
  it('should check generated tree html', async () => {
    const treeStr1 = '(1 2)'
    const treeHtml1 = '    1\r\n    2'

    const treeStr2 = '(1 (2))'
    const treeHtml2 = '    1---+\r\n        2'

    const treeStr3 = '(11 (2) 3)'
    const treeHtml3 = '    11---+\r\n    |    2\r\n    3'

    const rootObject1 = parseTree(treeStr1)
    expect(generateTreeHTML(rootObject1)).toEqual(treeHtml1)

    const rootObject2 = parseTree(treeStr2)
    expect(generateTreeHTML(rootObject2)).toEqual(treeHtml2)

    const rootObject3 = parseTree(treeStr3)
    expect(generateTreeHTML(rootObject3)).toEqual(treeHtml3)
  })
})
