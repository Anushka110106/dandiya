# Team Welcome - Dandiya Event 2025 💃🔥

A modern, festive event website for Team Welcome's Dandiya Event 2025 featuring real payment processing and automated email confirmations.

## Features

### Frontend Innovations
- **Interactive Dandiya Tutorial**: Step-by-step guide with animations
- **Dynamic Event Schedule**: Expandable timeline with detailed activities
- **Live Social Media Wall**: Real-time social buzz simulation
- **Dress Code Gallery**: Comprehensive styling guide with categories
- **Countdown Timer**: Real-time countdown to event date
- **Responsive Design**: Mobile-first approach with smooth animations

### Backend Integration
- **Supabase Database**: Secure registration data storage
- **Payment Processing**: Stripe integration for secure transactions
- **Email Automation**: Automated confirmation emails with ticket IDs
- **Unique Ticket Generation**: Auto-generated unique ticket codes

## Setup Instructions

### 1. Supabase Setup
1. Click the "Connect to Supabase" button in the top right
2. Create a new Supabase project or connect existing one
3. The database schema will be automatically created via migrations

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
# Supabase (auto-filled when connected)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (for payment processing)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email (for confirmation emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Payment Gateway Setup
For production use, you'll need to:
1. Create a Stripe account
2. Get your API keys from Stripe Dashboard
3. Configure webhook endpoints for payment confirmations

### 4. Email Service Setup
For production email sending:
1. Set up an email service (Gmail, SendGrid, Mailgun, etc.)
2. Configure SMTP credentials in environment variables
3. Update the email service integration in the Edge Functions

## Database Schema

The application uses a `registrations` table with:
- User information (name, email, phone)
- Ticket details (quantity, amount, status)
- Payment tracking (Stripe payment intent ID)
- Unique ticket ID generation
- Timestamps for audit trail

## Edge Functions

### `/process-payment`
- Handles registration data
- Creates Stripe payment intent
- Stores registration in database
- Returns client secret for frontend payment

### `/confirm-payment`
- Verifies payment with Stripe
- Updates registration status
- Triggers email confirmation

### `/send-confirmation-email`
- Sends beautifully formatted HTML emails
- Includes ticket details and event information
- Provides clear instructions for attendees

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (if added)
npm run test
```

## Deployment

The application is ready for deployment to any modern hosting platform. Ensure all environment variables are properly configured in your deployment environment.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (Database + Edge Functions)
- **Payment**: Stripe
- **Email**: SMTP integration
- **Icons**: Lucide React

## Cultural Elements

The website incorporates authentic Navratri and Dandiya cultural elements:
- Traditional color schemes (red, orange, yellow, gold)
- Cultural terminology and greetings
- Festive emojis and iconography
- Traditional dance step tutorials
- Authentic dress code guidance

---

Built with ❤️ for the Dandiya community by Team Welcome