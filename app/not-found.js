import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Could not find requested page, sorry! If you believe there should be something here, please contact <a href='mailto:ryanr345@gmail.com'>Ryan Rosenberg</a> with the details.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}