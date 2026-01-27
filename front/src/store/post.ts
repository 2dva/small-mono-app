import { pick } from '@small-mono-app/shared/src/pick'
import _ from 'lodash'
import { defineStore } from 'pinia'

const DEFAULT_POSTS_NUMBER = 3
export const CONTENT_MIN_LENGTH = 50

export interface User {
  id: string
  nick: string
  name?: string
  password: string
  createdAt: string
}

export interface Post { [k: string]: any }

export interface RootState {
  allPosts: Post[]
  counter: number
}

export const usePosts = defineStore('posts', {
  state: () =>
    ({
      allPosts: [],
      counter: 0,
    }) as RootState,
  getters: {
    getAllPosts(state) {
      return [...state.allPosts].reverse().map((post) => pick(post, ['nick', 'name', 'description']))
    },
  },
  actions: {
    init() {
      if (this.allPosts.length == 0) this.generatePosts()
    },

    getPost(id: string): Post | undefined {
      let res = this.allPosts.find((post) => post.nick === id)
      return res
    },

    generatePosts() {
      _.times(DEFAULT_POSTS_NUMBER, () => {
        this.generatePost()
      })
    },

    generatePost() {
      this.counter++
      const newPost = {
        nick: `cool-post-nick-${this.counter}`,
        name: `Post ${this.counter}`,
        description: `Description of post number ${this.counter}`,
        text: _.times(10, (j: number) => `<p>Text Paragraph ${j} of post ${this.counter}...</p>`).join(''),
      }
      this.allPosts.push(newPost)
    },

    addPost(values: Post) {
      const { nick, name, description, text } = values
      const newPost = {
        nick,
        name,
        description,
        text,
      }
      // uncomment to debug error message:
      // throw Error('ALREADY EXIST!')
      this.allPosts.push(newPost)
    },

    removePost(nick: string) {
      this.allPosts = this.allPosts.filter((post) => {
        return post.nick != nick
      })
    },
  },
})

export function generatePosts(n: number): Post[] {
  return _.times(n, (i: number) => {
    i++
    return {
      nick: `cool-post-nick-${i}`,
      name: `Post ${i}`,
      description: `Description of post ${i}`,
      text: _.times(10, (j: number) => `<p>Text Paragraph ${j} of post ${i}...</p>`).join(''),
    } as Post
  })
}
