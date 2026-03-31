# Sumlin Family Website Features

This document is a current feature inventory for the Sumlin Family Reunion website.

## Website Purpose

The website is a family reunion hub that combines:

- Reunion information and family storytelling
- Fundraiser and donation flows
- Event publishing and signups
- Family business directory management
- Newsletter archive publishing
- Contact and service request intake
- Admin operations for orders, tickets, and communications

## Public Website Features

### Main navigation

The public site includes navigation for:

- Home
- Family Legacy
- Family Portraits
- Events
- Business Corner
- Newsletter
- Donate
- Admin

The header also includes:

- A mobile menu
- A live cart count
- A fundraiser shortcut button

### Homepage

The homepage presents the main reunion message and acts as the front door for:

- Reunion branding and family identity
- Calls to action for fundraiser support
- Navigation into events, legacy content, and public pages

### Family Legacy

The legacy section highlights:

- Family heritage
- Crest and legacy storytelling
- Reunion mission and identity

### Reunion 2026 page

This page provides the reunion landing experience for the 2026 event, including:

- Reunion positioning and event framing
- Family-focused messaging
- Public reunion overview

### Events and family calendar

The events area supports:

- Upcoming reunion events
- Planning calls and family updates
- Public event schedule viewing

### Family portraits

The portraits page promotes:

- Family portrait sessions
- Multi-generational photography
- Keepsake and memory-focused photo opportunities

### Business Corner

The family business area supports:

- Public browsing of family-owned businesses
- Business directory submissions
- Event signup access
- Contact and service inquiry support tied to family businesses

### Newsletter archive

The newsletter area supports:

- Featured latest newsletter download
- Archived newsletter browsing
- Family announcements and update history

### Contact page

The contact page includes:

- Contact details for the family
- Officer contact references
- Support paths for reunion questions, fundraiser help, business inquiries, and portrait requests
- A contact form that saves service requests to Supabase

### Donate page

The donation flow supports:

- General family support donations
- PayPal payment redirection
- Donation context passed from fundraiser checkout
- Display of reserved tickets, purchaser info, amount due, and reference code

### Fundraiser store

The fundraiser storefront supports:

- Public fundraising messaging
- Basket and ticket support flow
- Official rules access
- Cart-based ticket selection

### Product detail pages

Product detail pages support:

- Viewing individual fundraiser items
- Adding items to the cart

### Success page

The success page supports:

- Order confirmation display
- Reference code display
- Date, payment method, and entry count display
- Ticket numbers grouped by raffle
- Cash App payment instructions for manual confirmation flows
- Printable confirmation view

### Policy and informational routes

The site includes:

- Fundraiser rules/disclaimer page
- Shipping policy route
- Returns policy route
- Custom 404 page

## Fundraiser and Checkout Features

### Shopping cart

The cart supports:

- Add/remove/update cart items
- Live cart quantity count in the header
- Slide-out cart UI

### Order reservation flow

The fundraiser order flow supports:

- Order creation in Supabase
- Entry count calculation
- Donation amount calculation
- Ticket assignment and reservation
- Reference code creation

### Payment methods

The current flow supports:

- PayPal-directed payment flow
- Cash App / manual payment flow

### Ticket handling

The system supports:

- Ticket generation
- Ticket grouping by raffle
- Ticket display on donate and success pages
- Ticket visibility in the admin dashboard

### Payment approval

Admin users can:

- Mark pending orders as paid
- Trigger automatic thank-you email delivery when payment is approved
- Resend order-related emails manually

## Admin Dashboard Features

The admin dashboard is the operational control center for the site.

### Authentication and access

The admin system supports:

- Admin sign up
- Admin sign in
- Admin sign out
- Invite claiming for approved admins
- Role-based access through Supabase

### Dashboard data

The admin area loads:

- Tenant profile data
- Orders
- Tickets
- Admin list
- Invites
- Events
- Event signups
- Business listings
- Service requests

### Orders / Payment Command Center

The orders section supports:

- Review of fundraiser orders
- Order filtering by payment status
- Ticket review by raffle
- Payment approval
- Thank-you / order email sending
- Order deletion
- CSV export

### Communications

The admin communications section supports:

- Sending family emails through Resend
- Custom recipient lists
- Subject line editing
- Preview text editing
- Email heading editing
- Multi-paragraph message content
- Optional CTA button label and URL
- Reply-to email configuration
- Custom signature

### Tickets

The tickets area supports:

- Viewing assigned tickets
- Reviewing raffle names
- Reviewing order linkage
- Deleting individual tickets

### Events management

Admins can:

- Create events
- Edit events
- Publish event details
- Set dates, locations, deadlines, and calendar links
- Delete events and related signups

### Newsletter management

Admins can:

- Upload newsletter files
- Set newsletter title and issue date
- Publish newsletter descriptions
- View the published archive
- Delete newsletter documents

### Business management

Admins can:

- Add business listings
- Edit business listings
- Manage category, description, pricing label, sort order, and featured status

### Access management

Admins can:

- Invite other admins
- Assign admin roles
- Review active admins
- Review pending invites

### Family settings

Admins can update:

- Display name
- Support email
- Support phone
- Business Corner headline and summary
- Cash App handle
- Venmo handle
- PayPal donation URL
- Public calendar URL
- Embedded calendar URL
- Primary CTA label

## Data and Backend Features

### Supabase integration

The site uses Supabase for:

- Authentication
- Database access
- Tenant-based admin access
- Fundraiser orders
- Fundraiser tickets
- Events
- Event signups
- Service requests
- Business listings
- Newsletter records

### Admin RPC workflows

The codebase includes admin RPC-backed workflows for:

- Dashboard loading
- Payment status updates
- Ticket deletion
- Event deletion
- Order deletion
- Admin invite handling

### Newsletter file publishing

Newsletter publishing uses:

- Supabase storage for uploaded files
- Database records for archive display

## Email Features

The site is now connected to Resend for email delivery.

### Order emails

The order email system supports:

- HTML confirmation emails
- Plain-text fallback emails
- Reserved-order emails for pending payments
- Thank-you emails after payment confirmation
- Ticket number grouping by raffle
- Support reply-to handling

### Family communications

Admins can send styled HTML family emails for:

- Family announcements
- Donation requests
- Reunion reminders
- Thank-you messages
- General communications

### Email security model

Email sending is implemented through server-side API routes so:

- `RESEND_API_KEY` stays off the client
- Admin session verification happens before email sends
- Order data is loaded securely before confirmation emails are sent

## UX and Frontend Features

The site includes:

- Responsive navigation
- Mobile menu support
- Animated UI with Framer Motion
- Sticky header
- Slide-out shopping cart
- Scroll restoration
- Print-friendly order confirmation flow

## Existing Legacy or Secondary Routes

A few routes still exist in the codebase outside the main Sumlin family flow:

- `/shop`
- `/about`
- `/testimonials`
- Older storefront-style content references

These appear to be legacy or secondary routes compared with the current reunion-focused experience.

## Current Feature Summary

At this point the website functions as:

- A public reunion website
- A fundraiser and ticket intake system
- A donation support system
- A family business directory
- A newsletter publishing archive
- An event calendar and signup tool
- A Supabase-backed admin panel
- A Resend-powered email communication system
