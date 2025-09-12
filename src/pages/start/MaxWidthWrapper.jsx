export default function MaxWidthWrapper ({ children })  {
  return (<>
    <div className='stack w-full max-w-3xl'>
      {children}
    </div>
  </>)
}