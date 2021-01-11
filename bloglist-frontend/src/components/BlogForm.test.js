import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  test('the form calls the event handler it received as props with the right details when a new blog is created', () => {

    const createBlog = jest.fn()
    const component = render(
      <BlogForm createBlog={createBlog} />
    )

    const inputAuthor = component.container.querySelector('#author')
    const inputTitle = component.container.querySelector('#title')
    const inputUrl = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(inputAuthor, {
      target: { value: 'Mr. Tester' }
    })
    fireEvent.change(inputTitle, {
      target: { value: 'Title test' }
    })
    fireEvent.change(inputUrl, {
      target: { value: 'http://test.dev' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls[0][0].author).toBe('Mr. Tester' )
    expect(createBlog.mock.calls[0][0].title).toBe('Title test' )
    expect(createBlog.mock.calls[0][0].url).toBe('http://test.dev' )
  })
})
