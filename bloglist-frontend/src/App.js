import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    const getAll = async () => {
      const blogs = await blogService.getAll()
      setBlogs( blogs )
    }
    getAll()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const fadeoutMsg = () => {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const setErrorMessage = msg => {
    setIsError(true)
    setMessage(msg)
    fadeoutMsg()
  }
  const setSuccessMessage = msg => {
    setIsError(false)
    setMessage(msg)
    fadeoutMsg()
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
    }
  }

  const createBlog = async (newObject) => {
    blogFormRef.current.toggleVisibility()
    try{
      const createdBlog = await blogService.create(newObject)
      // The response do not contain a user, only the user id.
      // I had to make this correction to display the blog post owner correctly
      createdBlog.user = { ...user }
      setBlogs(blogs.concat(createdBlog))
      setSuccessMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    }
    catch(exception){
      setErrorMessage('Something went wrong')
    }
  }

  const updateBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    try{
      const returnedBlog = await blogService.update(id, changedBlog)
      returnedBlog.user = user
      // the response do not contain a user, only the user id
      // I update only the blog data because I do not want to loose user information
      setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...returnedBlog, user: { ...blog.user } }))
      setSuccessMessage(`${returnedBlog.title} updated!`)
    }
    catch(exception){
      setErrorMessage('Something went wrong')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // the backend logic for deleting blog posts was implemented in part 5
  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try{
        const response = await blogService.deleteOne(blog.id)
        if(response.status === 204){
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setSuccessMessage(`Blog ${blog.title} removed successfully`)
        }
        else {
          setErrorMessage(`It was not possible to delete blog ${blog.title} by ${blog.author}`)
        }
      }
      catch(exception){
        setErrorMessage('Something went wrong')
      }
    }
  }

  const orderedBlogs = [...blogs]
  orderedBlogs.sort((a,b) => {
    if (a.likes < b.likes) {
      return 1
    }
    if (a.likes > b.likes) {
      return -1
    }
    return 0
  })

  return (
    <div>

      {user === null ?
        <div>
          <h1>log in to application</h1>
          <Notification message={message} isError={isError} />
          <Login username={username} password={password} handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />
        </div>
        :
        <div>
          <h1>blogs</h1>
          <Notification message={message} isError={isError} />
          <p className="logged-user">{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          <Togglable showButtonLabel='new blog' hideButtonLabel='cancel' hideBtnBeforeChildren={false} ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <br />
          <div className="blog-list">
            {orderedBlogs.map(blog =>
              <Blog key={blog.id} blog={blog} updateBlog={() => updateBlog(blog.id)} deleteBlog={() => deleteBlog(blog.id)} loggedUsername={user.username} />
            )}
          </div>
        </div>
      }

    </div>
  )
}

export default App
