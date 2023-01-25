import React from 'react'
import Card from '../Card'

function AccountCreated({ name, email, phone, password, status}) {
  return (
    <div className='flex justify-center pb-10'>
        <div className='border border-green-100 mt-40 bg-green-50 w-[40vw]'>
        <h1 className='text-center text-red-600 font-bold text-xl'>NOTE ALL THE REQUIRED CREDENTIALS</h1>
          <Card>
           <div className='p-4 space-y-3'>
            <h2>{`Name: ${name}`}</h2>
            <h2>{`email:${email}`}</h2>
            <h2>{`phone: ${phone}`}</h2>
            <h2>{`status: ${status}`}</h2>
            <h2>{`password: ${password}`}</h2>
           </div>
           <p className='text-center text-red-500 font-bold font-mono'>NOTE ALL THE CREDENTIALS</p>
          </Card>
        </div>
    </div>
  )
}

export default AccountCreated