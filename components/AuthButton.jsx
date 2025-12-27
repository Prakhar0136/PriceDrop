"use client"
import React from 'react'
import {Button} from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useState } from 'react'
import { AuthModal } from './AuthModal'
import { signOut } from '@/app/actions'



const AuthButton = ({user}) => {
    const [showAuthModal, setShowAuthModal] = useState(false);

    if(user){
    return (
        <form action = {signOut}>
            <Button variant = "ghost" className = "gap-2" type = "submit" size = "sm">
                <LogOut className="h-4 w-4" />
                Sign Out
            </Button>
        </form>
    )
    }

  return (
    <>
    
        <Button
        onClick={() => setShowAuthModal(true)}
        variant="default"
        className="bg-gray-800 hover:bg-gray-600 gap-2"
        size="sm"
        >
            <LogIn className="h-4 w-4" />
            Sign In
        </Button>

        <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        />
    </>
  )
}

export default AuthButton
