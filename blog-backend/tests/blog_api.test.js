const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)

let token

beforeEach(async () => {

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('123456', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})
  for(let blog of helper.initialBlogs){
    blog.user = user._id
    let blogObject = new Blog(blog)
    await blogObject.save()
    user.blogs = user.blogs.concat(blogObject._id)
  }
  await user.save()
})

describe('checking the list', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    // expect(response.body[0]._id).not.toBeDefined()
  })
})

describe('checking the blog creation', () => {
  test('added a valid blog record', async () => {
    const blog = {
      title: 'this is a new blog',
      author: 'Fernando',
      likes: 1,
      url: 'http://localhost:3001'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('this is a new blog')
  })

  test('likes prop default to the value 0', async () => {
    const blog = {
      title: 'likes default to zero',
      author: 'Fernando',
      url: 'http://localhost:3001'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)

    const blogsAtEnd = await helper.blogsInDb()
    const createdBlog = blogsAtEnd.find(b => b.title === 'likes default to zero')
    expect(createdBlog.likes).toBe(0)
  })

  test('title and url validation are working', async () => {
    const blog = {
      author: 'Fernando',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(400)
  })
})

describe('checking deleting process', () => {
  test('delete a single record works', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToDelete = blogsInDb[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsInDb.length - 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('checking updating process', () => {
  test('it is possible to change likes amount', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes++
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogUpdated = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    expect(blogUpdated).toEqual(blogToUpdate)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
