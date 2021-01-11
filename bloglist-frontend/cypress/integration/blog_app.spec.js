describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#login_button').click()
  })

  describe('Login',function() {

    beforeEach(function() {
      cy.createUser({ username: 'fernando', name: 'Fernando', password: '123456' })
    })

    it('succeeds with correct credentials', function() {
      cy.get('#username').type('fernando')
      cy.get('#password').type('123456')
      cy.get('#login_button').click()
      cy.get('.logged-user').contains('Fernando logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('fernando')
      cy.get('#password').type('abcdef')
      cy.get('#login_button').click()
      cy.get('.error').contains('Wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  // if you want to execute only the describe block below:
  // describe.only('When logged in', function() {
  describe('When logged in', function() {

    beforeEach(function() {
      cy.createUser({ username: 'fernando', name: 'Fernando', password: '123456' })
      cy.login({ username: 'fernando', password: '123456' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Testing the blog post creation with cypress')
      cy.get('#author').type('Mr. Tester')
      cy.get('#url').type('http://testing-the-blog-post-creation.dev')
      cy.get('#submit_new_blog_form').click()
      //success message
      cy.contains('a new blog Testing the blog post creation with cypress by Mr. Tester added')
      //The test has to ensure that a new blog is added to the list of all blogs.
      cy.get('.blog-list').contains('Testing the blog post creation with cypress Mr. Tester')
    })

    describe('And there is only a blog', function() {

      beforeEach(function() {
        cy.createBlog({
          title: 'This is a blog post created throught an http post',
          author: 'Mr. Tester',
          url: 'http://this-is-a-test.dev'
        })
      })

      it('user can like a blog', function() {
        cy.contains('This is a blog post created throught an http post').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').find('#likes').contains('likes 0')
        cy.get('@theBlog').find('#like_button').click()
        cy.get('@theBlog').find('#likes').contains('likes 1')
      })

      it('user who created a blog can delete it', function() {
        cy.contains('This is a blog post created throught an http post').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').find('#remove_button').click()
        cy.get('.blog-list').should('not.contain', 'This is a blog post created throught an http post Mr. Tester')
      })

      it('other users cannot delete the blog', function() {
        cy.createUser({ username: 'second_user', name: 'Second', password: 'abcdef' })
        cy.login({ username: 'second_user', password: 'abcdef' })
        cy.contains('This is a blog post created throught an http post').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').find('#remove_button').should('not.exist')
        // .should('not.contain', 'remove')
      })
    })

    it('blogs are ordered according to likes with the blog with the most likes being first', function() {
      // sorted array
      const blogs = [
        {
          title: 'This one should be the first',
          author: 'Mr. Tester',
          url: 'http://this-is-a-test.dev',
          likes: 10
        },
        {
          title: 'This one should be between first and last',
          author: 'Mr. Tester',
          url: 'http://this-is-a-test.dev',
          likes: 5
        },
        {
          title: 'This one should be the last',
          author: 'Mr. Tester',
          url: 'http://this-is-a-test.dev',
          likes: 2
        }
      ]
      //unsorted creation
      cy.createBlog(blogs[1])
      cy.createBlog(blogs[2])
      cy.createBlog(blogs[0])
      // check
      cy.get('.blog-list').find('.blog-list-item').each(($el, index) => {
        cy.wrap($el).contains(blogs[index].title)
      })
    })
  })
})
