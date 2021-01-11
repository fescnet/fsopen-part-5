import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  let blog
  let component
  let mockUpdateBlog
  let mockDeleteBlog

  beforeEach(() => {

    blog = {
      title: 'This is a test. I wanna know if this blog post will be rendered correctly.',
      author: 'Mr. Tester',
      url: 'http://test-this-blog-post.dev',
      likes: 78953541214,
      user: {
        username: 'mock_username',
        name: 'Mock blog post owner',
        id: 'abc'
      },
      id: 'def'
    }

    mockUpdateBlog = jest.fn()
    mockDeleteBlog = jest.fn()
    component = render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} loggedUsername='mock_username' />
    )
  })

  test('the component displaying a blog renders the blogs title and author, but does not render its url or number of likes by default', () => {

    expect(component.container).toHaveTextContent(
      'This is a test. I wanna know if this blog post will be rendered correctly.'
    )
    expect(component.container).toHaveTextContent(
      'Mr. Tester'
    )

    // It checks if likes and URL are inside togglableContent and then verifies that togglableContent is not displayed
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveTextContent('http://test-this-blog-post.dev')
    expect(div).toHaveTextContent('78953541214')
    expect(div).toHaveStyle('display: none')
  })

  test('blogs url and number of likes are shown when the button controlling the shown details has been clicked', () => {

    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveTextContent('http://test-this-blog-post.dev')
    expect(div).toHaveTextContent('78953541214')
    expect(div).not.toHaveStyle('display: none')

  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', () => {

    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
