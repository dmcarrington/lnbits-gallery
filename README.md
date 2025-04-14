# lnbits-gallery

A photo gallery utilizing lnbits paywalls

## Project Aims

This intends to be a self-hosted photo gallery application, allowing photographers to showcase their work, and get paid in Bitcoin. The gallery is intended to link to the owner's LNBits account, which can also be self-hosted. This application will make use of the LNBits Paywall extension to generate paywall links to generaate Lightning invoices, that when paid, provides the customer with a download link to the full-size version of a selected photo from the gallery.
This application uses a Mongo database to store a mapping from image assets in Cloudinary to Paywall links. These are created using the `gallery-admin` app when new images are uploaded to Cloudinary.

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

## MongoDB

In your MongoDB instance, create a database `lnbits-galler`, containing a collection `gallery`.
