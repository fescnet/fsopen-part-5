import React from 'react'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, loggedUsername }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeBtnStyle = {
    borderRadius: 5,
    backgroundColor: '#4085F6',
    border: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  }

  let removeButton = ''
  if(loggedUsername === blog.user.username){
    removeButton = <button onClick={deleteBlog} id="remove_button" style={removeBtnStyle}>remove</button>
  }

  return (
    <div style={blogStyle} className="blog-list-item">
      {blog.title} {blog.author}
      <Togglable showButtonLabel='view' hideButtonLabel='hide' hideBtnBeforeChildren={true}>
        <div>{blog.url}</div>
        <div id="likes">likes {blog.likes} <button onClick={updateBlog} id="like_button">like</button></div>
        <div>{blog.user.name}</div>
        {removeButton}
      </Togglable>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Blog
