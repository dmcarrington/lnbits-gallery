# lnbits-gallery

A photo gallery utilizing lnbits paywalls

## Project Aims

This intends to be a self-hosted photo gallery application, allowing photographers to showcase their work, and get paid in Bitcoin. The gallery is intended to link to the owner's LNBits account, which can also be self-hosted. This application will make use of the LNBits Paywall extension to generate paywall links to generaate Lightning invoices, that when paid, provides the customer with a download link to the full-size version of a selected photo from the gallery.

TODO:
Public gallery utilizing Cloudinary as an image source.
Permissioned access to uploads:

- Upload file to Cloudinary over API, get path to image
- Generate LNBits Paywall link to uploaded file, get link to paywall page.
- Save mapping of paywall page to image in Mongo
- Populate gallery with thumbnail images, linked to paywall links
