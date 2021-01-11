const dummy = blogs => 1
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)
const favoriteBlog = (blogs) => blogs.reduce((fav, blog) => blog.likes > fav.likes? blog : fav, blogs[0])
const stats = (blogs) => {
  let authorsStats = []
  blogs.forEach((blog) => {
    const authorStats = authorsStats.find(authorStats => authorStats.author === blog.author)
    if(!authorStats){
      authorsStats.push({ author: blog.author, blogs: 1, likes: blog.likes })
    }
    else {
      const index = authorsStats.indexOf(authorStats)
      authorsStats[index].blogs++
      authorsStats[index].likes += blog.likes
    }
  })
  return authorsStats
}

const mostBlogs = (blogs) => stats(blogs).reduce((result, s) => (s.blogs >= result.blogs)? s : result, { author: '', blogs: 0, likes: 0 })
const mostLikes = (blogs) => stats(blogs).reduce((result, s) => (s.likes >= result.likes)? s : result, { author: '', blogs: 0, likes: 0 })

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
