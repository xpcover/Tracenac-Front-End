import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className='h-screen text-center w-full flex justify-center items-center'>
        <div>
            <h1 className='text-2xl font-semibold'>404 - Page not found</h1>
            <Link to="/" className='underline text-blue-500'>Go to Home</Link>
        </div>
    </div>
  )
}

export default NotFoundPage
