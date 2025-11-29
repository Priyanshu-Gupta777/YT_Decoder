import React from 'react'

const VerifyEmail = () => {
  return (
    <div className='relative w-full h-[760px] overflow-hidden'>
      <div className='min-h-screen flex items-center justify-center bg-gray-900 px-4'>
        <div className='bg-gradient-to-r from-rose-50 to-neutral-700 p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
            <h2 className='text-2xl font-semibold text-green-800 mb-4'>✅ Check Your Email</h2>
            <p className='text-zinc-800 text-sm'>
                We've sent you an email to verify your account. Please check your inbox and click the verification link
            </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail