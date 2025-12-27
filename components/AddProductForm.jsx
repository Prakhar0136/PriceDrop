"use client"
import { Input } from "@/components/ui/input"
import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { AuthModal } from "./AuthModal"
import { addProduct } from "@/app/actions"
import { toast } from "sonner"


const AddProductForm = ({user}) => {
  const[url, setUrl] = useState("")
  const[loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user){
        setShowAuthModal(true);
        return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("url", url);
    const result = await addProduct(formData);

    if(result.error){
      toast.error(result.error)
    }
    else{
      toast.success(result.message || "Product tracked successfully!")
      setUrl("")
    }
    setLoading(false);
  }

  return (
    <>
    <form onSubmit = {handleSubmit} className = "w-full max-w-2xl mx-auto">
      <div className = "flex flex-col sm:flex-row gap-2">
        <Input type = "url"
        value = {url}
        onChange = {(e)=>setUrl(e.target.value)}
        placeholder ="Paste product url"
        className = "h-12 text-base border-gray-800 flex-grow text-center"
        required
        disabled = {loading}
        />

        <Button className = "bg-gray-800 hover:bg-gray-500 h-12 text-base flex-shrink-0">
          {loading ?(
            <>
             <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Adding...
            </>
          ):(
            "Track Price"
          )}
        </Button>
      </div>
    </form>

    <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
    />


  </>
  )
}

export default AddProductForm
