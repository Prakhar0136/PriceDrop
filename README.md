PriceLens – Product Price Tracker App


PriceLens is a modern web application that allows users to track product prices over time and get notified when prices drop. It helps users make smarter buying decisions by monitoring prices automatically.


Features:

User authentication using email

Add products by pasting product URLs

Automatically fetch product name, price, currency, and image

Track price changes over time

Email notifications when a price drops

Dashboard to view all tracked products

Fully deployed on Vercel

Clean and responsive UI



Tech Stack:

Frontend:

Next.js (App Router)

React

Tailwind CSS


Backend:

Next.js Server Actions

Supabase (Auth + Database)


Services:

Firecrawl API (for product scraping)

Resend (for email notifications)

Vercel (deployment)



How It Works

User signs up or logs in using email

User pastes a product URL

PriceLens scrapes product details automatically

Product price is stored in the database

Background price checks compare old and new prices

If a price drop is detected, an email alert is sent



Environment Variables

Create a .env.local file in the root directory and add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
RESEND_API_KEY=your_resend_api_key

Do not commit .env.local to GitHub.



Deployment

The project is deployed using Vercel.

Steps:

Push code to GitHub

Import repository into Vercel

Add environment variables in Vercel dashboard

Deploy



Security Notes

.env files are ignored using .gitignore

Sensitive keys are never exposed to the client

Server-only logic is handled using "use server"



Future Improvements

Browser extension

Mobile-friendly PWA version

Telegram / WhatsApp alerts



Project Status

Completed and successfully deployed 



Author: Prakhar Shakya

Author

Built by Prakhar Shakya
