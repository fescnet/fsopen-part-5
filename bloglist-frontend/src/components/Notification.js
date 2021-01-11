import React from 'react'
const Notification = ({ message, isError }) => {
  const className = isError ? 'error' : 'success'
  if(!message){
    return null
  }
  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification
