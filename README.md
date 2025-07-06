# lnbits-gallery

A photo gallery utilizing lnbits paywalls

## Project Aims

This intends to be a self-hosted photo gallery application, allowing photographers to showcase their work, and get paid in Bitcoin. The gallery is intended to link to the owner's LNBits account, which can also be self-hosted. This application will make use of the LNBits Paywall extension to generate paywall links to generaate Lightning invoices, that when paid, provides the customer with a download link to the full-size version of a selected photo from the gallery.
This application uses a Mongo database to store a mapping from image assets in Cloudinary to Paywall links. This s not exactly a fully decentralized setup, but may well be "good enough" for many users.
Images are loaded via an admin panel, with authentication provided via the same MongoDB. At the moment I am assuming only a single tenant per deployment.

## Prequisites

Cloudinary Account and API key. Can use the free account, but note that file size is limited to 10mb in this case
LNbits account with Paywall extension enabled
MongoDB account - free account on MongoDB Atlas is fine.

## Configuration

### Environment Variables

Using `.env.local.example` as a template:

- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME - The cloud name for your Cloudinary account
- CLOUDINARY_API_KEY - API key for your cloudinary account
- CLOUDINARY_FOLDER - Folder within the Cloudinary account to use for images for this gallery. If empty, this will pull in all media from the root of your Cloudinary account.
- NEXT_PUBLIC_NOSTR_PROFILE - optional, I just used this for the "Follow me on Nostr" link at the bottom of the page. Contains your Nostr npub
- MONGODB_URI - Connection profile string for the MongoDB instance to use for mapping images to paywall links.
- LNBITS_URL - Public address of your lnbits instance
- LNBITS_API_KEY - Admin API key of your LNBits account that you set up the paywalls for.
- PAYWALL_AMOUNT - Default amount in sats that you want to use for paywall creation.

## MongoDB

In your MongoDB instance, create a database `lnbits-gallery`, containing a collection `gallery`.

## Inital setup
Build and run the code locally as a standard npm project:
`npm install`
`npm run dev`

At this point, you should be able to open a browser, go to `http://localhost:3000` and see an empty gallery page. Now we need to create an admin user to be able to upload photos:
`curl -X POST http://localhost:3000/api/setup/admin -H "Content-Type: application/json" -d '{"username": "admin", "password": "admin123", "email": "admin@example.com"}'`
Following this, you should now be able to log in as the admin user, and start uploading photos.

## Deployment to Vercel
As a NextJS application, this application was intended to be able to deployed on Vercel. I suggest cloning this project to your own GitHub, and then deploying from there. For the MongoDB integration to work, you will need to install the "MongoDB Atlas" integration in your Vercel account, and link it to your Mongo account. 
After that, you will need to set all the environment variables above in the Vercal project, plus a `NEXTAUTH_SECRET`. Generate this with the command `openssl rand -base64 32`
