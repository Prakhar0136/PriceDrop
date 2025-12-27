import Image from "next/image"
import { Bell, Rabbit, Shield, TrendingDown } from "lucide-react"

import AddProductForm from "@/components/AddProductForm"
import AuthButton from "@/components/AuthButton"
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "./actions";
import ProductCard from "@/components/ProductCard";


export default async function Home() {


  const supabase = await createClient();

  const {data: { user }} = await supabase.auth.getUser();

  const products = user?await getProducts() : [];


  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description: "Experience blazing fast performance with our optimized platform."
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description: "Works across all major e-commerce platforms seamlessly."
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified when prices drop on your favorite products."
    },
  ]

  return (
    <main className="min-h-screen  bg-gradient-to-bl  from-gray-100 via-white to-gray-600">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <Image
              src="/logo2.png"
              alt="Price Lens Logo"
              width={700}
              height={300}
              className="h-10 w-auto"
            />
          </div>


          <AuthButton user = {user} />

        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-full text-sm mb-6 font-medium">
            Made with ❤️ by Prakhar
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Never miss a price drop
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track price changes across all major e-commerce platforms and get notified when prices drop.
          </p>

          <AddProductForm user={user} />

          {/* Features */}
          {products.length === 0 && (
            <div className="max-w-4xl mt-16 mx-auto grid md:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl shadow p-6 text-center border border-gray-200"
                >
                  <Icon className="h-8 w-8 text-gray-800 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      { user && products.length > 0 &&(
        <section className = "max-w-7xl mx-aut0 px-4 pb-20">
          <div className = "flex justify-between items-center mb-6">
            <h3 className = "text-2xl font-bold text-gray-900">Your tracked products</h3>
            <span className = "text-sm text-gray-600">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className = "grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {products.map(product=><ProductCard key = {product.id} product = {product}/>)}

          </div>

        </section>
        )}

      {user && products.length===0 && (
        <section className="max-w-2xl mx-auto text-center pb-20 px-4">
          
          <div className = "bg-white/80 backdrop-blur-sm border-2 border-dashed  border-gray-300 rounded-xl p-12">
            <TrendingDown className = "w-16 h-16 text-gray-400 mx-auto mb-4"/>
            <h3 className = "text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className = "text-gray-600">Add your first product above to start tracking prices!</p>
          </div>
        </section>
      )}

    </main>
  )
}
